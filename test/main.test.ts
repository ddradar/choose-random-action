import type { TestContext } from 'node:test'
import { before, beforeEach, mock, suite, test } from 'node:test'

import type { setFailed, setOutput } from '@actions/core'

import type { chooseOne } from '../src/choose.ts'
import type { getInputs } from '../src/input.ts'

const randomString = (): string =>
  [...Array<unknown>(12)]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join('')

await suite('src/main.ts', async () => {
  const setFailedMock = mock.fn<typeof setFailed>()
  const setOutputMock = mock.fn<typeof setOutput>()
  const chooseOneMock = mock.fn<typeof chooseOne>()
  const getInputsMock = mock.fn<typeof getInputs>()

  let run: typeof import('../src/main.ts').run

  before(async () => {
    mock.module('@actions/core', {
      namedExports: {
        info: mock.fn(),
        setFailed: setFailedMock,
        setOutput: setOutputMock,
      },
    })
    mock.module('../src/choose.ts', {
      namedExports: { chooseOne: chooseOneMock },
    })
    mock.module('../src/input.ts', {
      namedExports: { getInputs: getInputsMock },
    })

    run = (await import('../src/main.ts')).run
  })

  await suite('run()', async () => {
    beforeEach(() => {
      setFailedMock.mock.resetCalls()
      setOutputMock.mock.resetCalls()
      chooseOneMock.mock.resetCalls()
      getInputsMock.mock.resetCalls()
    })

    await test('calls core.setFailed() when getInputs() throws Error object', (t: TestContext) => {
      // Arrange
      const error = new Error(randomString())
      getInputsMock.mock.mockImplementation(() => {
        throw error
      })
      // Act
      run()
      // Assert
      t.assert.strictEqual(setOutputMock.mock.callCount(), 0)
      t.assert.strictEqual(setFailedMock.mock.callCount(), 1)
      t.assert.strictEqual(setFailedMock.mock.calls[0].arguments[0], error)
    })
    await test('calls core.setFailed() when getInputs() throws Error string', (t: TestContext) => {
      // Arrange
      const error = randomString()
      getInputsMock.mock.mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw error
      })
      // Act
      run()
      // Assert
      t.assert.strictEqual(setOutputMock.mock.callCount(), 0)
      t.assert.strictEqual(setFailedMock.mock.callCount(), 1)
      t.assert.strictEqual(setFailedMock.mock.calls[0].arguments[0], error)
    })

    await test('calls core.setOutput("selected", chooseOne())', (t: TestContext) => {
      // Arrange
      const expected = randomString()
      getInputsMock.mock.mockImplementation(() => [
        { content: 'foo', weight: 1 },
        { content: 'bar', weight: 2 },
        { content: 'baz', weight: 2 },
      ])
      chooseOneMock.mock.mockImplementation(() => expected)
      // Act
      run()
      // Assert
      t.assert.strictEqual(setOutputMock.mock.callCount(), 1)
      t.assert.deepEqual(setOutputMock.mock.calls[0].arguments, [
        'selected',
        expected,
      ])
      t.assert.strictEqual(setFailedMock.mock.callCount(), 0)
    })
  })
})
