import { setFailed, setOutput } from '@actions/core'
import { readFile } from 'fs'
import { safeLoad as yamlLoad } from 'js-yaml'
import { join as pathJoin } from 'path'
import { mocked } from 'ts-jest/utils'
import { promisify } from 'util'

import { chooseOne } from '../src/choose'
import { getInputs } from '../src/input'
import { run } from '../src/main'

jest.mock('@actions/core')
jest.mock('../src/choose')
jest.mock('../src/input')
const readFileAsync = promisify(readFile)

const randomString = (): string =>
  [...Array(12)].map(() => (~~(Math.random() * 36)).toString(36)).join('')

describe('main.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mocked(getInputs).mockReturnValue([
      { content: 'foo', weight: 1 },
      { content: 'bar', weight: 2 },
      { content: 'baz', weight: 2 }
    ])
  })

  describe('run()', () => {
    test('calls core.setFailed() if an error occurs', () => {
      // Arrange
      const errorMessage = randomString()
      mocked(getInputs).mockImplementation(() => {
        throw new Error(errorMessage)
      })

      // Act
      run()

      // Assert
      expect(setOutput).not.toBeCalled()
      expect(setFailed).toBeCalledWith(errorMessage)
    })
    test('calls core.setOutput()', async () => {
      // Arrange
      // Load action.yml settings
      const yamlText = await readFileAsync(
        pathJoin(__dirname, '..', 'action.yml'),
        'utf8'
      )
      const actionSettings = yamlLoad(yamlText)
      const expectedOutputs = Object.keys(actionSettings.outputs)
      const expectedString = randomString()
      mocked(chooseOne).mockReturnValue(expectedString)

      // Act
      run()

      // Assert
      expect(setOutput).toHaveBeenCalledTimes(expectedOutputs.length)
      for (const key of expectedOutputs) {
        expect(setOutput).toHaveBeenCalledWith(key, expectedString)
      }
      expect(setFailed).not.toBeCalled()
    })
  })
})
