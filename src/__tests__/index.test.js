// @flow
import { readdirSync } from 'fs';
import { join } from 'path';
import { transformFileSync } from 'babel-core';

import getPluginOptionsForDirectory from './getPluginOptionsForDirectory';
import plugin from '../';

describe('fixtures', () => {
  const fixturesDir = join(__dirname, 'fixtures');
  readdirSync(fixturesDir).forEach((caseName) => {
    it(`should work with ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = join(fixturesDir, caseName);
      const pluginOptions = getPluginOptionsForDirectory(fixtureDir);

      // Only run plugins targeting the production env.
      // process.env.BABEL_ENV = 'production';
      const actual = transformFileSync(join(fixtureDir, 'actual.js'), {
        babelrc: false,
        plugins: [
          [plugin, pluginOptions],
          '@babel/plugin-syntax-jsx',
        ],
      }).code;

      expect(actual).toMatchSnapshot();
    });
  });
});
