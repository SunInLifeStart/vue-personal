// vue.config.js
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    runtimeCompiler: true,//是否使用包含运行时编译器的 Vue 构建版本
    baseUrl: '',
    productionSourceMap: false, //不在production环境使用SourceMap
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            }
        }
    },
    configureWebpack: (config) => {
        //入口文件
        config.entry.app = ['babel-polyfill', './src/main.js'];
        //删除console插件
        let plugins = [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true
                    },
                    output: {
                        // 去掉注释内容
                        comments: false,
                    }
                },
                sourceMap: false,
                parallel: true,
            })
        ];
        //只有打包生产环境才需要将console删除
        if (process.env.VUE_APP_build_type == 'production') {
            config.plugins = [...config.plugins, ...plugins];
        }
    },
    //允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: (config) => {
        //命名 
        config.resolve.alias
            .set('@', resolve('src'))
            .set('ASSET', resolve('src/assets'));
        //打包文件带hash
        config.output.filename('[name].[hash].js').end();

        //为了补删除换行而加的配置
        config.module
            .rule("vue")
            .use("vue-loader")
            .loader("vue-loader")
            .tap(options => {
                // modify the options...
                options.compilerOptions.preserveWhitespace = true;
                return options;
            });
    },
    devServer: {
        port: 8889,
        proxy: {
            
            "/api/": {
                target: "http://116.117.157.232"
            },
            "/budget/": {
            target: "http://116.117.157.232"
            },
            "/workflow/": {
            target: "http://116.117.157.232:10099"
            },
            "/solr": {
                target: "http://116.117.157.232"
            },
            "/thumb": {
                target: "http://116.117.157.232"
            },
            "/socket.io": {
                target: "http://116.117.157.232",
                ws: true,
                changeOrigin: true
            },
            // "query": {
            //     target: "http://192.168.0.253:10148",
            //     ws: true,
            //     changeOrigin: true
            // },
            "/get":{
                target: "http://192.168.0.253:10148",
                ws: true,
                changeOrigin: true
            }
        }
    },
    pages: {
        index:
        {
            template: './public/index.html',
            entry: './src/main.js',
            filename: 'index.html',
            title: '首页-中关村协同发展'
        },
        login:
        {
            template: './public/login.html',
            entry: './src/pages/login/main.js',
            filename: 'login.html',
            title: '登录-中关村协同发展'
        }
    }
};