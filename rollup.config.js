import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
// import postcss from 'rollup-plugin-postcss-modules'
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';
import sass from 'rollup-plugin-sass';

export default {
  input: [
    'src/index.tsx',
    'src/DevToolsPlugin.ts',
    'src/withDevTools.ts',
    'src/Provider.ts',
    'src/DummyProvider.ts'
  ],
  output: [
    {
      dir: 'lib',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      dir: 'lib/es',
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: false
    }),
    url(),
    svgr(),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    commonjs(),
    sass({
      failOnError: true,
      output: 'lib/SlateDevTools.css'
    })
  ]
};
