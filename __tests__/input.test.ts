import { getMultilineInput } from '@actions/core'
import { readFile } from 'fs'
import { load as yamlLoad } from 'js-yaml'
import { join as pathJoin } from 'path'
import { mocked } from 'ts-jest/utils'
import { promisify } from 'util'

import { getInputs } from '../src/input'

jest.mock('@actions/core')
const readFileAsync = promisify(readFile)

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
    test('uses all input parameters defined action.yml', async () => {
      // Arrange
      // Load action.yml settings
      const yamlText = await readFileAsync(
        pathJoin(__dirname, '..', 'action.yml'),
        'utf8'
      )
      const actionSettings = yamlLoad(yamlText) as {
        inputs: Record<string, { required?: boolean }>
      }
      const expectedInputs = Object.entries(actionSettings.inputs).map(
        ([key, { required }]) => [key, required ? { required } : undefined]
      )
      mocked(getMultilineInput).mockReturnValue(mockWeights)

      // Act
      getInputs()

      // Assert
      expect(getMultilineInput).toHaveBeenCalledTimes(expectedInputs.length)
    })
  })
})
