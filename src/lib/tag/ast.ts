import { type Token, TokenType } from './token';
import { type Result } from '$lib/result';

export class ParseAstError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export enum AstNodeType {
  Tag = 'Tag', // operand
  And = 'And', // binary operator
  Or = 'Or', // binary operator
  Not = 'Not', // unary operator
  Group = 'Group' // grouping
}

export type AstNode =
  | { type: AstNodeType.Tag; tag: string; token: Token }
  | { type: AstNodeType.And; left: AstNode; right: AstNode; token?: Token }
  | { type: AstNodeType.Or; left: AstNode; right: AstNode; token: Token }
  | { type: AstNodeType.Group; inner: AstNode; openToken: Token; closeToken: Token }
  | { type: AstNodeType.Not; tagNode: AstNode; token: Token };

export function parseAst(tokens: Token[]): AstNode {
  let index = 0;

  // Utility functions for managing the token stream
  function peek(): Token | null {
    return tokens[index] || null;
  }

  function consume(): Token {
    return tokens[index++];
  }

  function parseGroup(): AstNode {
    const openToken = consume(); // Expect '('
    const node = parseExpression();
    const closeToken = consume(); // Expect ')'
    if (closeToken === undefined) {
      throw new ParseAstError('Expected GroupClose `)` at end of input');
    }
    if (closeToken.type !== TokenType.CloseGroup) {
      throw new ParseAstError(`Expected GroupClose ')' at index ${closeToken.startIndex}`);
    }
    return { type: AstNodeType.Group, inner: node, openToken, closeToken };
  }

  function parseNot(): AstNode {
    const token = consume(); // consume 'NOT'

    const operand = peek();
    if (!operand) {
      throw new ParseAstError('Expected operand after NOT at end of input');
    } else if (operand.type === TokenType.Not) {
      throw new ParseAstError(`Unexpected double-negation at index ${operand.startIndex}`);
    }

    const node = parseTerm();

    return { type: AstNodeType.Not, tagNode: node, token };
  }

  function parseTerm(): AstNode {
    const token = peek();

    if (!token) {
      throw new ParseAstError('Unexpected end of input');
    }

    if (token.type === TokenType.OpenGroup) {
      return parseGroup();
    }

    if (token.type === TokenType.Not) {
      return parseNot();
    }

    if (token.type === TokenType.Tag) {
      return { type: AstNodeType.Tag, tag: consume().value as string, token: token };
    }

    throw new ParseAstError(
      `Unexpected token ${token.type} \`${token.value}\` at index ${token.startIndex}`
    );
  }

  // Parse AND expressions, including implicit AND
  function parseAndExpression(): AstNode {
    let node = parseTerm();

    // we look here for explicit 'AND' tokens, but also tags, nots, and
    // open-groups because they're allowed to come after an implicit AND
    while (
      (peek() && peek()?.type === TokenType.And) ||
      peek()?.type === TokenType.Tag ||
      peek()?.type === TokenType.OpenGroup ||
      peek()?.type === TokenType.Not
    ) {
      let token;
      if (peek()?.type === TokenType.And) {
        token = consume(); // consume explicit 'AND'
      }

      const right = parseTerm();

      // note that token is undefined for implicit AND
      node = { type: AstNodeType.And, left: node, right, token };
    }

    return node;
  }

  // Parse OR expressions
  function parseOrExpression(): AstNode {
    let node = parseAndExpression();

    while (peek() && peek()?.type === TokenType.Or) {
      const token = consume(); // consume 'OR'
      const right = parseAndExpression();

      node = { type: AstNodeType.Or, left: node, right, token };
    }

    return node;
  }

  function parseExpression(): AstNode {
    return parseOrExpression(); // OR has the lowest precedence, so we start here
  }

  return parseExpression();
}

export function safeParseAst(tokens: Token[]): Result<AstNode, string> {
  try {
    return { success: true, value: parseAst(tokens) };
  } catch (e) {
    if (e instanceof ParseAstError) {
      return { success: false, error: e.message };
    }
    throw e;
  }
}
