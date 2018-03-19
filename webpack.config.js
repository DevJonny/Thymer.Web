const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    context: __dirname + '/',
    entry: {
        app: './app/app.js',
        vendor: ['jquery', 'angular', 'angular-route', 'bootstrap']
    },
    output: {
        path: __dirname + '/build',
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: [path.resolve(__dirname, '/node_modules')], loader: 'babel-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
            { test: /\.less$/, exclude: /node_modules/, loader: 'style-loader!css-loader!less-loader' }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js'  }),
        //new UglifyJsPlugin({
        //    test: /\.js($|\?)/i
        //})
    ]
};