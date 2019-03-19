/* eslint-disable lwc/no-async-await */
const rollup = require('rollup');
const fs = require('fs-extra');
const path = require('path');
const replace = require('rollup-plugin-replace');
const lwcCompiler = require('@lwc/rollup-plugin');
const rollupCompatPlugin = require('rollup-plugin-compat');
const rollupItestResolver = require('./rollup/rollup-itest-resolver');
const templates = require('./rollup/rollup-itest-resolver/templates');
const globals = require('./rollup/globals');
const external = require('./rollup/external');

module.exports = async function build(test, { isCompat }) {
    const { name } = path.parse(test);
    const bundle = await rollup.rollup({
        input: test,
        external,
        plugins: [
            rollupItestResolver(),
            lwcCompiler({
                mapNamespaceFromPath: true,
                resolveFromPackages: true,
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            isCompat && rollupCompatPlugin({ polyfills: false }),
        ],
    });

    const outputDir = path.join(__dirname, `../build/${name}`);
    fs.ensureDirSync(outputDir);
    
    fs.writeFileSync(
        path.join(outputDir, 'index.html'),
        templates.html(name, { isCompat }),
    );

    return bundle.write({
        file: path.join(outputDir, 'bundle.js'),
        format: 'iife',
        globals,
    });
}
