import { getMultilineInput } from '@actions/core'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { getInputs } from '../src/input.js'

vi.mock('@actions/core')

describe('src/input.ts', () => {
  describe('getInputs()', () => {
    const contents = ['foo', 'bar', 'baz']
    const weights = ['1', '2', '3']

    beforeEach(() => {
      vi.mocked(getMultilineInput).mockClear()
    })

    test('throws error if contents is empty', () => {
      // Arrange
      vi.mocked(getMultilineInput).mockReturnValue([])

      // Act - Assert
      expect(getInputs).toThrowError('contents is required.')
    })
    test('returns { content: contents[i], weight: 1 } if weight is empty', () => {
      // Arrange
      vi.mocked(getMultilineInput).mockImplementation(n =>
        n === 'contents' ? contents : []
      )

      // Act
      const choices = getInputs()

      // Assert
      expect(choices).toStrictEqual([
        { content: 'foo', weight: 1 },
        { content: 'bar', weight: 1 },
        { content: 'baz', weight: 1 }
      ])
    })
    test.each(['foo', '-1', 'NaN'])(
      'throws error if weight is "%s"',
      weight => {
        // Arrange
        vi.mocked(getMultilineInput).mockImplementation(n =>
          n === 'weights' ? [weight, weight, weight] : contents
        )

        // Act - Assert
        expect(getInputs).toThrowError('weights should be natural number.')
      }
    )
    test('throws error if contents.length !== weights.length', () => {
      // Arrange
      vi.mocked(getMultilineInput).mockImplementation(n =>
        n === 'weights' ? ['1', '2'] : contents
      )

      // Act - Assert
      expect(getInputs).toThrowError(
        'Parameters should be the same length. (contents: 3 weights: 2)'
      )
    })
    test('returns { content: contents[i], weight: weight[i] } if contents.length === weights.length', () => {
      // Arrange
      vi.mocked(getMultilineInput).mockImplementation(n =>
        n === 'contents' ? contents : weights
      )

      // Act
      const choices = getInputs()

      // Assert
      expect(choices).toHaveLength(3)
      expect(choices).toStrictEqual([
        { content: 'foo', weight: 1 },
        { content: 'bar', weight: 2 },
        { content: 'baz', weight: 3 }
      ])
    })
  })
})
