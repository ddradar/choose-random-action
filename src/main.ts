import { chooseOne } from './choose.ts'
import { error, info, setOutput } from './gh-command.ts'
import { getInputs } from './input.ts'

/** main entry point */
export function run(): void {
  try {
    const selected = chooseOne(getInputs(), Math.random())

    info(`selected: ${selected}`)
    setOutput('selected', selected)
  } catch (e) {
    process.exitCode = 1
    error(e instanceof Error ? e.toString() : `${e as string}`)
  }
}

run()
