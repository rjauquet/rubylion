var gulp        = require('gulp'),
    webpack     = require('webpack'),
    gulpWebpack = require('gulp-webpack'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    path        = require('path');

// Webpack commons
var webpackCommons = {
    module: {
        loaders: [],
    },
    resolve: {
        root: [path.join(__dirname, "js")],
        extensions: ['', '.js', '.jsx'],
    }
};

gulp.task('default', ['webpack-build']);

gulp.task('webpack-build', function() {

    var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.bundle.js');

    return gulp.src('src/js/entry.jsx')
        .pipe(gulpWebpack({
            watch: true,
            context: path.join(__dirname, "js"),
                devtool: 'source-map',
                entry: {
                    app: ["./entry.jsx"]
                },
                output: {
                path: __dirname + '/build',
                filename: 'rubylion.bundle.js',
                publicPath: '/js/'
            },

            module: webpackCommons.module,
            resolve: webpackCommons.resolve,
            debug: true,
            plugins: [commonsPlugin]
        }, webpack ))
        .pipe(gulp.dest('build/js'))
        .pipe(reload({stream:true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        proxy: "0.0.0.0:9000",
        reloadDelay: 0,
        reloadOnRestart: false
    });
});