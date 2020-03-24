import type { Choice } from './choice'

/** Choose one content in choices depends on random value.
 * @param choices content
 * @param random random number such as Math.random(). (should be 0 <= random < 1)
 * @returns choices[i].content
 * @throws random <= 0, random < 1 or choices.weight are not natural integers.
 */
export const chooseOne = (choices: Choice[], random: number): string => {
  if (isNaN(random) || random < 0 || 1 <= random)
    throw RangeError('random arg should be 0 <= random < 1.')
  const sortedChoices = choices.sort((l, r) => r.weight - l.weight)
  const weightSum = choices.reduce((prev, c) => prev + c.weight, 0)
  const selected = Math.floor(random * weightSum) + 1

  let current = 0
  for (const choice of sortedChoices) {
    current += choice.weight
    if (current >= selected) return choice.content
  }

  // This is a dead path as long as choices[i].weight are natural integers.
  throw new RangeError('invalid choices.weight')
}
