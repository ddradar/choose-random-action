import { setFailed, setOutput } from '@actions/core'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { chooseOne } from '../src/choose.js'
import { getInputs } from '../src/input.js'
import { run } from '../src/main.js'

vi.mock('@actions/core')
vi.mock('../src/choose')
vi.mock('../src/input')

const randomString = (): string =>
  [...Array<unknown>(12)]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join('')

describe('src/main.ts', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('run()', () => {
    test.each([new Error(randomString()), randomString()])(
      'calls core.setFailed() if an error occurs',
      error => {
        // Arrange
        vi.mocked(getInputs).mockImplementation(() => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw error
        })

        // Act
        run()

        // Assert
        expect(setOutput).not.toBeCalled()
        expect(setFailed).toBeCalledWith(error)
      }
    )
    test('calls core.setOutput("selected", chooseOne())', () => {
      // Arrange
      vi.mocked(getInputs).mockReturnValue([
        { content: 'foo', weight: 1 },
        { content: 'bar', weight: 2 },
        { content: 'baz', weight: 2 }
      ])
      const expected = randomString()
      vi.mocked(chooseOne).mockReturnValue(expected)

      // Act
      run()

      // Assert
      expect(setOutput).toHaveBeenCalledWith('selected', expected)
      expect(setFailed).not.toBeCalled()
    })
  })
})
