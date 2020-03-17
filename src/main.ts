import { debug, info, isDebug, setFailed, setOutput } from '@actions/core'

import { chooseOne } from './choose'
import { getInputs } from './input'

export function run(): void {
  try {
    const choices = getInputs()
    debug(`choices: ${choices}`)

    const randomValue = Math.random()
    if (isDebug()) {
      const sum = choices.reduce((p, c) => p + c.weight, 0)
      debug(`Math.random(): ${randomValue}`)
      debug(`Math.random() % weights.sum() + 1: ${(randomValue % sum) + 1}`)
    }

    const selected = chooseOne(choices, randomValue)
    info(`selected: ${selected}`)
    setOutput('selected', selected)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
