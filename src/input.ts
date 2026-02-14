import type { chooseOne } from './choose.ts'

/** Gets the values of user inputs.
 * @returns Parsed user inputs
 * @throws contents is empty, weights is not natural number,
 * or contents length not equals weights one.
 * @see {@link ../action.yml}
 */
export function getInputs(): Parameters<typeof chooseOne>[0] {
  const contents = getMultilineInputsFromEnv('contents', true)
  const weights = getMultilineInputsFromEnv('weights').map(s =>
    parseInt(s.trim(), 10)
  )

  if (contents.length === 0) throw new Error('contents is required.')
  if (weights.length === 0)
    return contents.map(content => ({ content, weight: 1 }))

  if (weights.some(n => isNaN(n) || n <= 0))
    throw new Error('weights should be natural number.')
  if (contents.length !== weights.length)
    throw new RangeError(
      `Parameters should be the same length. (contents: ${contents.length} weights: ${weights.length})`
    )

  return contents.map((content, i) => ({
    content,
    weight: weights[i]!,
  }))
}

function getMultilineInputsFromEnv(name: string, required = false) {
  const value =
    process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] ?? ''
  if (required && !value) throw new Error(`${name} is required.`)
  return value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s)
}
