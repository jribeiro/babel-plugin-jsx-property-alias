# babel-plugin-jsx-property-alias

> Babel plugin for making React property aliases.

[![npm version](https://img.shields.io/npm/v/babel-plugin-jsx-property-alias.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-jsx-property-alias)
[![Coverage](https://codecov.io/gh/jribeiro/babel-plugin-jsx-property-alias/branch/master/graph/badge.svg)](https://codecov.io/gh/jribeiro/babel-plugin-jsx-property-alias)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-jsx-property-alias.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-jsx-property-alias)
[![Build Status](https://travis-ci.org/jribeiro/babel-plugin-jsx-property-alias.svg?branch=master)](https://travis-ci.org/jribeiro/babel-plugin-jsx-property-alias)

[![Dependencies](https://img.shields.io/david/jribeiro/babel-plugin-jsx-property-alias.svg?style=flat-square)](https://david-dm.org/jribeiro/babel-plugin-jsx-property-alias)
[![DevDependencies](https://img.shields.io/david/dev/jribeiro/babel-plugin-jsx-property-alias.svg?style=flat-square)](https://david-dm.org/jribeiro/babel-plugin-jsx-property-alias#info=devDependencies&view=list)

> The babel options for this plugin have changed for version 2. If you're using version 1 of this plugin, please see the [instructions for v1](https://github.com/jribeiro/babel-plugin-jsx-property-alias/tree/v1.0.3) or upgrade following the instructions bellow.

## Why

This plugin was created as a workaround for the issue with `appium` not finding `testID` properties in React Native ecosystem: [testID information not visible on UIAutomator in Appium](https://github.com/facebook/react-native/issues/7135) and [[e2e-testing][Appium] Adding support for android:id](https://github.com/facebook/react-native/pull/9942).

The underlying idea is that using `accessibilityLabel` is a human-readable label intended to be read out to blind users. Abusing it as a view id on views that should not be read to blind users is a very bad practice.

As such, this plugin allows you to set `testID` properties in your code and, on a `qa` environment the `testID` properties will be duplicated into `accessibilityLabel` or whatever else you require.

If an `accessibilityLabel` property has been previously defined, it will be replaced by the `testID` value. This is ok if the build is specific for appium.

Despite the above, this plugin is not specific to react native. You can use it to alias any property while using `jsx`. See [usage section](#usage) for more details.

## Installation

```sh
yarn add -D babel-plugin-jsx-property-alias
```

## Usage

First set the `BABEL_ENV` to `QA` on your scripts:

```json
{
  "scripts": {
    "appium": "BABEL_ENV=appium appium ..."
  }
}
```

Then change your babel configuration to include this plugin when the `BABEL_ENV` equals `QA` (or whatever you've set the `BABEL_ENV` to be).

Create `accessibilityLabel` alias from `testID` property

```json
{
  "env": {
    "QA": {
      "plugins": [
        ["jsx-property-alias", {
          "properties": {
            "testID": "accessibilityLabel"
          }
        }]
      ]
    }
  }
}
```

Create `accessibilityLabel` alias from `testID` property and `bar` alias from `foo` property.

```json
{
  "env": {
    "QA": {
      "plugins": [
        ["jsx-property-alias", {
          "properties": {
            "testID": "accessibilityLabel",
            "foo": "bar"
          }
        }]
      ]
    }
  }
}
```

### React Native

As of the time of writing, if you're using React Native, there's an additional issue where neither `BABEL_ENV` nor `NODE_ENV` can be used to specify different plugins for different `babel` environments. You can read about this issue [here](https://github.com/facebook/react-native/issues/8723).

To address this issue this plugin, **from version 2**, allows you to whitelist a set of environments through the `includeInEnvironments` option. When this option is set, the plugin will only run when the value of `ALIAS_ENVIRONMENT` is whitelisted.

```json
{
  "presets": [
    "react-native"
  ],
  "plugins": [
    ["jsx-property-alias", {
      "includeInEnvironments": ["QA"],
      "properties": {
        "testID": "accessibilityLabel"
      }
    }]
  ]
}
```

You can now run the app like:

```bash
ALIAS_ENVIRONMENT=QA react-native start [--reset-cache]
```

Or if you want to bundle the JS:

```bash
ALIAS_ENVIRONMENT=QA react-native bundle [--reset-cache] # other options...
```

> **A note about caching.** React Native Bundler will cache the bundle and try to avoid re-compilation unless the code changes. Make sure that you clean up your cache while running the app in different modes.

#### Complex project structures

Alternatively, you can abuse the projectRoots option of React Native CLI to address this. This option is suited for more complex project structures like monorepos.

Create a `.babelrc` file in a subfolder:

* `babel-conf/.babelrc`

```json
{
  "presets": [
    "react-native"
  ],
  "plugins": [
    ["jsx-property-alias", {
      "properties": {
        "testID": "accessibilityLabel"
      }
    }]
  ]
}
```

Then you can launch your app as

```bash
yarn react-native start --projectRoots $PWD/babel-conf/,$PWD
```

## Example

> You can find additional examples under [`src/__tests__/fixtures/`](./src/__tests__/fixtures/)

### In

```js
class Foo extends React.Component {
  render() {
    return (
      <div className="bar" testID="thisIsASelectorForAppium">
        Hello Wold!
      </div>
    );
  }
}
```

### Out

```js
class Foo extends React.Component {
  render() {
    return (
      <div className="bar" testID="thisIsASelectorForAppium" accessibilityLabel="thisIsASelectorForAppium">
        Hello Wold!
      </div>
    );
  }
}
```

## License

MIT
