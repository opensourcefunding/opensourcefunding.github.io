import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginFileSize from 'rollup-plugin-filesize';
import { terser as pluginTerser } from 'rollup-plugin-terser';
import pluginTypescript from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import pkg from './package.json';

export default [{
    input: 'src/app.ts',
    output: [{
        file: 'dist/app.bundle.js',
        format: 'iife',
    }],
    plugins: [
        pluginNodeResolve(),
        pluginTypescript({
            typescript,
        }),
        pluginTerser(),
        pluginFileSize({
            showMinifiedSize: true,
            showGzippedSize: true,
            showBrotliSize: true,
        }),
    ],
    external: [
        ...Object.keys(pkg.peerDependencies || {}),
    ],
}];
