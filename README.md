# Choose Random Action

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
