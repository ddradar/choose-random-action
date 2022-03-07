# Choose Random Action

[![last commit](https://img.shields.io/github/last-commit/ddradar/choose-random-action "last commit")](https://github.com/ddradar/choose-random-action/commits/main)
[![release version](https://img.shields.io/github/v/release/ddradar/choose-random-action?sort=semver "release version")](https://github.com/ddradar/choose-random-action/releases)
[![Node.js CI](https://github.com/ddradar/choose-random-action/actions/workflows/node.yml/badge.svg)](https://github.com/ddradar/choose-random-action/actions/workflows/node.yml)
[![codecov](https://codecov.io/gh/ddradar/choose-random-action/branch/main/graph/badge.svg?token=VfAjX7k1B4)](https://codecov.io/gh/ddradar/choose-random-action)
[![CodeFactor](https://www.codefactor.io/repository/github/ddradar/choose-random-action/badge)](https://www.codefactor.io/repository/github/ddradar/choose-random-action)
[![License](https://img.shields.io/github/license/ddradar/choose-random-action)](LICENSE)

English guide is [here](./README.md).

ユーザーからの複数入力から、1つをランダムに選択します。

## TOC

- [使い方](#usage)
  - [基本](#basic)
  - [Post LGTM Imageと使う](#use-with-post-lgtm-image)
- [オプション](#options)
  - [contents](#contents)
  - [weights](#weights)
- [ライセンス](#license)
- [プロジェクトへの貢献](#contributing)

## Usage

[action.yml](./action.yml)をご覧ください。

### Basic

```yaml
steps:
  - uses: ddradar/choose-random-action@v1
    id: act # output を参照するために必須
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
    if: (!contains(github.actor, '[bot]')) # botのコメントを除く
    steps:
      - uses: ddradar/choose-random-action@v1
        id: act
        with:
          contents: |
            https://example.com/your-lgtm-image-1.jpg
            https://example.com/your-lgtm-image-2.jpg
            https://example.com/your-lgtm-image-3.jpg
      - uses: ddradar/lgtm-action@v1
        with:
          image-url: ${{ steps.act.outputs.selected }}
```

## Options

### contents

*必須です。*

ランダムに選択したい文字列を指定します。

### weights

*オプション。*

選択肢に重み付けをしたい場合に指定します。
`contents`と同じ要素数にしてください。
未指定の場合は、すべての要素が同じ重み付けとなります。

## License

[MIT ライセンス](LICENSE)

## Contributing

[ガイド](CONTRIBUTING-ja.md)をご覧ください。
