
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
      "chunk-FOM67XMJ.js",
      "chunk-ASPWEAKV.js"
    ],
    "redirectTo": "/supervisor/home",
    "route": "/supervisor"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FOM67XMJ.js",
      "chunk-ASPWEAKV.js"
    ],
    "route": "/supervisor/home"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FOM67XMJ.js",
      "chunk-ASPWEAKV.js"
    ],
    "route": "/supervisor/reports"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FOM67XMJ.js",
      "chunk-ASPWEAKV.js"
    ],
    "route": "/supervisor/summary"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ZUAN3LLH.js",
      "chunk-ASPWEAKV.js"
    ],
    "redirectTo": "/acuicultor/temperature",
    "route": "/acuicultor"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ZUAN3LLH.js",
      "chunk-ASPWEAKV.js"
    ],
    "route": "/acuicultor/temperature"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ZUAN3LLH.js",
      "chunk-ASPWEAKV.js"
    ],
    "route": "/acuicultor/weight"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ZUAN3LLH.js",
      "chunk-ASPWEAKV.js"
    ],
    "route": "/acuicultor/growth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ZUAN3LLH.js",
      "chunk-ASPWEAKV.js"
    ],
    "route": "/acuicultor/waterMonitoring"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ZUAN3LLH.js",
      "chunk-ASPWEAKV.js"
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
    'index.csr.html': {size: 27235, hash: '0c98308cc4a90ad434eb4d993ac2a5244e601fd489a656d05973f8e056c3e639', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 20786, hash: '6508da6d77f95a5c055a2a71910354e6272be3892a0ac55d31fd46069211534c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'supervisor/home/index.html': {size: 43993, hash: '86b83be52d26f33806602e3a25a106bc4932b32855fd85f1ee6186086f7c5a9a', text: () => import('./assets-chunks/supervisor_home_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 43459, hash: 'f27a9e05caf6802b0ad5437cfd5e043989691d8bb77af75b5c89783e3bd2a4a7', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'supervisor/reports/index.html': {size: 43993, hash: '86b83be52d26f33806602e3a25a106bc4932b32855fd85f1ee6186086f7c5a9a', text: () => import('./assets-chunks/supervisor_reports_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 57593, hash: '1a994ae76299dac1f6cacad28ec82a1de410095a00a8fc6fe0ba98c427b92eeb', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'supervisor/summary/index.html': {size: 43993, hash: '86b83be52d26f33806602e3a25a106bc4932b32855fd85f1ee6186086f7c5a9a', text: () => import('./assets-chunks/supervisor_summary_index_html.mjs').then(m => m.default)},
    'acuicultor/weight/index.html': {size: 43993, hash: 'd99e1b247c41031a2f4d186c0be0705d95eea84ac2f6f361d3beb0cdd1abefce', text: () => import('./assets-chunks/acuicultor_weight_index_html.mjs').then(m => m.default)},
    'acuicultor/temperature/index.html': {size: 44000, hash: 'dc3bf5205ca66ac70cab09fee2158d8c981a2c4b0005c010a364abaeab7e19c8', text: () => import('./assets-chunks/acuicultor_temperature_index_html.mjs').then(m => m.default)},
    'acuicultor/alertsDashboard/index.html': {size: 43993, hash: 'd99e1b247c41031a2f4d186c0be0705d95eea84ac2f6f361d3beb0cdd1abefce', text: () => import('./assets-chunks/acuicultor_alertsDashboard_index_html.mjs').then(m => m.default)},
    'acuicultor/waterMonitoring/index.html': {size: 43993, hash: 'd99e1b247c41031a2f4d186c0be0705d95eea84ac2f6f361d3beb0cdd1abefce', text: () => import('./assets-chunks/acuicultor_waterMonitoring_index_html.mjs').then(m => m.default)},
    'acuicultor/growth/index.html': {size: 43993, hash: 'd99e1b247c41031a2f4d186c0be0705d95eea84ac2f6f361d3beb0cdd1abefce', text: () => import('./assets-chunks/acuicultor_growth_index_html.mjs').then(m => m.default)},
    'styles-KOI6HB3Y.css': {size: 7165, hash: '1hMsg3g9qb4', text: () => import('./assets-chunks/styles-KOI6HB3Y_css.mjs').then(m => m.default)}
  },
};
