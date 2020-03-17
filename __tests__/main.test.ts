import { setFailed, setOutput } from '@actions/core'
import { mocked } from 'ts-jest/utils'

import { chooseOne } from '../src/choose'
import { getInputs } from '../src/input'
import { run } from '../src/main'

jest.mock('@actions/core')
jest.mock('../src/choose')
jest.mock('../src/input')

const randomString = (): string =>
  [...Array(12)].map(() => (~~(Math.random() * 36)).toString(36)).join('')

describe('main.ts', () => {
  beforeEach(() => jest.resetAllMocks())

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
    test('calls core.setOutput()', () => {
      // Arrange
      const expectedString = randomString()
      mocked(chooseOne).mockReturnValue(expectedString)

      // Act
      run()

      // Assert
      expect(setOutput).toBeCalledWith('selected', expectedString)
      expect(setFailed).not.toBeCalled()
    })
  })
})
