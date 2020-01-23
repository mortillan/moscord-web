const withCSS = require('@zeit/next-css')
const defaultGetLocalIdent = require('css-loader/dist/utils').getLocalIdent

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]-[hash:base64:5]',
    getLocalIdent: (loaderContext, localIdentName, localName, options) => {
      //Check if filename has .module.css extesion, if yes use css module.
      //else just load the file so bootstrap will not be loaded as css module 
      //and it's class will have hashed named
      let filePath = loaderContext.resourcePath
      
      let isFromGlobal = filePath.includes('.module.css')
      if (!isFromGlobal) return localName

      return defaultGetLocalIdent(
        loaderContext,
        localIdentName,
        localName,
        options
      )
    }
  },
  env: {
    API_URL: 'http://localhost:3000'
  }
})