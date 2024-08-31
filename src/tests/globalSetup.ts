import { randomUUID } from 'node:crypto';

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID
  }
});