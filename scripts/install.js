const fs = require('fs');
var files = fs.readdirSync(__dirname+'/../config/');

files.forEach(function(file) {
    var srcFile = __dirname+'/../config/' + file;
    var targetFile = srcFile.replace('.dist', '');
    if (!fs.existsSync(targetFile)) {
        console.log('Created file '+targetFile);
        fs.createReadStream(__dirname + '/../config/'+srcFile).pipe(fs.createWriteStream(__dirname + '/../config/'+targetFile));
    } else {
        console.log('Skipped file '+targetFile);
    }
});
