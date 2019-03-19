const path = require('path');
const templates = require('./templates');

module.exports = () => ({
    name: 'rollup-itest-resolver',
    load(id) {
        if (id.includes('.spec.js')) {
            const namespace = 'integration';
            const { base } = path.parse(id);
            const component = base.replace('.spec.js', '');
            return templates.app({ namespace, component });
        }
        return null;
    }
});
