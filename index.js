var config = require('./config.json'),
    path = require('path'),
    fs = require('fs'),
    im = require('imagemagick');

const extension = 'jpg';
const regexp = /fle.+\.jpg$/i;
const im_args = '-sampling-factor 4:2:0 -strip -quality 80 -interlace JPEG -colorspace sRGB';

im.convert.path = 'C:\\Program Files\\ImageMagick-6.9.9-Q16\\convert';

function test(filename, filter) {
    if (filter.test(filename)) {
        return true;
    }

    return false;
};

function find(startPath, filter, callback) {
    console.log(`Starting from dir '${startPath}'`);

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            find(filename, filter, callback); //recurse
        } else if (test(filename, filter)) callback(filename);
    };
};

find(config.path, regexp, function (filename) {
    if (filename.indexOf('_min.') !== -1) return;

    var filePath = path.dirname(filename);
    var basename = path.basename(filename, `.${extension}`);

    console.log(filename);
    
    var newFilename = path.join(filePath, `${basename}_min.${extension}`);

    var args = [filename, ...im_args.split(' '), newFilename];
    //console.log(args.join(' '));
    im.convert(args, function(err, stdout) {
        if (err) throw err;
        //console.log(stdout);
        //console.log(err);
    });
});