const path = require('path');

module.exports = function configProviderPlugin() {
    return {
        name: 'config-provider-plugin',
        resolveId: id => {
            if (id === 'lightning/configProvider') {
                return path.join(__dirname, './config-provider.js');
            }
            return undefined;
        },
    };
};