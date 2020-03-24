import { Choice } from '../src/choice'
import { chooseOne } from '../src/choose'

describe('choose.ts', () => {
  describe('chooseOne()', () => {
    const choices: Choice[] = [
      { content: 'foo', weight: 1 },
      { content: 'bar', weight: 2 },
      { content: 'baz', weight: 2 }
    ]
    test.each([
      ['foo', 0.8],
      ['baz', 0.6],
      ['baz', 0.4],
      ['bar', 0.2],
      ['bar', 0]
    ])('returns %s if random is %i', (expected, random) => {
      expect(chooseOne(choices, random)).toBe(expected)
    })
    test.each([-1, 2, Infinity, -Infinity, NaN])(
      'throws error if random is %n',
      random =>
        expect(() => chooseOne(choices, random)).toThrowError(
          'random arg should be 0 <= random < 1.'
        )
    )
    test('throws error if weight is invalid', () => {
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
