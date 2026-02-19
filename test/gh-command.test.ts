import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { EOL, tmpdir } from 'node:os'
import { join } from 'node:path'
import type { TestContext } from 'node:test'
import { afterEach, before, beforeEach, mock, suite, test } from 'node:test'

import {
  debug,
  error,
  getMultilineInput,
  info,
  setOutput,
} from '../src/gh-command.ts'

await suite('src/gh-command.ts', async () => {
  const originalEnv: NodeJS.ProcessEnv = { ...process.env }
  const stdoutMock = mock.method(process.stdout, 'write', () => true)

  beforeEach(() => stdoutMock.mock.resetCalls())
  afterEach(() => (process.env = { ...originalEnv }))

  await suite('logging', async () => {
    const stdoutMock = mock.method(process.stdout, 'write', () => true)
    beforeEach(() => stdoutMock.mock.resetCalls())

    await test('debug("message") writes "::debug::message" to stdout', (t: TestContext) => {
      // Arrange - Act
      debug('debug message')

      // Assert
      t.assert.strictEqual(stdoutMock.mock.calls.length, 1)
      t.assert.strictEqual(
        stdoutMock.mock.calls[0].arguments[0],
        `::debug::debug message${EOL}`
      )
    })

    await test('info("message") writes "::info::message" to stdout', (t: TestContext) => {
      // Arrange - Act
      info('info message')

      // Assert
      t.assert.strictEqual(stdoutMock.mock.calls.length, 1)
      t.assert.strictEqual(
        stdoutMock.mock.calls[0].arguments[0],
        `::info::info message${EOL}`
      )
    })

    await test('error("message") writes "::error::message" to stdout', (t: TestContext) => {
      // Arrange - Act
      error('error message')

      // Assert
      t.assert.strictEqual(stdoutMock.mock.calls.length, 1)
      t.assert.strictEqual(
        stdoutMock.mock.calls[0].arguments[0],
        `::error::error message${EOL}`
      )
    })
  })

  await suite('setOutput()', async () => {
    let tmpDir: string
    before(() => {
      tmpDir = mkdtempSync(join(tmpdir(), 'gh-command-test-'))
    })

    await test('throws if GITHUB_OUTPUT is not set', (t: TestContext) => {
      // Arrange
      delete process.env['GITHUB_OUTPUT']

      // Act - Assert
      t.assert.throws(() => setOutput('key', 'value'), {
        message:
          'GITHUB_OUTPUT environment variable is not set or file does not exist.',
      })
    })

    await test('throws if GITHUB_OUTPUT file does not exist', (t: TestContext) => {
      // Arrange
      process.env['GITHUB_OUTPUT'] = join(tmpDir, 'nonexistent.txt')

      // Act - Assert
      t.assert.throws(() => setOutput('key', 'value'), {
        message:
          'GITHUB_OUTPUT environment variable is not set or file does not exist.',
      })
    })

    await test('appends "key=value[EOL]" to the file', (t: TestContext) => {
      // Arrange
      const filePath = join(tmpDir, 'output.txt')
      writeFileSync(filePath, '')
      process.env['GITHUB_OUTPUT'] = filePath

      // Act
      setOutput('my-key', 'my-value')

      // Assert
      const content = readFileSync(filePath, 'utf8')
      t.assert.strictEqual(content, `my-key=my-value${EOL}`)
    })
  })

  await suite('getMultilineInput()', async () => {
    await test('returns empty array if env var is not set', (t: TestContext) => {
      // Arrange
      delete process.env['INPUT_TEST']

      // Act
      const result = getMultilineInput('test')

      // Assert
      t.assert.deepEqual(result, [])
    })

    await test('trims whitespace and filters empty lines', (t: TestContext) => {
      // Arrange
      process.env['INPUT_TEST'] = '  foo  \n  bar  \n\nbaz'

      // Act
      const result = getMultilineInput('test')

      // Assert
      t.assert.deepEqual(result, ['foo', 'bar', 'baz'])
    })

    await test('converts spaces in name to underscores', (t: TestContext) => {
      // Arrange
      process.env['INPUT_MY_INPUT'] = 'value'

      // Act
      const result = getMultilineInput('my input')

      // Assert
      t.assert.deepEqual(result, ['value'])
    })

    await test('throws if required and value is empty', (t: TestContext) => {
      // Arrange
      delete process.env['INPUT_TEST']

      // Act - Assert
      t.assert.throws(() => getMultilineInput('test', true), {
        message: 'test is required.',
      })
    })

    await test('returns values if required and value is provided', (t: TestContext) => {
      // Arrange
      process.env['INPUT_TEST'] = 'foo\nbar'

      // Act
      const result = getMultilineInput('test', true)

      // Assert
      t.assert.deepEqual(result, ['foo', 'bar'])
    })
  })
})
