import type { chooseOne } from './choose.ts'
import { getMultilineInput } from './gh-command.ts'

/** Gets the values of user inputs.
 * @returns Parsed user inputs
 * @throws contents is empty, weights is not natural number,
 * or contents length not equals weights one.
 * @see {@link ../action.yml}
 */
export function getInputs(): Parameters<typeof chooseOne>[0] {
  const contents = getMultilineInput('contents', true)
  const weightInputs = getMultilineInput('weights')

  if (contents.length === 0) throw new Error('contents is required.')
  if (weightInputs.length === 0)
    return contents.map(content => ({ content, weight: 1 }))
  if (contents.length !== weightInputs.length)
    throw new RangeError(
      `Parameters should be the same length. (contents: ${contents.length} weights: ${weightInputs.length})`
    )

  const result: ReturnType<typeof getInputs> = []
  for (const rawWeight of weightInputs) {
    const weight = parseInt(rawWeight, 10)
    if (isNaN(weight) || weight <= 0)
      throw new Error('weights should be natural number.')
    result.push({ content: contents[result.length]!, weight })
  }
  return result
}
