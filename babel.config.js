module.exports = {
  compact: true,
  comments: false,
  sourceRoot: './src/',
  ignore: ['./src/__tests__/*'],
  presets: [
    [
      '@babel/env',
      {
        corejs: 3,
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-typescript',
    'minify',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-object-rest-spread',
    'lodash',
    [
      'module-resolver',
      {
        root: ['./src/'],
        extensions: ['ts'],
      },
    ],
  ],
}
