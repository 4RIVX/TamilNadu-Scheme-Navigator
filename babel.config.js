module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Kill `import.meta` in any package so the browser never chokes on it
      function killImportMeta({ types: t }) {
        return {
          visitor: {
            MetaProperty(path) {
              path.replaceWith(
                t.objectExpression([
                  t.objectProperty(t.identifier('url'), t.stringLiteral('')),
                  t.objectProperty(t.identifier('env'), t.objectExpression([])),
                ])
              );
            },
          },
        };
      },
    ],
  };
};