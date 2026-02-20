import { randomUUID } from 'node:crypto'
import type { TestContext } from 'node:test'
import { before, beforeEach, mock, suite, test } from 'node:test'

import type { chooseOne } from '../src/choose.ts'
import type { setOutput } from '../src/gh-command.ts'
import type { getInputs } from '../src/input.ts'

await suite('src/main.ts', async () => {
  const chooseOneMock = mock.fn<typeof chooseOne>()
  const setOutputMock = mock.fn<typeof setOutput>()
  const getInputsMock = mock.fn<typeof getInputs>(() => [
    { content: 'foo', weight: 1 },
    { content: 'bar', weight: 2 },
    { content: 'baz', weight: 2 },
  ])

  let run: typeof import('../src/main.ts').run

  before(async () => {
    mock.module('../src/choose.ts', {
      namedExports: { chooseOne: chooseOneMock },
    })
    mock.module('../src/gh-command.ts', {
      namedExports: {
        error: mock.fn(),
        info: mock.fn(),
        setOutput: setOutputMock,
      },
    })
    mock.module('../src/input.ts', {
      namedExports: { getInputs: getInputsMock },
    })

    run = (await import('../src/main.ts')).run
  })
  beforeEach(() => (process.exitCode = 0))

  await suite('run()', async () => {
    beforeEach(() => {
      setOutputMock.mock.resetCalls()
      chooseOneMock.mock.resetCalls()
      getInputsMock.mock.resetCalls()
    })

    for (const error of [new Error('Error'), 'Error']) {
      await test(`exits with code 1 when getInputs() throws ${error}`, (t: TestContext) => {
        // Arrange
        getInputsMock.mock.mockImplementationOnce(() => {
          // oxlint-disable-next-line typescript/only-throw-error
          throw error
        })

        // Act
        run()

        // Assert
        t.assert.strictEqual(setOutputMock.mock.callCount(), 0)
        t.assert.strictEqual(process.exitCode, 1)
      })

      await test(`exits with code 1 when chooseOne() throws ${error}`, (t: TestContext) => {
        // Arrange
        chooseOneMock.mock.mockImplementationOnce(() => {
          // oxlint-disable-next-line typescript/only-throw-error
          throw error
        })

        // Act
        run()

        // Assert
        t.assert.strictEqual(setOutputMock.mock.callCount(), 0)
        t.assert.strictEqual(process.exitCode, 1)
      })
    }

    await test('calls setOutput("selected", chooseOne())', (t: TestContext) => {
      // Arrange
      const expected = randomUUID().toString()
      chooseOneMock.mock.mockImplementationOnce(() => expected)

      // Act
      run()

      // Assert
      t.assert.strictEqual(setOutputMock.mock.callCount(), 1)
      const args = ['selected', expected]
      t.assert.deepEqual(setOutputMock.mock.calls[0].arguments, args)
      t.assert.strictEqual(process.exitCode, 0)
    })
  })
})
