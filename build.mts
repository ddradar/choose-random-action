import { build } from 'esbuild'

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node24',
  outfile: 'dist/index.mjs',
  format: 'esm',
  logLevel: 'info',
})
