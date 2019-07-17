var htmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
module.exports = {
    entry:'./src/app.js',
    output:{
        path:'./dist',
        filename:'js/[name].bundle.js'
    },
    module:{
        loaders:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude:path.resolve(__dirname,'node_modules'),//相对路径
                include:'./src/',
                query:{
                    presets:['latest']
                }
            },
            {
                test:/\.css$/,                      //（以后面loader的方式处理引进来的css）
                loader:'style-loader!css-loader',//importLoaders=1!postcss-loader 给css加前缀这类的处理
            },
            {
                test:/\.html$/,
                loader:'html-loader',
            }
        ]
    },
   /* postcss:[
      require('autoprefixer')({
          broswers:['last 5 versions']
      })
    ],*/
    plugins:[
        new htmlWebpackPlugin({
            filename:'index.html',
            template:'index.html',
            inject:'body',
        })
    ]
}