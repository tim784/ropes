# Ropes

Ropes is a userscript for the Empornium **search page**.

- New Design: Ropes displays torrents as "cards" with their image, title, and
  some metadata. Layout is responsive to your viewport size and features a
  sticky header and search form. Full-size images, in most cases, can be viewed
  by clicking on the expand button. Tags are available in a tooltip to take up
  less space. Torrent "state" (seeding/leeching/snatched, bookmarked, freeleech,
  warned, etc.) are shown in "pills" on the card.

- Rich Tag Mode: In Ropes, search focuses on tags. Local tag caching makes
  autocompletion super fast (but we still ensure tags are valid with a debounced
  API request). Added tags can be negated or removed. See the search dropdown
  for more details.

- SFW Mode: Instantly sanitize all offensive content from the page with a
  keypress or button click. (If there's something I missed, please let me know.)

  If you report a new bug, submit a needed PR, or support this project, you can
  have your (non-offensive) username or a psuedonym added to the SFW user names
  that show up when this mode is activated.

- Download, bookmark, thank, and use slots on torrents straight from the
  actions button on the card.

- Light and Dark Mode: Ropes has a light and dark color themes that can be
  toggled in the header.

- "Seen" Torrents: Know which torrents you've already seen in a search results
  page with a pill on the card. This is helpful if you frequently check for new
  torrents and want to know where you stopped last time.

- Single-Page App (for searches): Once Ropes is loaded, you can navigate pages
  of search results without an entire reload of the page, including the back
  button. This prevents the flash of original content that most userscripts
  have.

- Easy Load/Unload: Ropes can be easily toggled on and off by pressing the
  button in the header. Ropes does not try support every feature of the normal
  site, so you can switch back if you need.

- [Open-Source](https://github.com/tim784/ropes): If you want to collaborate or
  report a bug, issues and pull requests are warmly welcomed (I'm
  [@tim784](https://github.com/tim784)). If you're unsure of Ropes, you can
  scrutinize the source code and/or build it yourself.

- Safe and Private: Ropes does not transmit any sensitive information to this
  project or any third-parties (and actually, _couldn't_ even do so because of
  Empornium's strong
  [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
  in place). It simply wraps existing Empornium content/functionality.

## Installation

Ensure your browser has the requirements below. Then,

1. Install Ropes by visiting the following URL

   <https://ropes.win/>

   and clicking the install link. Click on it and your userscript manager
   should prompt you to install it. (If that doesn't work, you can copy the
   contents of the file and paste it into a new userscript in your manager.)

2. **Navigate to the torrent search page (`/torrents.php`)** and, in the top
   navigation bar, click "Load Ropes".

   (Ropes does not currently support any other pages, so it only makes sense to
   put it there.)

## Requirements

- An up-to-date browser: Ropes is tested on the latest versions of Firefox,
  Chrome, and Edge (and may work on others) and needs modern-ish web APIs to
  function.

- A userscript manager. Examples include:

  - [Violentmonkey](https://violentmonkey.github.io/) (This is what I use)

  - [Tampermonkey](https://www.tampermonkey.net/)

  - [Greasemonkey](https://www.greasespot.net/)

## Support

When Ropes is installed and running, **it will likely break or be
broken by other userscripts** that modify the Empornium search page. If you run
into issues, try disabling other userscripts.

Please also understand that Ropes is a new project and may have bugs. If you see
something that doesn't work as expected, please open an issue on the [GitHub
repository](https://github.com/tim784/ropes). Try to include as much detail as
you can, including:

- the output of the browser console (Press F12).

- your browser and version

- the page you were on when the issue occurred

## Todos

- Support torrent detail pages? Torrent metadata first, then anything to do with
  BBCode content, such as the Description block, comments, and comment drafting
  (look at [SCEditor](https://www.sceditor.com/) or write my own?).

- More raw list kept in [TODO.md](./TODO.md).

- Suggest other things!

## Contributing

Clone the repository and run `npm install` to install dependencies.

### Test with the Vite Server

(for fast feedback loop, but limited API)

Run `npm run dev` to start the Vite server. This will open a new tab in your
browser Ropes loaded. With this, you get HMR and, as you develop, you'll see
your changes immediately (if there aren't any irrecoverable errors).

The loaded pages are in the `vite/mockEmp` directory. See more details in [its
README](./vite/mockEmp/README.md).

Regarding "limited API", I mocked some things that the empornium server does,
but by no means all of them. It's just the stuff that's important for testing.
Full testing should be done with the next method.

### Test with the Empornium Server

(for full functionality, but slower feedback loop)

1. Run

    `npm run watch`

    to rebuild the userscript whenever there's a local file
    change. The userscript is outputted to `dist/index.user.js`.

2. In another shell, run

    `npm run serve-dist`

    to start a local server that serves the userscript. The server is
    accessible at `http://<local-server>/index.user.js`.

3. (Possibly only with ViolentMonkey) Navigate in your browser to
    `http://<local-server>/index.user.js`. The userscript manager should
    recognize this URL path and display an installation page. On this page:

    1. "Install" it, and
    2. "Track" it. This will have the userscript manager poll the local server
      for updates to the userscript.

    **Keep this tab open while you develop** to continue tracking.

In this mode, **changes are only realized after a complete page reload** (F5
or press the reload button), but everything is then real data.

### See bundle size

```sh
npm run build:viz
```

### Run Tests

```sh
npm run test
```

Look for files named `*.test.ts` in the `src` directory.

### Versioning & Release

Ropes uses [Semantic Versioning](https://semver.org/) because node/npm require
it. But, because this is a userscript with no imaginable "public API", we only
increment the **major** version.

To make a cut a new release:

1. Bump the version in `package.json`.

   ```sh
    npm version major
    # this will also create a new git tag
    ```

2. Make a new tag and push it.

    ```sh
    git push origin --tags
    ```

3. Run the "Release" GitHub Action, using this new tag as an input

    ```sh
    gh workflow run Release -f tag=v1.0.0
    ```

### Scripts

#### Generate Stock Photos

Ropes uses stock photos for the SFW mode. To use them, they must be uploaded to
one of Empornium's image hosts. This script grabs photos from
<https://picsum.photos>, uploads them to an Empornium image host, and generates
a JSON file with the URLs in the `src/` directory.

```sh
npm run gen-stock-photos
```

#### Cleanse Test Pages

This script removes all sensitive data from HTML files in `vite/mockEmp/pages`
that start with 'emp-'. (These are the pages that the vite dev server uses.) To
prevent accidentally committing sensitive data, run this script before
committing a new test page.

```sh
npm run cleanse-test-pages
```

### Deploying

1. Bump the version in `package.json`.
2. Run the `Trigger CloudFlare Pages Deploy Hook` GitHub Action.
