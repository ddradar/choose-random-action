import { chooseOne } from '../src/choose'
import { Choice } from '../src/input'

describe('choose.ts', () => {
  describe('chooseOne()', () => {
    const choices: Choice[] = [
      { content: 'foo', weight: 1 },
      { content: 'bar', weight: 2 },
      { content: 'baz', weight: 2 }
    ]
    test.each([
      ['foo', 4],
      ['baz', 3],
      ['baz', 2],
      ['bar', 1],
      ['bar', 0]
    ])('returns %s if random is %i', (expected, random) => {
      expect(chooseOne(choices, random)).toBe(expected)
    })
    test('throws error if weight is invalid', () => {
      const invalidChoices = [
        { content: 'foo', weight: -1 },
        { content: 'bar', weight: -2 },
        { content: 'baz', weight: -2 }
      ]
      expect(() => chooseOne(invalidChoices, 4)).toThrowError()
    })
  })
})
