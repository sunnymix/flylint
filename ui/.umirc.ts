import { defineConfig } from 'umi';

const basePath = '/';

export default defineConfig({
  base: basePath,
  favicon: `${basePath}img/favicon.ico`,
  fastRefresh: {},
  nodeModulesTransform: { type: 'none', },
  publicPath: basePath,
  outputPath: `dist${basePath}`,
  routes: [
    {
      path: '/',
      component: "@/layouts/index",
      routes: [
        { path: "/", exact: true, component: "@/pages/index" },
        { path: "/wiki", exact: true, component: "@/pages/wiki" },
        { path: "/wiki/:name", exact: true, component: "@/pages/wiki" },
        { path: "/meta", exact: true, component: "@/pages/meta" },
        { path: "/media", exact: true, component: "@/pages/media" },
        { path: "/tag", exact: true, component: "@/pages/tag" },
      ],
    },
  ],
});
