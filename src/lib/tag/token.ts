import { type Result } from '$lib/result';

export abstract class BaseTokenError extends Error {
  constructor(
    message: string,
    public index: number
  ) {
    super(message);
  }
}

export class ExpectedWhitespaceError extends BaseTokenError {
  constructor(public index: number) {
    super(`Expected whitespace at index ${index}`, index);
  }
}

export class InvalidCharacterError extends BaseTokenError {
  constructor(
    public index: number,
    public char: string
  ) {
    super(`Invalid character '${char}' at index ${index}`, index);
  }
}

export enum TokenType {
  Tag = 'Tag',
  And = 'And',
  Or = 'Or',
  Not = 'Not',
  OpenGroup = 'OpenGroup',
  CloseGroup = 'CloseGroup'
}

export type Token = {
  type: TokenType;
  value: string;
  startIndex: number;
};

const tagCharPattern = /[a-zA-Z0-9.]/;

// symbolic operators' whitespace requirements
// - `&`, whitespace NOT required to separate
// - `|`, whitespace NOT required to separate
// - `-`, left whitespace IS required to separate, right whitespace NOT required
//   to separate
// - `!`, whitespace NOT required to separate
// - `(`, whitespace NOT required to separate
// - `)`, whitespace NOT required to separate
//
// this is how emp does it, not my rules

export function tokenize(taglist: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  // set to true by default because start of string is effectively a whitespace boundary
  let lastWasWhitespace = true;

  while (i < taglist.length) {
    const c = taglist.charAt(i);

    if (/^\s$/.test(c)) {
      i++;
      lastWasWhitespace = true;
    } else {
      if (c === '(') {
        tokens.push({ type: TokenType.OpenGroup, value: c, startIndex: i });
        i++;
      } else if (c === ')') {
        tokens.push({ type: TokenType.CloseGroup, value: c, startIndex: i });
        i++;
      } else if (c === '|') {
        tokens.push({ type: TokenType.Or, value: c, startIndex: i });
        i++;
      } else if (c === '&') {
        tokens.push({ type: TokenType.And, value: c, startIndex: i });
        i++;
      } else if (c === '!' || c === '-') {
        if (c === '-' && !lastWasWhitespace) {
          throw new ExpectedWhitespaceError(i);
        }
        tokens.push({ type: TokenType.Not, value: c, startIndex: i });
        i++;
      } else if (!tagCharPattern.test(c)) {
        throw new InvalidCharacterError(i, c);
      } else {
        const startIndex = i;
        while (i < taglist.length && tagCharPattern.test(taglist.charAt(i))) {
          i++;
        }
        const value = taglist.slice(startIndex, i);
        let type = TokenType.Tag;

        if (value.toLowerCase() === 'and') {
          type = TokenType.And;
        } else if (value.toLowerCase() === 'or') {
          type = TokenType.Or;
        } else if (value.toLowerCase() === 'not') {
          type = TokenType.Not;
        }

        tokens.push({ type, value, startIndex });
      }
      lastWasWhitespace = false;
    }
  }

  return tokens;
}

export function safeTokenize(taglist: string): Result<Token[], BaseTokenError> {
  try {
    return { success: true, value: tokenize(taglist) };
  } catch (e) {
    if (e instanceof BaseTokenError) {
      return { success: false, error: e };
    }
    throw e;
  }
}
