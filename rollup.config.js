import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginFileSize from 'rollup-plugin-filesize';
import { terser as pluginTerser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [{
    input: 'dist/src/app.js',
    output: [{
        file: 'dist/app.bundle.js',
        format: 'iife',
    }],
    plugins: [
        pluginNodeResolve(),
        pluginTerser(),
        pluginFileSize({
            showMinifiedSize: true,
            showGzippedSize: true,
            showBrotliSize: true,
        }),
    ],
    external: [
        // ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
}];
