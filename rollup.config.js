/* eslint-disable no-console */
const path = require('path');
const lwcCompiler = require('@lwc/rollup-plugin');
const replace = require('rollup-plugin-replace');
const cleaner = require('rollup-plugin-cleaner');
const copy = require('rollup-plugin-cpy');
const copySldsAssets = require('rollup-slds-plugin');
const useMyIcon = require('./rollup/use-my-icon');

module.exports = {
    input: path.resolve('src/index.js'),
    output: {
        file: path.resolve('build/app.js'),
        format: 'iife',
    },
    plugins: [
        cleaner({
            targets: [
                './build/',
            ],
        }),
        copy({
            files: ['src/index.html'],
            dest: 'build',
            options: {
                verbose: true,
            },
        }),
        copySldsAssets({ dest: 'build/assets' }),
        useMyIcon(),
        lwcCompiler({
            mapNamespaceFromPath: true,
            resolveFromPackages: true,
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ],
    watch: {
        exclude: ['node_modules/**'],
    },
};
