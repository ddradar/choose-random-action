import { randomUUID } from 'node:crypto'
import { appendFileSync, existsSync } from 'node:fs'
import { EOL } from 'node:os'

/**
 * Writes a log message to the GitHub Actions log with the specified command.
 * @param command The GitHub Actions command to use (e.g., "debug", "error").
 * @param message The message to log.
 */
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
  process.stdout.write(`${message}${EOL}`)
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
 * Sanitizes a key-value pair for GitHub Actions output.
 * @param key The key of the output variable.
 * @param value The value of the output variable.
 * @returns The sanitized key-value pair string.
 */
function sanitizeKeyValue(key: string, value: string): string {
  let delimiter = `gh-delim-${randomUUID()}`
  while (key.includes(delimiter) || value.includes(delimiter)) {
    delimiter = `gh-delim-${randomUUID()}`
  }
  return `${key}<<${delimiter}${EOL}${value}${EOL}${delimiter}`
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

  appendFileSync(filePath, sanitizeKeyValue(key, value), { encoding: 'utf8' })
}

/**
 * Gets a multiline input variable from the GitHub Actions environment.
 * @param name The name of the input variable.
 * @param required Whether the input is required.
 * @returns An array of strings representing the multiline input.
 */
export function getMultilineInput(name: string, required = false): string[] {
  const value =
    process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] ?? ''
  if (required && !value) throw new Error(`${name} is required.`)
  return value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s)
}
