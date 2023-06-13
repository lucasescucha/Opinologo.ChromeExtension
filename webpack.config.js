const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path');

module.exports = {
    optimization: {
        minimize: false
    },
    entry: {
        content: './src/content.js',
        background: './src/background.js',
        popup: './src/popup.jsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.(jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        },
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/popup.html",
            filename: "popup.html",
            excludeAssets: [/background.js/]
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "public/manifest.json",
                    to: "manifest.json"
                }
            ]
        })
    ]
};