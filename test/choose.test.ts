import type { TestContext } from 'node:test'
import { before, mock, suite, test } from 'node:test'

await suite('src/choose.ts', async () => {
  let chooseOne: typeof import('../src/choose.ts').chooseOne

  before(async () => {
    mock.module('@actions/core', { namedExports: { debug: mock.fn() } })

    chooseOne = (await import('../src/choose.ts')).chooseOne
  })

  await suite('chooseOne', async () => {
    const choices: Parameters<typeof chooseOne>[0] = [
      { content: 'foo', weight: 1 },
      { content: 'bar', weight: 2 },
      { content: 'baz', weight: 2 }
    ]

    const validTestData: [number, string][] = [
      [0.99, 'foo'],
      [0.8, 'foo'],
      [0.79, 'baz'],
      [0.4, 'baz'],
      [0.39, 'bar'],
      [0, 'bar']
    ]
    for (const [random, expected] of validTestData) {
      await test(`(choices, ${random}) returns ${expected}`, (t: TestContext) => {
        t.assert.strictEqual(chooseOne(choices, random), expected)
      })
    }

    const invalidTestData = [-1, 2, Infinity, -Infinity, NaN]
    for (const random of invalidTestData) {
      await test(`(choices, ${random}) throws error`, t =>
        t.assert.throws(() => chooseOne(choices, random), {
          message: 'random arg should be 0 <= random < 1.'
        }))
    }

    await test('([invalidChoices], any) throws error', t => {
      const invalidChoices: Parameters<typeof chooseOne>[0] = [
        { content: 'foo', weight: 0 },
        { content: 'bar', weight: 0 },
        { content: 'baz', weight: 0 }
      ]
      t.assert.throws(() => chooseOne(invalidChoices, 0.2), {
        message: 'invalid choices.weight'
      })
    })
  })
})
