const path = require('path');

module.exports = function configProviderPlugin() {
    return {
        name: 'use-my-icon',
        resolveId: id => {
            if (id === 'lightning/primitiveIcon') {
                return path.join(__dirname, './../../src/modules/my/primitiveIcon/primitiveIcon.js');
            }
            return undefined;
        },
    };
};