module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: { node: 'current' }
        }]
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        [
            require("@babel/plugin-proposal-class-properties"),
            {
                loose: true
            }
        ]
    ]
};
