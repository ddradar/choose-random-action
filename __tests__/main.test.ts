import { isDebug, setFailed, setOutput } from '@actions/core'
import { mocked } from 'ts-jest/utils'

import { chooseOne } from '../src/choose'
import { getInputs } from '../src/input'
import { run } from '../src/main'

jest.mock('@actions/core')
jest.mock('../src/choose')
jest.mock('../src/input')

const randomString = (): string =>
  [...Array(12)].map(() => (~~(Math.random() * 36)).toString(36)).join('')

describe('src/main.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mocked(isDebug).mockReturnValue(true)
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
    test('calls core.setOutput("selected", chooseOne())', async () => {
      // Arrange
      mocked(getInputs).mockReturnValue([
        { content: 'foo', weight: 1 },
        { content: 'bar', weight: 2 },
        { content: 'baz', weight: 2 }
      ])
      const expected = randomString()
      mocked(chooseOne).mockReturnValue(expected)

      // Act
      run()

      // Assert
      expect(setOutput).toHaveBeenCalledWith('selected', expected)
      expect(setFailed).not.toBeCalled()
    })
  })
})
