const path = require("path");

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: "raw-loader" },
      { test: /\.md$/, use: "raw-loader" },
    ],
  },
};
