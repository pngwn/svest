import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

module.exports = { plugins: [svelte(), resolve()] };
