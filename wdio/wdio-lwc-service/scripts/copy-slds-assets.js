const fs = require('fs-extra');
const path = require('path');

module.exports = () => {
    const assetsDir = path.resolve('node_modules/@salesforce-ux/design-system/assets');
    const outputDir = path.join(__dirname, './../build/assets');
    fs.copySync(assetsDir, outputDir);
}
