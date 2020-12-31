import {Tailwind} from './tailwind';

let defaultConfig = require('./stubs/simpleConfig.stub');

try {
    defaultConfig = require('../../tailwind.config');
} catch (e) {}

const tailwindObj = new Tailwind(defaultConfig);

export const converter = tailwindObj.converter;
export const css = converter;
export const c = converter;

export const colors = tailwindObj.colors;
export const color = colors;

export const resetCache = tailwindObj.resetCache;
