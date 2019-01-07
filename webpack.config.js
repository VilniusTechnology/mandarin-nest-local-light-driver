const path = require('path');
const fs = require('fs');
const PermissionsOutputPlugin = require('webpack-permissions-plugin');
const nodeModules = {};

fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });
 
module.exports = {
    target: 'web',
    mode: "development",
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    // the main source code file
    entry: {
        app: './src/index.ts',
    },                
    output: {
        // the output file name
        filename: '[name].js',
        // the output path               
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { 
                test: /\.ts$/, 
                loader: 'ts-loader',
            }
        ],
    },
    externals: nodeModules,
    plugins: [
		new PermissionsOutputPlugin({
            buildFolders: [
                {
                    path: path.resolve(__dirname, 'dist/'),
                    fileMode: '777',
                    dirMode: '777'
                }
            ],
            buildFiles: [
                {
                    path: path.resolve(__dirname, 'dist/app.js'),
                    fileMode: '777'
                }
            ],
          })
	]
};
