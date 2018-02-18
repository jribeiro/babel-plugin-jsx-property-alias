// @flow
export default function getPluginOptionsForDirectory(directory: string, filename: string = 'options.json') {
  try {
    return require(`${directory}/${filename}`); // eslint-disable-line
  } catch (e) {
    return {};
  }
}
