var gulp        = require('gulp'),
    webpack     = require('webpack'),
    gulpWebpack = require('gulp-webpack'),
    path        = require('path'),
    webserver   = require('gulp-webserver');

// Webpack commons
var webpackCommons = {
    module: {
        loaders: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'jsx-loader' },
        ],
    },
    resolve: {
        root: [path.join(__dirname, "js")],
        extensions: ['', '.js', '.jsx'],
    }
};

gulp.task('default', ['webserver', 'webpack']);

gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 9000
    }));
});

gulp.task('webpack', function() {

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
            plugins: [
                commonsPlugin
            ]
        }, webpack ))
        .pipe(gulp.dest('build/js'))
        .pipe(reload({stream:true}));
});