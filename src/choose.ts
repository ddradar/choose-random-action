import { debug } from '@actions/core'

type Choice = { content: string; weight: number }

/** Choose one content in choices depends on random value.
 * @param choices content
 * @param random random number such as Math.random(). (should be 0 <= random < 1)
 * @returns choices[i].content
 * @throws random <= 0, random < 1 or choices.weight are not natural integers.
 */
export function chooseOne(choices: Choice[], random: number): string {
  debug(`choices: ${JSON.stringify(choices)}`)
  debug(`Math.random(): ${random}`)
  if (isNaN(random) || random < 0 || 1 <= random)
    throw RangeError('random arg should be 0 <= random < 1.')
  const sortedChoices = choices.sort((l, r) => r.weight - l.weight)
  const weightSum = choices.reduce((prev, c) => prev + c.weight, 0)
  // 1 <= selected <= weightSum
  const selected = Math.floor(random * weightSum) + 1
  debug(`Choice: ${selected}`)

  let current = 0
  for (const choice of sortedChoices) {
    current += choice.weight
    if (current >= selected) return choice.content
  }

  // This is a dead path as long as choices[i].weight are natural integers.
  throw new RangeError('invalid choices.weight')
}
