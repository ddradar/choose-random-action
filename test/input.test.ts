import type { TestContext } from 'node:test'
import { before, mock, suite, test } from 'node:test'

import type { getMultilineInput } from '../src/gh-command.ts'

await suite('src/input.ts', async () => {
  const getMultilineInputMock = mock.fn<typeof getMultilineInput>()
  let getInputs: typeof import('../src/input.ts').getInputs

  before(async () => {
    mock.module('../src/gh-command.ts', {
      namedExports: { getMultilineInput: getMultilineInputMock },
    })

    getInputs = (await import('../src/input.ts')).getInputs
  })

  await suite('getInputs()', async () => {
    const contents = ['foo', 'bar', 'baz']
    const weights = ['1', '2', '3']

    await test('throws error if contents is empty', (t: TestContext) => {
      // Arrange
      getMultilineInputMock.mock.mockImplementation(() => [])

      // Act - Assert
      t.assert.throws(() => getInputs(), { message: 'contents is required.' })
    })

    await test('returns { content: contents[i], weight: 1 } if weight is empty', (t: TestContext) => {
      // Arrange
      getMultilineInputMock.mock.mockImplementation(name =>
        name === 'contents' ? contents : []
      )

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
        getMultilineInputMock.mock.mockImplementation(name =>
          name === 'weights' ? [weight, weight, weight] : contents
        )
        // Act - Assert
        t.assert.throws(() => getInputs(), {
          message: 'weights should be natural number.',
        })
      })
    }

    await test('throws error if contents.length !== weights.length', (t: TestContext) => {
      // Arrange
      getMultilineInputMock.mock.mockImplementation(name =>
        name === 'weights' ? ['1', '2'] : contents
      )

      // Act - Assert
      t.assert.throws(() => getInputs(), {
        message:
          'Parameters should be the same length. (contents: 3 weights: 2)',
      })
    })

    await test('returns { content: contents[i], weight: weight[i] } if contents.length === weights.length', (t: TestContext) => {
      // Arrange
      getMultilineInputMock.mock.mockImplementation(name =>
        name === 'contents' ? contents : weights
      )
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
