# Choose Random Action

[![last commit](https://img.shields.io/github/last-commit/ddradar/choose-random-action 'last commit')](https://github.com/ddradar/choose-random-action/commits/main)
[![release version](https://img.shields.io/github/v/release/ddradar/choose-random-action?sort=semver 'release version')](https://github.com/ddradar/choose-random-action/releases)
[![Node.js CI/CD](https://github.com/ddradar/choose-random-action/actions/workflows/node.yml/badge.svg)](https://github.com/ddradar/choose-random-action/actions/workflows/node.yml)
[![codecov](https://codecov.io/gh/ddradar/choose-random-action/branch/main/graph/badge.svg?token=VfAjX7k1B4)](https://codecov.io/gh/ddradar/choose-random-action)
[![CodeFactor](https://www.codefactor.io/repository/github/ddradar/choose-random-action/badge)](https://www.codefactor.io/repository/github/ddradar/choose-random-action)
[![License](https://img.shields.io/github/license/ddradar/choose-random-action)](LICENSE)

日本語版のガイドは[こちら](./README-ja.md)です。

Choose one randomly from multiple user inputs

## TOC

- [Usage](#usage)
  - [Basic](#basic)
  - [Use with Post LGTM Image](#use-with-post-lgtm-image)
- [Options](#options)
  - [contents](#contents)
  - [weights](#weights)
- [License](#license)
- [Contributing](#contributing)

## Usage

### Basic

```yaml
steps:
  - uses: ddradar/choose-random-action@v3.0.0
    id: act # required to reference output
    with:
      contents: |
        foo
        bar
        baz
      weights: |
        2
        3
        5
  - name: Echo outputs
    run: echo ${{ steps.act.outputs.selected }} # foo: 20%, bar: 30%, baz: 50%
```

### Use with [Post LGTM Image](https://github.com/ddradar/lgtm-action)

```yaml
name: Send LGTM Image
on:
  issue_comment:
    types: [created]
  pull_request_review:
    types: [submitted]
jobs:
  post:
    runs-on: ubuntu-latest
    if: (!contains(github.actor, '[bot]')) # Exclude bot comment
    steps:
      - uses: ddradar/choose-random-action@v3.0.0
        id: act
        with:
          contents: |
            https://example.com/your-lgtm-image-1.jpg
            https://example.com/your-lgtm-image-2.jpg
            https://example.com/your-lgtm-image-3.jpg
      - uses: ddradar/lgtm-action@v3
        with:
          image-url: ${{ steps.act.outputs.selected }}
```

## Options

### contents

_Required._

String choices you want to choose randomly.

### weights

_Optional._

Set natural integer if you want to weight the choices.
Make it the same length as the contents.
By default, all content has equal weight.

## License

[MIT License](LICENSE)

## Contributing

See [guide](./CONTRIBUTING.md).
