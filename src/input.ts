import { getInput, InputOptions } from '@actions/core'

const getMultipleInput = (
  name: string,
  options?: InputOptions | undefined
): string[] =>
  getInput(name, options)
    .split('\n')
    .filter(x => x !== '')

type Choice = {
  content: string
  weight: number
}

export const getInputs = (): Choice[] => {
  const contents = getMultipleInput('contents', { required: true })
  const weights = getMultipleInput('weights').map(s => parseInt(s))

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
