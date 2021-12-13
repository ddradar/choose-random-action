import type { Choice } from '../src/choice'
import { chooseOne } from '../src/choose'

jest.mock('@actions/core')

describe('src/choose.ts', () => {
  describe('chooseOne', () => {
    const choices: Choice[] = [
      { content: 'foo', weight: 1 },
      { content: 'bar', weight: 2 },
      { content: 'baz', weight: 2 }
    ]

    test.each([
      [0.99, 'foo'],
      [0.8, 'foo'],
      [0.79, 'baz'],
      [0.4, 'baz'],
      [0.39, 'bar'],
      [0, 'bar']
    ])('(choices, %d) returns %s', (random, expected) =>
      expect(chooseOne(choices, random)).toBe(expected)
    )
    test.each([-1, 2, Infinity, -Infinity, NaN])(
      '(choices, %d) throws error',
      random =>
        expect(() => chooseOne(choices, random)).toThrowError(
          'random arg should be 0 <= random < 1.'
        )
    )
    test('([invalidChoices], any) throws error', () => {
      const invalidChoices = [
        { content: 'foo', weight: 0 },
        { content: 'bar', weight: 0 },
        { content: 'baz', weight: 0 }
      ]
      expect(() => chooseOne(invalidChoices, 0.2)).toThrowError(
        'invalid choices.weight'
      )
    })
  })
})
