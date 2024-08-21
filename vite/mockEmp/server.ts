import express, { NextFunction } from 'express';
import tags from './tags.json';
import fs from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

function getPath(target: string, importMetaUrl?: string | undefined): string {
  const thisModule = fileURLToPath(importMetaUrl ?? import.meta.url);
  const thisDir = resolve(thisModule, '..');
  return resolve(thisDir, target);
}

const searchPage1Path = getPath('./pages/emp-searchPage-1-full.html');
const searchPage2Path = getPath('./pages/emp-searchPage-2-single.html');
const searchPage3Path = getPath('./pages/emp-searchPage-3-timeStyle.html');
const searchPage4Path = getPath('./pages/emp-searchPage-4-hideFloating.html');
const searchPage5Path = getPath('./pages/emp-searchPage-5-hideTags.html');
const torrentDetailPagePath = getPath('./pages/emp-torrentDetail.html');
const indexPagePath = getPath('./pages/index.html');

// mock tag server that emulates some empornium endpoints
export function mockEmpServer() {
  const app = express();

  // supports:
  // - autocomplete
  app.get('/tags.php', (req: express.Request, res: express.Response, next: NextFunction) => {
    const tagName: string = req.query.name as string;
    const tagCount = tags.length;
    const limit = 10;
    // a list of tags that would never be returned by the tag server, but may be present in tags.json
    const reservedTags = ['and', 'or', 'not'];
    if (req.query.action !== 'autocomplete') {
      // just return a error string (not json). emp just sends back the text/html of the current page
      next();
      return;
    }

    const matchingTags = tags
      .map((name, index) => ({ name, count: tagCount - index }))
      .filter((tag) => tag.name.includes(tagName))
      .filter((tag) => !reservedTags.includes(tag.name))
      .slice(0, limit);

    res.json([
      tagName,
      matchingTags.map(({ name, count }) => [
        name,
        `${name} &nbsp;<span class="num">(${count})</span>`
      ])
    ]);
  });

  // supports:
  // - adding/removing bookmarks
  app.get('/bookmarks.php', (req: express.Request, res: express.Response, next: NextFunction) => {
    const query = req.query;
    if (
      !['add', 'remove'].includes(query.action?.toString() ?? '') ||
      query.type !== 'torrent' ||
      !query.id ||
      !query.auth
    ) {
      next();
      return;
    }

    res.send('OK');
  });

  // supports:
  // - searching for torrents
  // - viewing torrent details
  // - thanking a torrent uploader
  app.get('/torrents.php', (req: express.Request, res: express.Response) => {
    const query = req.query;

    let path: string;

    if (query.id) {
      path = torrentDetailPagePath;
    } else {
      switch (query.page) {
        case '2':
          path = searchPage2Path;
          break;
        case '3':
          path = searchPage3Path;
          break;
        case '4':
          path = searchPage4Path;
          break;
        case '5':
          path = searchPage5Path;
          break;
        default:
          path = searchPage1Path;
      }
    }
    const html = fs.readFileSync(path, 'utf-8');

    // !!! This is critical for Vite to inject our userscript and for HMR to work
    const injectedHtml = injectViteUserscriptAndHmr(html);

    res.header('Content-Type', 'text/html').send(injectedHtml);
  });

  app.post('/torrents.php', (req: express.Request, res: express.Response, next: NextFunction) => {
    const query = req.query;
    if (query.action === 'thank') {
      res.send('OK');
    } else {
      next();
    }
  });

  // just a landing page to get to other pages. shouldn't ever really come here.
  app.get('/', (req: express.Request, res: express.Response, next: NextFunction) => {
    const html = fs.readFileSync(indexPagePath, 'utf-8');
    res.header('Content-Type', 'text/html').send(html);
  });

  return app;
}

function injectViteUserscriptAndHmr(htmlString: string) {
  // Parse the HTML string with jsdom
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  // Create the script elements for the head and body
  const viteHmrScript = document.createElement('script');
  viteHmrScript.setAttribute('type', 'module');
  viteHmrScript.setAttribute('src', '/@vite/client');

  // Create a comment for the vite HMR client
  const viteHmrComment = document.createComment(' vite HMR client ');

  // Prepend the comment and script to the head
  if (document.head) {
    document.head.prepend(viteHmrScript);
    document.head.prepend(viteHmrComment);
  }

  // Create the script for loading our script
  const loadScript = document.createElement('script');
  loadScript.setAttribute('type', 'module');
  loadScript.setAttribute('src', '/src/main.ts');

  // Create a comment for loading our script
  const loadScriptComment = document.createComment(' load our script ');

  // Prepend the comment and script to the body
  if (document.body) {
    document.body.prepend(loadScript);
    document.body.prepend(loadScriptComment);
  }

  // Serialize the DOM back to a string
  return dom.serialize();
}
