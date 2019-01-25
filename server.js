var static = require('node-static');
var file = new static.Server('./build');

require('http').createServer((request, response) => {
    request.addListener('end', () => {
        file.serve(request, response);
    }).resume();
}).listen(process.env.PORT || 3000, function() {
    console.log(`App is listening at ${this.address().port} port!`);
});