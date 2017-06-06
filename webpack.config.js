var webpack           = require('webpack'),
    path              = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');


var plugins = [
    new ExtractTextPlugin({ filename: 'css/[name].css' }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    })
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
            }
        })
    );
}

module.exports = {
    context: path.resolve(__dirname + '/assets/app'),
    entry: ['./js/main.js'],
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            }
        ]
    },
    plugins: plugins,
    devServer: {
        port: 3000,
        contentBase: 'public',
        historyApiFallback: true,
        inline: true,
        hot: true,
    }
};