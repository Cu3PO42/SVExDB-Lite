import webpack from 'webpack';

export default function (config, env, helpers) {
  const PUBLIC_PATH = env.production ? '/SVExDB-Lite/' : '/'
  config.output.publicPath = PUBLIC_PATH
  config.plugins.push(new webpack.DefinePlugin({ PUBLIC_PATH: JSON.stringify(PUBLIC_PATH) }))
}