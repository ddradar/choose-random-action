import { getMultilineInput } from '@actions/core'

import type { chooseOne } from './choose.ts'

/** Gets the values of user inputs.
 * @returns Parsed user inputs
 * @throws contents is empty, weights is not natural number,
 * or contents length not equals weights one.
 * @see {@link ../action.yml}
 */
export function getInputs(): Parameters<typeof chooseOne>[0] {
  const contents = getMultilineInput('contents', { required: true })
  const weights = getMultilineInput('weights').map(s => parseInt(s.trim(), 10))

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
