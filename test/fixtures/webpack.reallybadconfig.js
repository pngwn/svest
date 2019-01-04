export default {
  module: {
    darules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            format: 'spoon',
            css: false,
          },
        },
      },
    ],
  },
};
