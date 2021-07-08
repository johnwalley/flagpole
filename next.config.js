const webpack = require("webpack");

module.exports = {
  webpack: (config, options) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: "react",
      })
    );

    return config;
  },
};
