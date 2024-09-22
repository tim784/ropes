import { safeTokenize, BaseTokenError } from './token';
import { safeParseAst, AstNodeType, type AstNode, BaseParseAstError } from './ast';
import { type Result } from '$lib/result';

export class UnsupportedNodeError extends Error {
  constructor(public node: AstNode) {
    super(`Unsupported node type '${node.type}'`);
  }
}

export class InvalidNegationError extends Error {
  constructor(public negationChar: string) {
    super(`Invalid negation character '${negationChar}'`);
  }
}

export class DuplicateTagError extends Error {
  constructor(public tagName: string) {
    super(`Duplicate tag name '${tagName}'`);
  }
}

const negationChars = ['-', '!'] as const;
type NegationChar = (typeof negationChars)[number];

export function isNegationChar(char: string): char is NegationChar {
  return negationChars.includes(char as NegationChar);
}

export class Tag {
  static readonly DEFAULT_NEGATION_CHAR: string = '-';

  private constructor(
    public readonly negationChar: string | undefined,
    public readonly name: string
  ) {}

  static create(negationChar: string | undefined, name: string): Result<Tag, InvalidNegationError> {
    if (negationChar !== undefined && !isNegationChar(negationChar)) {
      return { success: false, error: new InvalidNegationError(negationChar) };
    }

    return { success: true, value: new Tag(negationChar, name.toLowerCase()) };
  }

  static fromNode(node: AstNode): Result<Tag, UnsupportedNodeError | InvalidNegationError> {
    if (node.type === AstNodeType.Tag) {
      return Tag.create(undefined, node.tag);
    } else if (node.type === AstNodeType.Not) {
      const tagResult = Tag.fromNode(node.tagNode);
      if (!tagResult.success) {
        return tagResult;
      }
      return {
        success: true,
        value: tagResult.value.negate()
      };
    } else {
      return { success: false, error: new UnsupportedNodeError(node) };
    }
  }

  static fromString(
    s: string
  ): Result<Tag, BaseTokenError | BaseParseAstError | UnsupportedNodeError | InvalidNegationError> {
    const tokens = safeTokenize(s);
    if (!tokens.success) {
      return tokens;
    }

    const ast = safeParseAst(tokens.value);
    if (!ast.success) {
      return ast;
    }

    return Tag.fromNode(ast.value);
  }

  get isNegated(): boolean {
    return this.negationChar !== undefined;
  }

  toString(): string {
    return (this.negationChar ?? '') + this.name;
  }

  negate(): Tag {
    return new Tag(this.isNegated ? undefined : Tag.DEFAULT_NEGATION_CHAR, this.name);
  }
}

export enum TaglistWarnings {
  OnlyNegated
}

/**
 * A taglist.
 *
 * We only support tags (joined by explicit or implicit ANDs) and negation.
 */
export class Taglist {
  private constructor(public readonly tags: Tag[]) {}

  private static create(tags: Tag[]): Result<Taglist, DuplicateTagError> {
    const tagNameSet = new Set<string>();
    for (const tag of tags) {
      if (tagNameSet.has(tag.name)) {
        return { success: false, error: new DuplicateTagError(tag.name) };
      }
      tagNameSet.add(tag.name);
    }
    return { success: true, value: new Taglist(tags) };
  }

  static fromNode(
    node: AstNode
  ): Result<Taglist, DuplicateTagError | UnsupportedNodeError | InvalidNegationError> {
    let taglistResult: Result<Taglist, DuplicateTagError>;
    if (node.type === AstNodeType.And) {
      const left = Taglist.fromNode(node.left);
      if (!left.success) {
        return left;
      }

      const right = Taglist.fromNode(node.right);
      if (!right.success) {
        return right;
      }

      taglistResult = Taglist.create([...left.value.tags, ...right.value.tags]);
    } else if (node.type === AstNodeType.Empty) {
      taglistResult = Taglist.create([]);
    } else {
      const tag = Tag.fromNode(node);
      if (!tag.success) {
        return tag;
      }

      taglistResult = Taglist.create([tag.value]);
    }

    return taglistResult;
  }

  static fromString(
    s: string
  ): Result<
    Taglist,
    | BaseTokenError
    | BaseParseAstError
    | DuplicateTagError
    | UnsupportedNodeError
    | InvalidNegationError
  > {
    const tokens = safeTokenize(s);
    if (!tokens.success) {
      return tokens;
    }

    const ast = safeParseAst(tokens.value);
    if (!ast.success) {
      return ast;
    }

    return Taglist.fromNode(ast.value);
  }

  /**
   * It's up to the caller to ensure that the tag is not already in the list.
   * @param tag The tag to add.
   */
  add(tag: Tag): void {
    this.tags.push(tag);
  }

  removeIndex(index: number): Tag | undefined {
    if (index < 0 || index >= this.tags.length) {
      return undefined;
    }
    return this.tags.splice(index, 1)[0];
  }

  hasByName(name: string): boolean {
    return this.tags.some((tag) => tag.name === name.toLowerCase());
  }

  toString(): string {
    return this.tags.map((tag) => tag.toString()).join(' ');
  }

  get warnings(): TaglistWarnings[] {
    if (this.tags.length > 0 && this.tags.every((tag) => tag.isNegated)) {
      return [TaglistWarnings.OnlyNegated];
    }
    return [];
  }
}
