import resolveConfig from 'tailwindcss/resolveConfig';

import _keys from 'lodash/keys';
import _merge from 'lodash/merge';
import _pickBy from 'lodash/pickBy';
import _mapKeys from 'lodash/mapKeys';
import _isArray from 'lodash/isArray';

import generator from './util/generator';
import {corePlugins, corePluginsName} from './corePlugins';

export class Tailwind {
    constructor(config) {
        this.converter = this.converter.bind(this);
        this._configure(config);
    }

    _configure(config = {}) {
        this.config = resolveConfig(config);

        this.colors = this._getColors();

        let style = {};
        style = _merge(style, this._addCorePlugins(this.config.corePlugins || []));
        style = _merge(style, this._addPlugin(this.config.plugins || []));

        this.resetCache();
        this.style = style;
        return this.style;
    }

    plugin(func) {
        return func({
            addUtilities: this.addUtilities,
            addComponents: this.addUtilities,

            config: this.config,
            colors: this.colors,
            theme: this.config.theme,
        });
    }

    prefix(className) {
        return `${this.config.prefix}${this.config.separator}${className}`;
    }

    _getColors() {
        let colors = {};
        const themeColors = generator.generateColors(this.config.theme.colors);
        Object.assign(colors, themeColors);
        return colors;
    }

    _addUtilitiesOption = {
        respectPrefix: true,
        respectImportant: true,
        variants: [],
    };

    addUtilities(newUtilities, options = {}) {
        options = _merge(this._addUtilitiesOption, options);
        newUtilities = _mapKeys(newUtilities, className => {
            className = className.replaceAll('.', '');
            if (options.respectImportant) className = this.prefix(className);
            className = generator.translateKeys(className);

            return className;
        });

        return newUtilities;
    }

    _corePluginsToUse(cp) {
        if (_isArray(cp)) return cp;
        return _keys(_pickBy({...corePluginsName, ...cp}, plugin => plugin));
    }

    _addCorePlugins(cp) {
        cp = this._corePluginsToUse(cp);

        let style = {};
        const colors = this.colors;
        const theme = this.config.theme;

        cp.forEach(pluginName => {
            try {
                style = {...style, ...corePlugins[pluginName]({theme, colors})};
            } catch (e) {
                console.log('empty: -- ', pluginName);
            }
        });

        return style;
    }

    _addPlugin(pluginNames) {
        let style = {};
        pluginNames.forEach(pluginStyle => {
            style = {...style, ...pluginStyle};
        });

        return style;
    }

    _styleCache = {};

    resetCache() {
        this._styleCache = {};
    }

    converter(classes = '') {
        if (!classes) return {};
        const styleCache = this._styleCache;
        const t = this.style;

        let style = {};
        if (styleCache[classes]) return styleCache[classes];

        classes.split(' ').forEach(className => {
            if (!className || className === '\n') {
                return;
            }

            if (styleCache[className]) {
                style = {...style, ...styleCache[className]};
                return;
            }

            const cn = generator.translateKeys(className);
            if (t[cn]) {
                styleCache[className] = t[cn];
                style = {...style, ...styleCache[className]};
                return;
            }

            console.log(`Unsupported style ${className}`, cn, t[cn]);
        });

        styleCache[classes] = style;
        this._styleCache = styleCache;
        return style;
    }
}

export default Tailwind;
