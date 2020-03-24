# Choose Random Action

[![last commit](https://img.shields.io/github/last-commit/ddradar/choose-random-action "last commit")](https://github.com/ddradar/choose-random-action/commits/master)
[![release version](https://img.shields.io/github/v/release/ddradar/choose-random-action?sort=semver "release version")](https://github.com/ddradar/choose-random-action/releases)
[![CI/CD](https://github.com/ddradar/choose-random-action/workflows/CI/CD/badge.svg)](https://github.com/ddradar/choose-random-action/actions?query=workflow%3ACI%2FCD)
[![codecov](https://codecov.io/gh/ddradar/choose-random-action/branch/master/graph/badge.svg)](https://codecov.io/gh/ddradar/choose-random-action)
[![CodeFactor](https://www.codefactor.io/repository/github/ddradar/choose-random-action/badge)](https://www.codefactor.io/repository/github/ddradar/choose-random-action)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ddradar/choose-random-action)](https://dependabot.com)
[![License](https://img.shields.io/github/license/ddradar/choose-random-action)](LICENSE)

English guide is [here](./README.md).

ユーザーからの複数入力から、1つをランダムに選択します。

## TOC

- [使い方](#usage)
- [オプション](#options)
  - [contents](#contents)
  - [weights](#weights)
- [ライセンス](#license)
- [プロジェクトへの貢献](#contributing)

## Usage

[action.yml](./action.yml)をご覧ください。

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
