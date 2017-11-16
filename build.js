var fs = require('fs');

console.log('Adding \'/static\' to beginning of paths in index.html... ');

var index = fs.readFileSync('./build/index.html', 'utf-8');

var newIndex = index.replace(/href="/g, 'href="/static');
var newIndex = newIndex.replace(/src="/g, 'src="/static');

fs.writeFileSync('./build/index.html', newIndex, 'utf-8');

console.log('Moving static files out of static folder...');

fs.readdir('./build/static', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        if (file !== 'css' && file !== 'js') {
            console.log('Moving ' + file);
            fs.rename('./build/static/' + file, './build/' + file, err => {
                if (err) throw err;
            });
        } else {
            console.log('Skipping ' + file);
        }
    });
});
