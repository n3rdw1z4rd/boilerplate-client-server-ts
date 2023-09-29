const { name: title, version, author } = require('./package.json');
const { resolve } = require('path');
const { realpathSync } = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appDirectory = realpathSync(process.cwd());

const DEV = (process.env.NODE_ENV?.toLowerCase() !== 'production');
const ENV = DEV ? 'development' : 'production';

console.log(`${title} v${version} - ${author}\n`);
console.log(`*** ${ENV.toUpperCase()} ***\n`);

module.exports = {
    entry: resolve(appDirectory, 'src/index.tsx'),
    output: {
        path: resolve(appDirectory, 'dist'),
        filename: 'bundle.js',
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        static: resolve(appDirectory, 'public'),
        hot: true,
        devMiddleware: {
            publicPath: '/',
        }
    },
    plugins: [
        new HtmlWebpackPlugin({ title }),
    ],
    mode: ENV,
    devtool: DEV ? 'source-map' : undefined,
};