module.exports = {
    context: __dirname + "/scripts/react/components",
    entry: __dirname + "/scripts/react/components/MainApp",
    output: {
        filename: "sanyam.js",
        path: __dirname + "/dist/js/"
    },
    module: {
        loaders: [
            { test: /\.js?$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
};
