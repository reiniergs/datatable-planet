const path = require('path');
const buildTest = require('./scripts/build-test');
const startStaticServer = require('./scripts/start-static-server');
const copySldsAsset = require('./scripts/copy-slds-assets');
const isCompat = require('./scripts/is-compat')();
const copyEngineFiles = require('./scripts/copy-engine-files');

module.exports = class LWCService {

    onPrepare() {
        return startStaticServer()
            .then(copySldsAsset)
            .then(() => copyEngineFiles({ isCompat }));    
    }

    beforeSuite({ file }) {
        const { name } = path.parse(file);
        global.URL = `http://localhost:1337/${name}/index.html`;
        return buildTest(file, {
            isCompat,
        });
    }
}
