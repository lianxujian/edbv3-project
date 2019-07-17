var htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:{
        a:'./src/script/a.js',
        b:'./src/script/b.js',
        c:'./src/script/c.js',
        main:'./src/script/main.js',
    },
    output:{
        path:'./dist',
        filename:'js/[name]-[chunkhash].js',
        publicPath:'http://cdn.com/'
    },
    module:{
        loaders:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                query:{
                    presets:['latest']
                }
            }
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            filename:'index.html',//index-[hash]
            template:'index.html',
            inject:'body',//body false
            title:'webpack is good',
            chunks:['main']
           /* minify:{
                removeComments:true,//去掉注释
                collapseWhitespace:true,//去掉空格
            }*/
        }),
        new htmlWebpackPlugin({
            filename:'a.html',
            template:'index.html',
            inject:'body',
            title:'this is a.html',
            chunks:['a']
        }),
        new htmlWebpackPlugin({
            filename:'b.html',
            template:'index.html',
            inject:'body',
            title:'this is b.html',
            chunks:['b']
        }),
        new htmlWebpackPlugin({
            filename:'c.html',
            template:'index.html',
            inject:'body',
            title:'this is c.html',
            excludeChunks:['main','a']
        })
    ]
}