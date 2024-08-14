# Ropes Vite Server

This is a special Vite middleware server for development that emulates a user on
the Empornium site with our userscript installed by a userscript manager.
Additionally, this server serves mocks endpoints of various Empornium APIs.

None of this stuff affects the actual built userscript. It's just for
development.

## GET requests to HTML

These are copies Empornium page sources with all their content, with two
important additions:

1. In the `<head>`, it loads the vite HMR client.

   ```html
   <script type="module" src="/@vite/client"></script>
   ```

2. In the `<body>`, it loads the userscript.

   ```html
   <script type="module" src="/index.user.js"></script>
   ```

   Note that vite doesn't actually create this file on our system: it's a
   virtual file that vite serves up.

### Adding new pages

1. Create a new `.html` file in the `vite/mockEmp/pages` directory.
2. Paste in content that should be served, such as the HTML of a page on Empornium.
3. Add the two script tags mentioned above to the file.
4. Configure the `vite/mockEmp/server.ts` Express server to serve the new page
   at some path. See the file for examples on how this is currently done.

## Mock API endpoints

These are endpoints that represent some other action taken on an Empornium page
that we want to mock. For example, we might want to mock tag completion, or
bookmarking a torrent.

These are configured in the `vite/mockEmp/server.ts` file. See the file for
examples on how this is currently done.

## GET index.html

This is just a landing page to navigate to the other pages. In the future, we
may try to mock the Empornium homepage here.
