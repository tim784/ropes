export class TaglistTag {
  static readonly DEFAULT_NEGATION_CHAR = '-';

  constructor(
    public readonly negationChar: string,
    public readonly name: string
  ) {}

  static empty(): TaglistTag {
    return new TaglistTag('', '');
  }

  static fromString(s: string): TaglistTag {
    let negationChar = '';
    let name = normalizeTag(s);

    const firstChar = s.charAt(0);
    const isNegated = '-!'.includes(firstChar);
    if (isNegated) {
      negationChar = firstChar;
      name = normalizeTag(s.slice(1));
    }

    return new TaglistTag(negationChar, name);
  }

  static toTaglist(tags: TaglistTag[]): string {
    return tags.map((tag) => tag.toString()).join(' ');
  }

  static validateSyntax(taglist: string): TaglistTag[] {
    return validateTaglistSyntax(taglist);
  }

  get isNegated(): boolean {
    return this.negationChar.length > 0;
  }

  toString(): string {
    return this.negationChar + this.name;
  }

  /**
   * Creates a new TaglistTag with the same negation status as this one, but with the given name.
   * @param name the name of the new tag
   * @returns a new TaglistTag
   */
  withName(name: string): TaglistTag {
    return new TaglistTag(this.negationChar, name);
  }

  negate(): TaglistTag {
    return new TaglistTag(this.isNegated ? '' : TaglistTag.DEFAULT_NEGATION_CHAR, this.name);
  }

  validate(): [boolean, string | undefined] {
    try {
      validateTaglistSyntax(this.toString());
      return [true, undefined];
    } catch (e) {
      if (e instanceof ParseError) {
        return [false, e.message];
      }
      throw e;
    }
  }

  equals(other: any): boolean {
    if (!(other instanceof TaglistTag)) {
      return false;
    }
    return this.name === other.name && this.isNegated === other.isNegated;
  }
}

export type CacheTag = {
  name: string;
  count: number;
  exact?: boolean;
};

export function normalizeTag(tag: string): string {
  return tag.toLowerCase();
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

/**
 * Parse a taglist string into an array of TaglistTag objects.
 *
 * Does not support parentheses or OR operators. Throws errors if there are any,
 * or if there is other grammar we can't understand (or is simply nonsense).
 *
 * @param taglist the taglist to parse
 *
 * @returns the parsed taglist
 */
function validateTaglistSyntax(taglist: string | undefined): TaglistTag[] {
  // operators not requiring whitespace separation: (, ), |, &, !, -
  // operators requiring whitespace separation: and, or, not
  // everything else is [a-zA-Z0-9.]
  if (taglist === undefined) {
    return [];
  }

  const unsupportedOperators = ['(', ')', '|', 'or'];

  // first, split by whitespace
  const whitespaceTokens = normalizeTag(taglist).split(/\s+/);

  // then, split by operators
  const tokens = whitespaceTokens.flatMap((whitespaceToken) => {
    let tokens = [];
    let token = '';
    for (const [index, char] of [...whitespaceToken].entries()) {
      if (index !== 0 && (char === '!' || char === '-')) {
        throw new ParseError('Negation operator should be at start of token');
      }

      if (
        char === '(' ||
        char === ')' ||
        char === '|' ||
        char === '&' ||
        char === '!' ||
        char === '-'
      ) {
        if (token.length > 0) {
          tokens.push(token);
          token = '';
        }
        tokens.push(char);
      } else if (/[a-z0-9.]/.test(char)) {
        token += char;
      } else {
        throw new ParseError(`Character "${char}" should be in [a-z0-9.]`);
      }
    }
    if (token.length > 0) {
      tokens.push(token);
    }
    return tokens;
  });

  // check for unsupported operators
  if (tokens.some((token) => unsupportedOperators.includes(token))) {
    throw new ParseError('Parentheses and OR operators are not supported');
  }

  // filter out AND operators, these are noops
  const andsFiltered = tokens.filter((token) => token !== '&' && token !== 'and');

  // negate all tokens that are preceded by a NOT operator (not, !, -), and
  // don't allow double negation or trailing negation
  const negatesApplied = andsFiltered.reduce<[string[], boolean]>(
    ([acc, negateNext], token, index) => {
      if (token === '!' || token === '-' || token === 'not') {
        if (index === andsFiltered.length - 1) {
          throw new ParseError('Negation operator should not be at end of taglist');
        }
        if (negateNext) {
          throw new ParseError('Negation should not be doubled');
        }
        return [acc, true];
      } else {
        acc.push(negateNext ? TaglistTag.DEFAULT_NEGATION_CHAR + token : token);
        return [acc, false];
      }
    },
    [[], false]
  )[0];

  // convert to TaglistTag
  const taglistTags = negatesApplied.map((tag) => TaglistTag.fromString(tag));

  const uniqueTagMap = new Map<string, TaglistTag>();
  const dedupedTaglistTags = [];
  for (const tag of taglistTags) {
    if (!uniqueTagMap.has(tag.name)) {
      uniqueTagMap.set(tag.name, tag);
      dedupedTaglistTags.push(tag);
    } else {
      // see if we're equal or not
      const existingTag = uniqueTagMap.get(tag.name)!;
      if (existingTag.equals(tag)) {
        // if we are, just skip it
        continue;
      } else {
        throw new ParseError(`Tag "${tag.name}" is duplicated with different negation`);
      }
    }
  }

  return dedupedTaglistTags;
}
