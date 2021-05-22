#!/usr/bin/env node
const {Tailwind} = require('../dist/tailwind');

const tailwindConfig = require('./fixtures/sampleConfig');

const fs = require('fs');
const path = require('path');

const _camelCase = require('lodash/camelCase');

function _var(token) {
    return `"$${_camelCase(token)}"`;
}

function replaceVars(content) {
    return content.replace(/"var\(--([^\\)]+)\)"/g, (__, item) => _var(item));
}

const config = new Tailwind({
    ...tailwindConfig,
    theme: JSON.parse(replaceVars(JSON.stringify(tailwindConfig.theme, null, 0))),
});

const output = path.resolve(__dirname, './output/styles.json');
let configStyle = JSON.stringify(config.style, null, 2);
fs.writeFileSync(output, configStyle);
