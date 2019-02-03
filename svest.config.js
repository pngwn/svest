import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

export default {
  bundler: 'rollup',
  compilerOptions: {},
  rollupPlugins: [svelte(), resolve()],
};
