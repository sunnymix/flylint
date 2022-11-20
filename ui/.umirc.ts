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
        { path: "/catalog", exact: true, component: "@/pages/catalog" },
        { path: "/catalog/:name", exact: true, component: "@/pages/catalog" },
        { path: "/topic", exact: true, component: "@/pages/topic" },
        { path: "/media", exact: true, component: "@/pages/media" },
        { path: "/draw", exact: true, component: "@/pages/draw" },
        { path: "/tool", exact: true, component: "@/pages/tool" },
        { path: "/tag", exact: true, component: "@/pages/tag" },
        { path: "/metadata", exact: true, component: "@/pages/metadata" },
        { path: "/okr", exact: true, component: "@/pages/okr" },
        { path: "/about", exact: true, component: "@/pages/about" },
      ],
    },
  ],
});
