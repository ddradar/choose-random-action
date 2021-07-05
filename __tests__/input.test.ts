import { getMultilineInput } from '@actions/core'
import { mocked } from 'ts-jest/utils'

import { getInputs } from '../src/input'

jest.mock('@actions/core')

describe('input.ts', () => {
  const mockContent = ['foo', 'bar', 'baz']
  const mockWeights = ['1', '2', '3']
  describe('getInputs()', () => {
    beforeEach(() => mocked(getMultilineInput).mockClear())

    test('throws error if contents is empty', () => {
      // Arrange
      mocked(getMultilineInput).mockReturnValue([])

      // Act - Assert
      expect(getInputs).toThrowError('contents is required.')
    })
    test('returns { content: contents[i], weight: 1 } if weight is empty', () => {
      // Arrange
      mocked(getMultilineInput).mockImplementation(n =>
        n === 'contents' ? mockContent : []
      )

      // Act
      const choices = getInputs()

      // Assert
      expect(choices).toHaveLength(3)
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
        mocked(getMultilineInput).mockImplementation(n =>
          n === 'weights' ? [weight, weight, weight] : mockContent
        )

        // Act - Assert
        expect(getInputs).toThrowError('weights should be natural number.')
      }
    )
    test('throws error if contents.length !== weights.length', () => {
      // Arrange
      mocked(getMultilineInput).mockImplementation(n =>
        n === 'weights' ? ['1', '2'] : mockContent
      )

      // Act - Assert
      expect(getInputs).toThrowError(
        'Parameters should be the same length. (contents: 3 weights: 2)'
      )
    })
    test('returns { content: contents[i], weight: weight[i] } if contents.length === weights.length', () => {
      // Arrange
      mocked(getMultilineInput).mockImplementation(n =>
        n === 'contents' ? mockContent : mockWeights
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
