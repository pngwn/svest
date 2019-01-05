import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

export default { plugins: [svelte(), resolve()] };
