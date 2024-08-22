import { defineConfig, PluginOption, ViteDevServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { OutputBundle, OutputOptions } from 'rollup';
import { UserscriptMetadata } from './vite/userscriptMetadata';
import { mockEmpServer } from './vite/mockEmp/server';
import { appStylesId } from './src/lib/constants';
import packageJson from './package.json';
import path from 'path';

import { visualizer } from 'rollup-plugin-visualizer';

function formatVersionDate(date?: Date): string {
  return (date ?? new Date()).toISOString();
}

const getDevelopmentMetadata = () =>
  new UserscriptMetadata({
    name: 'Ropes for Empornium',
    author: 'timdotcom',
    match: ['https://www.empornium.sx/*', 'https://www.empornium.is/*'],
    version: `${packageJson.version}.dev+${formatVersionDate()}`,
    description: `A new take on browsing for torrents on Empornium.`,
    icon: 'https://jerking.empornium.ph/images/2024/08/05/logo9034421a1ac6c2e7.png',
    grants: ['GM_info']
  });

const getProductionMetadata = () => {
  const developmentMetadata = getDevelopmentMetadata();
  return new UserscriptMetadata({
    name: developmentMetadata.name,
    author: developmentMetadata.author,
    match: developmentMetadata.match,
    version: packageJson.version,
    description: developmentMetadata.description,
    updateURL: 'https://ropes.win/index.user.js',
    homepageURL: 'https://github.com/tim784/ropes',
    icon: developmentMetadata.icon,
    grants: developmentMetadata.grants
  });
};

const shouldIncludeVisualizer = process.env.VISUALIZE === 'true';

// plugin to inject a banner into the generated code. we use for the userscript
// metadata
function banner(metadata: UserscriptMetadata) {
  return {
    name: 'vite-plugin-banner',
    generateBundle(_options: OutputOptions, bundle: OutputBundle) {
      for (const [_, assetInfo] of Object.entries(bundle)) {
        if (assetInfo.type === 'chunk') {
          assetInfo.code = `${metadata.toString()}\n${assetInfo.code}`;
        }
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      svelte(),

      // This plugin is used to inject CSS as JS. This is necessary because we're
      // a userscript and regarding external resources:
      // - _don't want to_ load them because we want to be self-contained, and
      // - _can't_ load them because of CSP.
      //
      // NOTE: At the beginning of development, before I ironed out things,
      // topExecutionPriority was necessary to be true. However, since then, it
      // doesn't seem to be needed anymore. If we run into problems with styles
      // not loading/unloading, we can try setting it back to true. (And, to
      // clarify, all this flag does is put the CSS-loading at the top of the
      // bundle, which I wouldn't really want because it looks better if the
      // userscript banner is first.)
      cssInjectedByJsPlugin({ topExecutionPriority: false, styleId: appStylesId }),

      // this injects the userscript metadata into the generated code
      banner(mode === 'production' ? getProductionMetadata() : getDevelopmentMetadata()),

      // this is our test server: serves HTML and various mocked Emp endpoints
      {
        name: 'serve-mock-emp',
        configureServer(server: ViteDevServer) {
          server.middlewares.use(mockEmpServer());
        }
      } as PluginOption,

      // visualize the bundle size
      shouldIncludeVisualizer &&
        visualizer({
          filename: './dist/bundle-analysis.html',
          open: true // Automatically open the report in the browser
        }),
    ].filter(Boolean) as PluginOption[],

    build: {
      // this prevents vite from emitting a warning about emitted chunks being
      // too large. this is something to worry about, but as a userscript, we
      // can't split up our bundle. was 500kb
      chunkSizeWarningLimit: 750,

      rollupOptions: {
        output: {
          entryFileNames: `[name].user.js`
        },

        input: {
          index: 'src/main.ts'
        }
      },

      minify: false,
    },

    server: {
      open: '/torrents.php'
    },

    resolve: {
      alias: {
        $src: path.resolve('./src'),
        $lib: path.resolve('./src/lib'),
        $api: path.resolve('./src/lib/api'),
        $components: path.resolve('./src/lib/components'),
        $icons: path.resolve('./src/lib/components/icons'),
        $actions: path.resolve('./src/lib/actions'),
        $gather: path.resolve('./src/lib/gather'),
        $stores: path.resolve('./src/lib/stores')
      }
    },

    test: {
      include: ['src/**/*.{test,spec}.{js,ts}']
    }
  };
});
