const {
    override,
    disableEsLint,
    addDecoratorsLegacy,
    fixBabelImports,
    addLessLoader
} = require("customize-cra");


const addWebWorker = () => config => {
    config.output.globalObject = "self";
    return config
};

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            // '@primary-color': '#1DA57A'
            '@font-size-base': '14px',
            '@font-family': 'Arial'
        },
    }),
    addWebWorker(),
    disableEsLint(),
    addDecoratorsLegacy(),
    fixBabelImports("react-app-rewire-mobx", {
        libraryDirectory: "",
        camel2DashComponentName: false
    }),
);
