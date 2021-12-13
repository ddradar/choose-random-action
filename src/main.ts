import { info, setFailed, setOutput } from '@actions/core'

import { chooseOne } from './choose'
import { getInputs } from './input'

/** main entry point */
export function run(): void {
  try {
    const choices = getInputs()
    const randomValue = Math.random()

    const selected = chooseOne(choices, randomValue)
    info(`selected: ${selected}`)
    setOutput('selected', selected)
  } catch (error) {
    setFailed(
      error instanceof Error ? error : /* istanbul ignore next */ `${error}`
    )
  }
}

run()
