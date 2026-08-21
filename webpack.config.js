/**
 * CHRONOS — build pipeline
 * ------------------------
 * webpack 5   → bundling, dev server + HMR, code splitting, content hashing
 * babel       → JS transpiling (browserslist-driven)
 * sass        → SCSS compilation
 * postcss     → autoprefixer
 * nunjucks    → HTML template engine (layout + partials + macros, data-driven)
 */
const path = require("path");
const nunjucks = require("nunjucks");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const site = require("./src/data/site");

const TEMPLATES = path.resolve(__dirname, "src/templates");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const njk = nunjucks.configure(TEMPLATES, { noCache: true, autoescape: true });

  return {
    entry: { app: "./src/js/main.js" },

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "js/[name].[contenthash:8].js" : "js/[name].js",
      chunkFilename: isProd ? "js/[name].[contenthash:8].chunk.js" : "js/[name].chunk.js",
      assetModuleFilename: "assets/[name].[contenthash:8][ext]",
      clean: true,
      publicPath: "auto",
    },

    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",

    resolve: {
      alias: { "@": path.resolve(__dirname, "src/js") },
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: /\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            { loader: "css-loader", options: { sourceMap: !isProd } },
            { loader: "postcss-loader", options: { sourceMap: !isProd } },
            { loader: "sass-loader", options: { sourceMap: !isProd } },
          ],
        },
        {
          test: /\.(png|jpe?g|webp|avif|svg|woff2?)$/,
          type: "asset/resource",
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        templateContent: () => njk.render("index.njk", { site, sections: site.sections }),
        inject: "body",
        minify: isProd
          ? { collapseWhitespace: true, removeComments: true, minifyCSS: true }
          : false,
      }),
      isProd &&
        new MiniCssExtractPlugin({
          filename: "css/[name].[contenthash:8].css",
        }),
      new CopyPlugin({
        patterns: [
          {
            from: "src/assets",
            to: "assets",
            globOptions: { ignore: ["**/.gitkeep"] },
            noErrorOnMissing: true,
          },
        ],
      }),
    ].filter(Boolean),

    optimization: {
      minimizer: ["...", new CssMinimizerPlugin()],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/]three[\\/]/,
            name: "three",
            priority: 10,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
          },
        },
      },
      runtimeChunk: "single",
    },

    devServer: {
      port: 8080,
      hot: true,
      open: true,
      client: { overlay: true },
      // rebuild when templates or content data change
      watchFiles: ["src/templates/**/*", "src/data/**/*"],
    },

    performance: { hints: false },
    stats: "minimal",
  };
};
