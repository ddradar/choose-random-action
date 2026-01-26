import { build } from 'esbuild'
import license from 'esbuild-plugin-license'

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node24',
  outfile: 'dist/index.mjs',
  format: 'esm',
  logLevel: 'info',
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
  plugins: [
    license({
      thirdParty: {
        output: {
          file: 'dist/licenses.txt',
          template(deps) {
            return deps
              .map(
                dep =>
                  `${dep.packageJson.name}\n${dep.packageJson.license}\n${dep.licenseText}`
              )
              .join('\n\n')
          },
        },
      },
    }),
  ],
})
