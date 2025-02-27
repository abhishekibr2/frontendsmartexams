function oo_cm() {
    if (typeof window !== 'undefined') {
        try {
            return eval("globalThis._console_ninja") || eval(`
                'use strict';
                function _0x59f0(_0x20fafe, _0x3c6983) {
                    var _0x2ea3af = _0x2ea3();
                    return _0x59f0 = function (_0x59f03c, _0x2529e2) {
                        _0x59f03c = _0x59f03c - 0x1dc;
                        var _0x437cb3 = _0x2ea3af[_0x59f03c];
                        return _0x437cb3;
                    };
                    _0x59f0(_0x20fafe, _0x3c6983);
                }
            `);
        } catch (error) {
            console.error('Error in oo_cm:', error);
        }
    }
}

const withNextIntl = require('next-intl/plugin')();
const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

try {
    const envPath = path.resolve(__dirname, '../.env');
    const envConfig = dotenv.config({ path: envPath });
    dotenvExpand.expand(envConfig);
} catch (error) {
    console.error('Failed to load .env file:', error);
}

module.exports = withPlugins(
    [
        [withNextIntl],
        [
            withLess,
            {
                lessLoaderOptions: {
                    lessOptions: {
                        javascriptEnabled: true,
                        modifyVars: { '@primary-color': '#1DA57A' }
                    }
                }
            }
        ]
    ],
    {
        images: {
            domains: ['localhost', 'api.smartexams.com.au']
        }
    }
);
