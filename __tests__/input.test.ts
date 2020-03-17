import { getInput } from '@actions/core'
import { mocked } from 'ts-jest/utils'

import { getInputs } from '../src/input'

jest.mock('@actions/core')

describe('input.ts', () => {
  describe('getInputs()', () => {
    test('throws error if contents is empty', () => {
      // Arrange
      mocked(getInput).mockReturnValue('')

      // Act - Assert
      expect(getInputs).toThrowError('contents is required.')
    })
    test('returns { content: contents[i], weight: 1 } if weight is empty', () => {
      // Arrange
      mocked(getInput).mockImplementation(n =>
        n === 'contents' ? 'foo\nbar\nbaz' : ''
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
        mocked(getInput).mockImplementation(n =>
          n === 'weights' ? weight : 'foo\nbar\nbaz'
        )

        // Act - Assert
        expect(getInputs).toThrowError('weights should be natural number.')
      }
    )
    test('throws error if contents.length !== weights.length', () => {
      // Arrange
      mocked(getInput).mockImplementation(n =>
        n === 'weights' ? '1\n2' : 'foo\nbar\nbaz'
      )

      // Act - Assert
      expect(getInputs).toThrowError(
        'Parameters should be the same length. (contents: 3 weights: 2)'
      )
    })
    test('returns { content: contents[i], weight: weight[i] } if contents.length === weights.length', () => {
      // Arrange
      mocked(getInput).mockImplementation(n =>
        n === 'contents' ? 'foo\nbar\nbaz' : '1\n2\n3'
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
