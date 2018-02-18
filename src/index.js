// @flow
import {
  type Program,
  type State,
  jSXAttribute,
  jSXIdentifier,
  isJSXIdentifier,
} from '@babel/types';

export default function transformProperties() {
  return {
    visitor: {
      Program(program: Program, state: State) {
        // On program start, do an explicit traversal up front for this plugin.
        const properties = state.opts;
        const duplicateKeys = Object.keys(properties);

        program.traverse({
          JSXAttribute(path) {
            const index = duplicateKeys.indexOf(path.node.name.name);
            if (index !== -1) {
              const key = duplicateKeys[index];
              const newProps = typeof properties[key] === 'string' ? [properties[key]] : properties[key];

              newProps.forEach((prop) => {
                const identifier = jSXIdentifier(prop);
                const attr = jSXAttribute(identifier, path.node.value);

                // if a property exists it gets replaced
                const parentIndex = path
                  .parent
                  .attributes
                  .findIndex(({ name }) => {
                    if (isJSXIdentifier(name)) {
                      return name.name === prop;
                    }
                    return false;
                  });

                if (parentIndex !== -1) {
                  // eslint-disable-next-line no-param-reassign
                  path.parent.attributes[parentIndex] = attr;
                } else {
                  path.parent.attributes.push(attr);
                }
              });
            }
          },
        });
      },
    },
  };
}
