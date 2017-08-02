/* @flow */

import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const { BUILD_TARGET } = process.env;

if (!BUILD_TARGET) {
  throw new Error(
    'Specify build target via BUILD_TARGET environment variable.',
  );
}

export default {
  entry: 'src/index.js',
  format: BUILD_TARGET,
  dest: `lib/react-validation-layer.${BUILD_TARGET}.js`,
  moduleName: 'ReactValidationLayer',
  external: ['react'],
  globals: { react: 'React' },
  plugins: [babel({ exclude: 'node_modules/**' }), resolve(), commonjs()],
};
