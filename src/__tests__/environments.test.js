// @flow
import { transform } from 'babel-core';

import plugin from '..';

const code = `
React.createClass({
  render: function () {
    return <div className="bar" testID="appiumSelector">
    Hello Wold!
    </div>;
  }
});
`;

describe('environment', () => {
  it('should be a noop when no environment is set', () => {
    const pluginOptions = {
      includeInEnvironments: ['QA'],
      properties: {
        testID: ['accessibilityLabel', 'accessibilityContent'],
        foo: 'bar',
      },
    };

    // Only run plugins targeting the production env.
    // process.env.BABEL_ENV = 'production';
    const actual = transform(code, {
      babelrc: false,
      plugins: [
        [plugin, pluginOptions],
        '@babel/plugin-syntax-jsx',
      ],
    }).code;

    expect(actual).toMatchSnapshot();
  });

  it('should alias testId prop when ALIAS_ENVIRONMENT=QA', () => {
    const pluginOptions = {
      includeInEnvironments: ['QA'],
      properties: {
        testID: ['accessibilityLabel', 'accessibilityContent'],
        foo: 'bar',
      },
    };
    // set environment

    process.env.ALIAS_ENVIRONMENT = 'QA';
    const actual = transform(code, {
      babelrc: false,
      plugins: [
        [plugin, pluginOptions],
        '@babel/plugin-syntax-jsx',
      ],
    }).code;

    expect(actual).toMatchSnapshot();
  });
});
