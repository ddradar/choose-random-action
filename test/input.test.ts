import type { TestContext } from 'node:test'
import { afterEach, before, suite, test } from 'node:test'

import { getInputs } from '../src/input.ts'

await suite('src/input.ts', async () => {
  /** Saved original environment variables */
  let originalEnv: NodeJS.ProcessEnv

  before(() => (originalEnv = { ...process.env }))
  afterEach(() => (process.env = originalEnv))

  await suite('getInputs()', async () => {
    const INPUT_CONTENTS = ['foo', 'bar', 'baz'].join('\n')
    const INPUT_WEIGHTS = ['1', '2', '3'].join('\n')

    const invalidContents = ['', ' ']
    for (const INPUT_CONTENTS of invalidContents) {
      await test(`throws error if contents is "${INPUT_CONTENTS}"`, (t: TestContext) => {
        // Arrange
        process.env = { ...originalEnv, INPUT_CONTENTS }

        // Act - Assert
        t.assert.throws(() => getInputs(), { message: 'contents is required.' })
      })
    }

    await test('returns { content: contents[i], weight: 1 } if weight is empty', (t: TestContext) => {
      // Arrange
      process.env = { ...originalEnv, INPUT_CONTENTS, INPUT_WEIGHTS: undefined }

      // Act
      const choices = getInputs()

      // Assert
      t.assert.deepEqual(choices, [
        { content: 'foo', weight: 1 },
        { content: 'bar', weight: 1 },
        { content: 'baz', weight: 1 },
      ])
    })

    const invalidWeights = ['foo', '-1', 'NaN']
    for (const weight of invalidWeights) {
      await test(`throws error if weight is "${weight}"`, (t: TestContext) => {
        // Arrange
        const INPUT_WEIGHTS = [weight, weight, weight].join('\n')
        process.env = { ...originalEnv, INPUT_CONTENTS, INPUT_WEIGHTS }

        // Act - Assert
        t.assert.throws(() => getInputs(), {
          message: 'weights should be natural number.',
        })
      })
    }

    await test('throws error if contents.length !== weights.length', (t: TestContext) => {
      // Arrange
      const INPUT_WEIGHTS = ['1', '2'].join('\n')
      process.env = { ...originalEnv, INPUT_CONTENTS, INPUT_WEIGHTS }

      // Act - Assert
      t.assert.throws(() => getInputs(), {
        message:
          'Parameters should be the same length. (contents: 3 weights: 2)',
      })
    })

    await test('returns { content: contents[i], weight: weight[i] } if contents.length === weights.length', (t: TestContext) => {
      // Arrange
      process.env = {
        ...originalEnv,
        INPUT_CONTENTS: INPUT_CONTENTS,
        INPUT_WEIGHTS: INPUT_WEIGHTS,
      }

      // Act
      const choices = getInputs()

      // Assert
      t.assert.strictEqual(choices.length, 3)
      t.assert.deepEqual(choices, [
        { content: 'foo', weight: 1 },
        { content: 'bar', weight: 2 },
        { content: 'baz', weight: 3 },
      ])
    })
  })
})
