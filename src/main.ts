import { setFailed, setOutput } from '@actions/core'

import { chooseOne } from './choose'
import { getInputs } from './input'

export function run(): void {
  try {
    const choices = getInputs()
    const selected = chooseOne(choices, Math.random())
    setOutput('selected', selected)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
