import fs from 'fs';
import { resolve, dirname, parse } from 'path';
import { fileURLToPath } from 'url';

const cleansablePathPrefix = 'emp';

function getPathPaths(): string[] {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const pagesDir = resolve(__dirname, '../vite/mockEmp/pages');
  // get all html files, testing if they're files and not folders
  return fs
    .readdirSync(pagesDir)
    .filter((file) => {
      const parsed = parse(file);
      return (
        parsed.ext === '.html' &&
        parsed.name.startsWith(cleansablePathPrefix) &&
        fs.statSync(resolve(pagesDir, file)).isFile()
      );
    })
    .map((file) => resolve(pagesDir, file));
}

function randHexStr(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function randStr(length: number): string {
  return Array.from({ length }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join('');
}

function randInt(min: number = 100_000, max: number = 999_999): string {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

const cleansedComment = '<!-- cleansed -->';

// all these patterns match ONLY the text to replace so we can feed it into a
// replaceAll function. but, of course, matching text like this requires
// context, so each pattern utilizes positive lookbehind and/or lookahead
// constructs.
const ownUserIdPattnern = /(?<=var userid = )\d+/g;
const userIdPatterns = [
  // script tag
  ownUserIdPattnern,

  // query string
  /(?<=userid=)\d+/g,

  // user profile links
  /(?<=\/user\/)\d+(?=\/(invite|security))/g,
  /(?<=\/user.php?id=)\d+/g
];
const authKeyPatterns = [
  // script tag
  /(?<=var authkey = ")[^"]+/g,

  // query string
  /(?<=authkey=)[^&"]+/g
];
const passkeyPatterns = [
  // query string
  /(?<=passkey=)[^&"]+/g,
  /(?<=torrent_pass=)[^&"]+/g,
  /(?<=torrents_notify_)[^&"]+/g,
  /(?<=torrents_bookmarks_t_)[^&"]+/g,
];
const authPatterns = [
  // query string
  /(?<=auth=)[^&"]+/g
];
const tokenPatterns = [
  // form input value
  /(?<=value=")[a-fA-F0-9]{48}/g
];

function loggingReplacer(fn: (match: string) => string) {
  return (match: string) => {
    const replacement = fn(match);
    if (match !== replacement) {
      console.log(`replacing ${match} with ${replacement}`);
    }
    return replacement;
  };
}

function cleanseString(input: string): string | null {
  if (input.startsWith(cleansedComment)) {
    return null;
  }

  input = cleansedComment + '\n' + input;

  const myUserId = input.match(ownUserIdPattnern)?.[0];
  if (!myUserId) {
    throw new Error('own userId not found');
  }

  // collect all userIds and replace them with randInt iff they are not equal to
  // myUserId
  for (const pattern of userIdPatterns) {
    input = input.replaceAll(
      pattern,
      loggingReplacer((match) => {
        return match !== myUserId ? randInt() : match;
      })
    );
  }

  // collect all authkeys and replace them with randHexStr
  for (const pattern of authKeyPatterns) {
    input = input.replaceAll(
      pattern,
      loggingReplacer((authkey) => {
        return randHexStr(authkey.length);
      })
    );
  }

  // collect all passkeys and replace them with randStr
  for (const pattern of passkeyPatterns) {
    input = input.replaceAll(
      pattern,
      loggingReplacer((passkey) => {
        return randStr(passkey.length);
      })
    );
  }

  // collect all auths and replace them with randHexStr
  for (const pattern of authPatterns) {
    input = input.replaceAll(
      pattern,
      loggingReplacer((auth) => {
        return randHexStr(auth.length);
      })
    );
  }

  // collect all tokens and replace them with randHexStr
  for (const pattern of tokenPatterns) {
    input = input.replaceAll(
      pattern,
      loggingReplacer((token) => {
        return randHexStr(token.length);
      })
    );
  }

  return input;
}

function cleanseFile(file: string): void {
  const input = fs.readFileSync(file, 'utf-8');

  console.log(`cleansing ${file}:`);

  const output = cleanseString(input);
  if (output === null) {
    console.log(`skipping because it's already cleansed\n`);
    return;
  }

  fs.writeFileSync(file, output);

  console.log('written\n');
}

function main(): void {
  const paths = getPathPaths();
  for (const path of paths) {
    cleanseFile(path);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
