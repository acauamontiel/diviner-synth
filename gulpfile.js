var gulp = require('gulp'),
	amd = require('amd-optimize'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	jade = require('gulp-jade'),
	stylus = require('gulp-stylus'),
	nib = require('nib'),
	browserSync = require('browser-sync'),
	path = {},
	dev;

function setPaths () {
	path = {
		src: __dirname + '/src/',
		build: __dirname + '/build/',
		dist: __dirname + '/dist/'
	};

	path.dest = (dev) ? path.build : path.dist;

	path.js = {
		watch: path.src + 'js/**/*.js',
		src: path.src + 'js/**/*.js',
		name: 'app',
		out: 'app.js',
		dest: path.dest + 'js/'
	};

	path.css = {
		watch: path.src + 'css/**/*.styl',
		src: path.src + 'css/style.styl',
		dest: path.dest + 'css/'
	};

	path.html = {
		watch: path.src + 'html/**/*.jade',
		src: path.src + 'html/*.jade',
		dest: path.dest
	};
}

gulp.task('js', function () {
	if (dev) {
		gulp.src(path.js.src)
			.pipe(jshint())
			.pipe(jshint.reporter(stylish))
			.pipe(amd(path.js.name))
			.pipe(concat(path.js.out))
			.pipe(gulp.dest(path.js.dest));
	} else {
		gulp.src(path.js.src)
			.pipe(amd(path.js.name))
			.pipe(concat(path.js.out))
			.pipe(uglify())
			.pipe(gulp.dest(path.js.dest));
	}
});

gulp.task('css', function () {
	gulp.src(path.css.src)
		.pipe(stylus({
			use: [nib()],
			compress: (!dev),
			errors: true
		}))
		.pipe(gulp.dest(path.css.dest));
});

gulp.task('html', function () {
	gulp.src(path.html.src)
		.pipe(jade({
			pretty: dev
		}))
		.pipe(gulp.dest(path.html.dest));
});

gulp.task('copy', function () {
	var files = [
		path.src + '*',
		path.src + 'dependencies/**',
		'!' + path.src + 'html',
		'!' + path.src + 'css',
		'!' + path.src + 'js'
	];

	gulp.src(files, {base: path.src})
		.pipe(gulp.dest(path.dest));
});

gulp.task('browser-sync', function () {
	browserSync.init([
		path.html.dest + '*.html',
		path.css.dest + '*.css',
		path.js.dest + '*.js'
	], {
		server: {
			baseDir: path.dest
		}
	});
});

gulp.task('watch', function () {
	gulp.watch([path.html.watch], ['html']);
	gulp.watch([path.css.watch], ['css']);
	gulp.watch([path.js.watch], ['js']);
});

gulp.task('setBuild', function () {
	dev = true;
	setPaths();
});
gulp.task('setDist', function () {
	dev = false;
	setPaths();
});

gulp.task('run', ['html', 'css', 'js', 'copy']);
gulp.task('build', ['setBuild', 'run']);
gulp.task('dist', ['setDist', 'run']);
gulp.task('default', ['build', 'browser-sync', 'watch']);
