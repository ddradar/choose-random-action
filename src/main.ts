import { info, setFailed, setOutput } from '@actions/core'

import { chooseOne } from './choose'
import { getInputs } from './input'

/** main entry point */
export function run(): void {
  try {
    const selected = chooseOne(getInputs(), Math.random())

    info(`selected: ${selected}`)
    setOutput('selected', selected)
  } catch (error) {
    setFailed(
      error instanceof Error ? error : /* istanbul ignore next */ `${error}`
    )
  }
}

run()
