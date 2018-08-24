/* 存放公共的配置，不区分生产或开发环境 */
const path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'topology.js',
        library: 'Topology',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                                [
                                    "env",
                                    {
                                        "modules": false
                                    }
                                ]
                            ],
                            plugins: [
                                'transform-object-rest-spread',
                                'transform-export-extensions'
                            ]
                        }
                    }
                ],
                exclude: [/node_modules/]
            },
            {
                test: /\.(png|svg|jpg|gif|woff|tff|)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024 * 30,         //30KB 以下的文件采用 url-loader
                        fallback: 'file-loader',  //否则采用 file-loader，默认值就是 file-loader
                        outputPath: 'images',     //图片输出路径
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,    //使用正则匹配所有需要使用此loader的文件
                use: ['style-loader','css-loader', 'sass-loader']  //处理顺序:sass-loader->css-loader->style-loader
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                    publicPath: '../'
                }
            },
        ]
    },
    plugins: [
    ]
};