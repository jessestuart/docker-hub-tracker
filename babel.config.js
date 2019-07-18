module.exports = {
  // compact: true,
  // comments: false,
  sourceRoot: 'src/',
  ignore: ['./src/__tests__/*'],
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: ['lodash', '@babel/plugin-transform-runtime'],
}
