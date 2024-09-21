import { safeTokenize } from './token';
import { safeParseAst, AstNodeType, type AstNode } from './ast';
import { type Result } from '$lib/result';

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

  static create(negationChar: string | undefined, name: string): Result<Tag, string> {
    if (negationChar !== undefined && !isNegationChar(negationChar)) {
      return { success: false, error: `Invalid negation character: ${negationChar}` };
    }

    return { success: true, value: new Tag(negationChar, name) };
  }

  static fromNode(node: AstNode): Result<Tag, string> {
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
      return { success: false, error: `Invalid node type: ${node.type}` };
    }
  }

  static fromString(s: string): Result<Tag, string> {
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

  /**
   * Creates a new TaglistTag with the same negation status as this one, but with the given name.
   * @param name the name of the new tag
   * @returns a new TaglistTag
   */
  withName(name: string): Tag {
    return new Tag(this.negationChar, name);
  }

  negate(): Tag {
    return new Tag(this.isNegated ? undefined : Tag.DEFAULT_NEGATION_CHAR, this.name);
  }

  /**
   * Compare this tag to another tag.
   *
   * @param other Another tag to compare to
   *
   * @returns Returns true if the tags names are equal and the negation status is equal.
   */
  equals(other: unknown): boolean {
    if (!(other instanceof Tag)) {
      return false;
    }
    return this.name === other.name && this.isNegated === other.isNegated;
  }
}

// TODO: a taglist of only negated tags yields no results. we should fail to
// parse this case. UPDATE: actually, we should parse, but just warn the user
// because its possible that they're in the middle of typing a taglist and
// haven't finished it yet.

/**
 * A taglist.
 *
 * We only support tags (joined by explicit or implicit ANDs) and negation.
 */
export class Taglist {
  private constructor(public readonly tags: Tag[]) {}

  static create(tags: Tag[]): Taglist {
    return new Taglist(tags);
  }

  static fromNode(node: AstNode): Result<Taglist, string> {
    if (node.type === AstNodeType.And) {
      const left = Taglist.fromNode(node.left);
      if (!left.success) {
        return left;
      }

      const right = Taglist.fromNode(node.right);
      if (!right.success) {
        return right;
      }

      return { success: true, value: Taglist.create([...left.value.tags, ...right.value.tags]) };
    } else {
      const tag = Tag.fromNode(node);
      if (!tag.success) {
        return tag;
      }

      return { success: true, value: Taglist.create([tag.value]) };
    }
  }

  static fromString(s: string): Result<Taglist, string> {
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

  add(tag: Tag): void {
    this.tags.push(tag);
  }

  hasByName(name: string): boolean {
    return this.tags.some((tag) => tag.name === name);
  }

  toString(): string {
    return this.tags.map((tag) => tag.toString()).join(' ');
  }
}
