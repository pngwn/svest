export default {
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            format: 'iife',
            css: false,
          },
        },
      },
    ],
  },
};
