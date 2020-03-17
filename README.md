# Choose Random Action

[![last commit](https://img.shields.io/github/last-commit/ddradar/choose-random-action "last commit")](https://github.com/ddradar/choose-random-action/commits/master)
[![release version](https://img.shields.io/github/v/release/ddradar/choose-random-action?sort=semver "release version")](https://github.com/ddradar/choose-random-action/releases)
[![CI/CD](https://github.com/ddradar/choose-random-action/workflows/CI/CD/badge.svg)](https://github.com/ddradar/choose-random-action/actions?query=workflow%3ACI%2FCD)
[![codecov](https://codecov.io/gh/ddradar/choose-random-action/branch/master/graph/badge.svg)](https://codecov.io/gh/ddradar/choose-random-action)
[![CodeFactor](https://www.codefactor.io/repository/github/ddradar/choose-random-action/badge)](https://www.codefactor.io/repository/github/ddradar/choose-random-action)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ddradar/choose-random-action)](https://dependabot.com)
[![License](https://img.shields.io/github/license/ddradar/choose-random-action)](LICENSE)

Choose one randomly from multiple user inputs

## TOC

- [Usage](#usage)
- [Options](#options)
  - [contents](#contents)
  - [weights](#weights)
- [License](#license)
- [Contributing](#contributing)

## Usage

See [action.yml](./action.yml)

```yaml
steps:
  - uses: ddradar/choose-random-action@v1
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

## Options

### contents

*Required.*

String choices you want to choose randomly.

### weights

*Optional.*

Set natural integer if you want to weight the choices.
Make it the same length as the contents.
By default, all content has equal weight.

## License

[MIT License](LICENSE)

## Contributing

See [guide](./CONTRIBUTING.md).
