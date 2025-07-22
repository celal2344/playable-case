module.exports = {
    apps: [
        {
            name: 'playable-api',
            script: './src/index.js',
            node_args: '-r dotenv/config --experimental-json-modules',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
