import { Choice } from './input'

export const chooseOne = (choices: Choice[], random: number): string => {
  const sortedChoices = choices.sort((l, r) => r.weight - l.weight)
  const weightSum = choices.reduce((prev, c) => prev + c.weight, 0)
  const selected = (random % weightSum) + 1

  let current = 0
  for (const choice of sortedChoices) {
    current += choice.weight
    if (current >= selected) return choice.content
  }

  // This is a dead path as long as choices[i].weight are natural integers.
  throw new RangeError('invalid choices.weight')
}
