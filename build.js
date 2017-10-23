var fs = require('fs');

var index = fs.readFileSync('./build/index.html', 'utf-8');

var newIndex = index.replace(/href="/g, 'href="/static');
var newIndex = newIndex.replace(/src="/g, 'src="/static');

fs.writeFileSync('./build/index.html', newIndex, 'utf-8');
