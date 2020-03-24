import { getInput } from '@actions/core'
import { readFile } from 'fs'
import { safeLoad as yamlLoad } from 'js-yaml'
import { join as pathJoin } from 'path'
import { mocked } from 'ts-jest/utils'
import { promisify } from 'util'

import { getInputs } from '../src/input'

jest.mock('@actions/core')
const readFileAsync = promisify(readFile)

describe('input.ts', () => {
  describe('getInputs()', () => {
    beforeEach(() => mocked(getInput).mockClear())

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
          n === 'weights' ? `${weight}\n${weight}\n${weight}` : 'foo\nbar\nbaz'
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
    test('uses all input parameters defined action.yml', async () => {
      // Arrange
      // Load action.yml settings
      const yamlText = await readFileAsync(
        pathJoin(__dirname, '..', 'action.yml'),
        'utf8'
      )
      const actionSettings = yamlLoad(yamlText)
      const expectedInputs = Object.keys(actionSettings.inputs)
      mocked(getInput).mockReturnValue('1\n2\n3')

      // Act
      getInputs()

      // Assert
      expect(getInput).toHaveBeenCalledTimes(expectedInputs.length)
      for (const key of expectedInputs) {
        if (actionSettings.inputs[key].required) {
          expect(getInput).toHaveBeenCalledWith(key, { required: true })
        } else {
          expect(getInput).toHaveBeenCalledWith(key, undefined)
        }
      }
    })
  })
})
