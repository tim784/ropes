/**
 * HTTP server of the static files in the dist folder.
 */

// Much of this module is just logging, and is copied from the Hono logger
// middleware at
// https://github.com/honojs/hono/blob/95a6b39895f85243484debd8f055e83e7de317b9/src/middleware/logger/index.ts.
// Unforunately, the built-in Hono logger does not expose some things we want,
// so we reimplement it here.

// TODO: Last-Modified and If-Modified-Since headers handling. Hono doesn't seem
// to support these yet for serveStatic. Open issue here:
// https://github.com/honojs/node-server/issues/189#issue-2476602511

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { getConnInfo } from '@hono/node-server/conninfo';
import { getPath } from 'hono/utils/url';
import { getColorEnabled } from 'hono/utils/color';
import { createMiddleware } from 'hono/factory';

const app = new Hono();

/**
 * Returns the time difference between the current time and the start time.
 * 
 * @param {number} start - The start time.
 * 
 * @returns {string} The time difference in a human-readable format.
 */
const time = (start: number) => {
  const delta = Date.now() - start;
  if (delta < 1000) {
    return `${delta}ms`;
  } else {
    return `${Math.round(delta / 1000)}s`;
  }
};

/**
 * Returns a string of the status code, with color if enabled.
 * 
 * @param {number} status - The status code.
 * 
 * @returns {string} The colored status code.
 */
const colorStatus = (status: number) => {
  const colorEnabled = getColorEnabled();
  const out: { [key: string]: string } = {
    7: colorEnabled ? `\x1b[35m${status}\x1b[0m` : `${status}`,
    5: colorEnabled ? `\x1b[31m${status}\x1b[0m` : `${status}`,
    4: colorEnabled ? `\x1b[33m${status}\x1b[0m` : `${status}`,
    3: colorEnabled ? `\x1b[36m${status}\x1b[0m` : `${status}`,
    2: colorEnabled ? `\x1b[32m${status}\x1b[0m` : `${status}`,
    1: colorEnabled ? `\x1b[32m${status}\x1b[0m` : `${status}`,
    0: colorEnabled ? `\x1b[33m${status}\x1b[0m` : `${status}`
  };

  const calculateStatus = (status / 100) | 0;

  return out[calculateStatus];
};

// build our logger middleware
app.use(
  createMiddleware(async (c, next) => {
    const { method, raw } = c.req;
    const path = getPath(raw);
    const { address, port } = getConnInfo(c).remote;
    const start = new Date();
    const millisStart = start.getTime();
    console.log(raw.headers);
    await next();
    const duration = time(millisStart);
    const status = colorStatus(c.res.status);
    console.log(
      `${start.toISOString()} - ${address}:${port} - ${method} ${path} - ${status} - ${duration}`
    );
  })
);

// redirect to the index by default
app.get('/', (c) => {
  return c.redirect('/index.user.js');
});

// if a particular file is requested, serve it
app.use(
  '/*',
  serveStatic({
    root: './dist/'
  })
);


const port = 3000;
console.log(`Server is running at http://127.0.0.1:${port}`);

serve({
  fetch: app.fetch,
  port
});
