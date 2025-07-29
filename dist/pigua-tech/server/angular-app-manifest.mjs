
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-SE3LSCJX.js",
      "chunk-GTGUNLDJ.js"
    ],
    "redirectTo": "/supervisor/home",
    "route": "/supervisor"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-SE3LSCJX.js",
      "chunk-GTGUNLDJ.js"
    ],
    "route": "/supervisor/home"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-SE3LSCJX.js",
      "chunk-GTGUNLDJ.js"
    ],
    "route": "/supervisor/reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-SE3LSCJX.js",
      "chunk-GTGUNLDJ.js"
    ],
    "route": "/supervisor/summary"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PS6XL654.js",
      "chunk-GTGUNLDJ.js"
    ],
    "redirectTo": "/acuicultor/temperature",
    "route": "/acuicultor"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PS6XL654.js",
      "chunk-GTGUNLDJ.js"
    ],
    "route": "/acuicultor/temperature"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PS6XL654.js",
      "chunk-GTGUNLDJ.js"
    ],
    "route": "/acuicultor/weight"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PS6XL654.js",
      "chunk-GTGUNLDJ.js"
    ],
    "route": "/acuicultor/growth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PS6XL654.js",
      "chunk-GTGUNLDJ.js"
    ],
    "route": "/acuicultor/waterMonitoring"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PS6XL654.js",
      "chunk-GTGUNLDJ.js"
    ],
    "route": "/acuicultor/alertsDashboard"
  },
  {
    "renderMode": 2,
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 27235, hash: '35f7b296d5cbcee6412acaa87544211b14e6a252439e944b530d5308b22caf12', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 20786, hash: '5cd40a4af6d3c351a5c78adaeecb4d3f305c39005f715abc6dfde393897b6376', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'register/index.html': {size: 43459, hash: '00d3cb7d29e1ff92a801daeaeced73a846ccd97267bd36b5a828f7fc2948a1de', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'supervisor/home/index.html': {size: 43993, hash: 'c304551cf14353f04ea42063c1cd16014f62df31855c93b6dc33a7cb4f55aa4e', text: () => import('./assets-chunks/supervisor_home_index_html.mjs').then(m => m.default)},
    'acuicultor/temperature/index.html': {size: 43993, hash: '91d085a27d118755dd9a095b8d783dd86d92f72438cf14b2e3cc38e022ee2617', text: () => import('./assets-chunks/acuicultor_temperature_index_html.mjs').then(m => m.default)},
    'supervisor/summary/index.html': {size: 44000, hash: '7a261bdd5509ad7985db8f6ee33519e6b34efee90a7b946dcad63f96150f14db', text: () => import('./assets-chunks/supervisor_summary_index_html.mjs').then(m => m.default)},
    'acuicultor/weight/index.html': {size: 43993, hash: '91d085a27d118755dd9a095b8d783dd86d92f72438cf14b2e3cc38e022ee2617', text: () => import('./assets-chunks/acuicultor_weight_index_html.mjs').then(m => m.default)},
    'acuicultor/growth/index.html': {size: 44000, hash: '3253916ce9496d16d0daa7b255aa964b6df1b0803cf8aa22187a0b19eb43abb6', text: () => import('./assets-chunks/acuicultor_growth_index_html.mjs').then(m => m.default)},
    'acuicultor/alertsDashboard/index.html': {size: 44000, hash: '3253916ce9496d16d0daa7b255aa964b6df1b0803cf8aa22187a0b19eb43abb6', text: () => import('./assets-chunks/acuicultor_alertsDashboard_index_html.mjs').then(m => m.default)},
    'acuicultor/waterMonitoring/index.html': {size: 43993, hash: '91d085a27d118755dd9a095b8d783dd86d92f72438cf14b2e3cc38e022ee2617', text: () => import('./assets-chunks/acuicultor_waterMonitoring_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 57593, hash: '6d239741d51e9e6b7635f40e009782140d3c0007a0c96719fed3addf6d608503', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'supervisor/reports/index.html': {size: 43993, hash: 'c304551cf14353f04ea42063c1cd16014f62df31855c93b6dc33a7cb4f55aa4e', text: () => import('./assets-chunks/supervisor_reports_index_html.mjs').then(m => m.default)},
    'styles-KOI6HB3Y.css': {size: 7165, hash: '1hMsg3g9qb4', text: () => import('./assets-chunks/styles-KOI6HB3Y_css.mjs').then(m => m.default)}
  },
};
