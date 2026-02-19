import { appendFileSync, existsSync } from 'node:fs'
import { EOL } from 'node:os'

function ghCommand(command: string, message: string): void {
  process.stdout.write(`::${command}::${message}${EOL}`)
}

/**
 * Writes a debug message to the GitHub Actions log.
 * @param message The message to log.
 */
export function debug(message: string): void {
  ghCommand('debug', message)
}

/**
 * Writes an info message to the GitHub Actions log.
 * @param message The message to log.
 */
export function info(message: string): void {
  ghCommand('info', message)
}

/**
 * Writes an error message to the GitHub Actions log.
 * @param message The message to log.
 * @summary
 * This function does not set the process exit code.
 * The caller should set `process.exitCode = 1` if they want to indicate an error occurred.
 */
export function error(message: string): void {
  ghCommand('error', message)
}

/**
 * Sets an output variable for the GitHub Actions.
 * @param key The name of the output variable.
 * @param value The value of the output variable.
 */
export function setOutput(key: string, value: string): void {
  const outputEnv = 'GITHUB_OUTPUT'
  const filePath = process.env[outputEnv]
  if (!filePath || !existsSync(filePath))
    throw new Error(
      `${outputEnv} environment variable is not set or file does not exist.`
    )

  appendFileSync(filePath, `${key}=${value}${EOL}`, { encoding: 'utf8' })
}

export function getMultilineInput(name: string, required = false) {
  const value =
    process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] ?? ''
  if (required && !value) throw new Error(`${name} is required.`)
  return value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s)
}
