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

describe('src/main.ts', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('run()', () => {
    test.each([new Error(randomString()), randomString()])(
      'calls core.setFailed() if an error occurs',
      error => {
        // Arrange
        mocked(getInputs).mockImplementation(() => {
          throw error
        })

        // Act
        run()

        // Assert
        expect(setOutput).not.toBeCalled()
        expect(setFailed).toBeCalledWith(error)
      }
    )
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
