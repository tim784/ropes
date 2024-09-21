import { type Result } from '$lib/result';

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
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

export function tokenize(taglist: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < taglist.length) {
    const c = taglist.charAt(i);

    if (/^\s$/.test(c)) {
      i++;
      continue;
    }

    if (c === '(') {
      tokens.push({ type: TokenType.OpenGroup, value: c, startIndex: i });
      i++;
      continue;
    }

    if (c === ')') {
      tokens.push({ type: TokenType.CloseGroup, value: c, startIndex: i });
      i++;
      continue;
    }

    if (c === '|') {
      tokens.push({ type: TokenType.Or, value: c, startIndex: i });
      i++;
      continue;
    }

    if (c === '&') {
      tokens.push({ type: TokenType.And, value: c, startIndex: i });
      i++;
      continue;
    }

    if (c === '!' || c === '-') {
      tokens.push({ type: TokenType.Not, value: c, startIndex: i });
      i++;
      continue;
    }

    if (!tagCharPattern.test(c)) {
      throw new TokenError(`Invalid character "${c}" at index ${i}`);
    }

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

  return tokens;
}

export function safeTokenize(taglist: string): Result<Token[], string> {
  try {
    return { success: true, value: tokenize(taglist) };
  } catch (e) {
    if (e instanceof TokenError) {
      return { success: false, error: e.message };
    }
    throw e;
  }
}
