const svelte = require('rollup-plugin-svelte');
const resolve = require('rollup-plugin-node-resolve');

module.exports = {
  bundler: 'rollup',
  plugins: [svelte(), resolve()],
};
