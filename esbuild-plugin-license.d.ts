// esbuild-plugin-license does not export type definitions correctly.
// This file provides the correct type definitions for use in TypeScript projects.
declare module 'esbuild-plugin-license' {
  import type { Plugin } from 'esbuild'

  interface NormalizedPackageJson {
    name: string
    version: string
    license?: string
    [key: string]: unknown
  }

  export interface Dependency {
    packageJson: NormalizedPackageJson
    licenseText: string
  }

  export interface Options {
    banner?: string
    thirdParty?: {
      includePrivate?: boolean
      output?: {
        file?: string
        template?:
          | string
          | ((dependencies: Dependency[], self: Dependency) => string)
      }
    }
  }

  export default function esbuildPluginLicense(options?: Options): Plugin
}
