import { getInput } from '@actions/core'

import type { Choice } from './choice'

/** Gets the values of user inputs.
 * @returns Parsed user inputs
 * @throws contents is empty, weights is not natural number,
 * or contents length not equals weights one.
 * @see {@link ../action.yml}
 */
export function getInputs(): Choice[] {
  type InputOptions = Parameters<typeof getInput>[1]
  const getMultipleInput = (name: string, options?: InputOptions) =>
    getInput(name, options)
      .split('\n')
      .filter(x => x !== '')

  const contents = getMultipleInput('contents', { required: true })
  const weights = getMultipleInput('weights').map(s => parseInt(s.trim(), 10))

  if (contents.length === 0) throw new Error('contents is required.')
  if (weights.length === 0)
    return contents.map(content => ({ content, weight: 1 }))

  if (weights.some(n => isNaN(n) || n <= 0))
    throw new Error('weights should be natural number.')
  if (contents.length !== weights.length)
    throw new RangeError(
      `Parameters should be the same length. (contents: ${contents.length} weights: ${weights.length})`
    )

  return contents.map((content, i) => ({ content, weight: weights[i] }))
}
