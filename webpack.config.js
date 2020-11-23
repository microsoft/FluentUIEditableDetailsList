const path = require('path');
const webpack = require('webpack');

module.exports = [
  {
    name: 'static',
    target: 'web',
    mode: 'development',
    devtool: 'source-map',
    entry: {
        app: './src/App.tsx',
    },
    output: {
        path: path.join(__dirname, 'public', 'bundles'),
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-router-dom': 'ReactRouterDOM',
        'styled-components': 'styled',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
    plugins: [new webpack.DefinePlugin(stringifyConfigValues(globals))],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 8080,
        historyApiFallback: true,
        writeToDisk: true,
        https: true,
    },
},
{
    name: 'dyanmic',
    target: 'web',
    mode: 'development',
    devtool: 'source-map',
    entry: dynamicComponents,
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-router-dom': 'ReactRouterDOM',
        'styled-components': 'styled',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                },
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
        ],
    },
    output: {
        path: path.join(__dirname, 'public', 'bundles'),
        library: ['__WIDGETS__', '[name]'],
        libraryTarget: 'umd',
    },
    plugins: [new webpack.DefinePlugin(stringifyConfigValues(globals))],
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
  },
];