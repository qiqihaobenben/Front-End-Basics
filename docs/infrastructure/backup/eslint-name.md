# ESLint 之解析包名

ESLint 配置文件中 extends 的写法多种多样，那么 ESLint 是怎么根据不同的写法找到正确的包呢？

### extends 分类

假设有这样一个 .eslintrc.js

```js
module.exports = {
  extends: [
    'eslint:recommended',
    'eslint-config-react',
    'react',
    './ireneRule.js',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-plugin/recommended',
    'plugin:@typescript-eslint/test/recommended', // 为了测试，杜撰的一个包
    'plugin:@typescript-eslint/eslint-plugin-irene/recommended', // 为了测试，杜撰的一个包
    'plugin:prettier/recommended',
  ],
}
```

extends 中有三类写法：

##### 以 `eslint:` 开头，加载 ESLint 内置规则

- 如果是 `eslint:recommended`，加载 ESLint 推荐的规则；
- 如果是 `eslint:all`，加载 ESLint 所有的规则；

##### 以 `plugin:` 开头

- 首先分离出 pluginName，它就是 `plugin:` 和最后一个 `/` 的之间部分；有如下几种情况：

  - `plugin:@typescript-eslint/recommended` 的 pluginName 是 `@typescript-eslint`；
  - `plugin:@typescript-eslint/eslint-plugin/recommended` 的 pluginName 是 `@typescript-eslint/eslint-plugin`；
  - `plugin:@typescript-eslint/test/recommended` 的 pluginName 是 `@typescript-eslint/test`；
  - `plugin:@typescript-eslint/eslint-plugin-irene/recommended` 的 pluginName 是 `@typescript-eslint/eslint-plugin-irene`；
  - `plugin:prettier/recommended` 的 pluginName 是 `prettier`；

- 然后根据 pluginName 得到标准化的包名；

  - 如果 pluginName 以 @ 开头，说明使用的是 scoped modules；有如下几种情况：
    - pluginName 是 @scopeName 或 @scopeName/eslint-plugin，对应的包名是 @scopeName/eslint-plugin；
      - `@typescript-eslint` 对应的是 `@typescript-eslint/eslint-plugin`；
      - `@typescript-eslint/eslint-plugin` 对应的是 `@typescript-eslint/eslint-plugin`；
    - pluginName 是 @scopeName/xxx，且 xxx 不以 eslint-plugin 开头，对应的包名是 @scopeName/eslint-plugin-xxx；
      - `@typescript-eslint/test` 对应的是 `@typescript-eslint/eslint-plugin-test`；
    - pluginName 是 @scopeName/eslint-plugin-xxx，对应的包名是 @scopeName/eslint-plugin-xxx；
      - `@typescript-eslint/eslint-plugin-irene` 对应的是 `@typescript-eslint/eslint-plugin-irene`；
  - 如果 pluginName 不以 `eslint-plugin-` 开头，对应的包名是 eslint-plugin-xxx；例如：prettier 对应的是 `eslint-plugin-prettier`；

##### 其他

- 一个本地路径，指向本地的 ESLint 配置，例如：`./ireneRule.js`；
- 以 . 开头，这是为了兼容之前的版本，不过多解释；
- 根据 extendName 得到标准化的包名，这一步与 plugin 相同；
  - 如果 extendName 以 @ 开头，说明使用的是 scoped modules；有如下几种情况：
    - extendName 是 @scopeName 或 @scopeName/eslint-config，对应的包名是 @scopeName/eslint-config；
    - extendName 是 @scopeName/xxx，且 xxx 不以 eslint-config 开头，对应的包名是 @scopeName/eslint-config-xxx；
    - extendName 是 @scopeName/eslint-config-xxx，对应的包名是 @scopeName/eslint-config-xxx；
  - 如果 extendName 不以 `eslint-config-` 开头，对应的包名是 eslint-config-xxx；例如：react 对应的是 `eslint-config-react`；

### ESLint 源码

解析 extends 得到包名主要涉及的源码如下：

eslint/lib/cli-engine/config-array-factory.js

```js
/**
 * Load configs of an element in `extends`.
 * @param {string} extendName The name of a base config.
 * @param {ConfigArrayFactoryLoadingContext} ctx The loading context.
 * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
 * @private
 */
_loadExtends(extendName, ctx) {
  debug("Loading {extends:%j} relative to %s", extendName, ctx.filePath);
  // console.log(extendName, ctx)
  try {
      if (extendName.startsWith("eslint:")) {
          return this._loadExtendedBuiltInConfig(extendName, ctx);
      }
      if (extendName.startsWith("plugin:")) {
          return this._loadExtendedPluginConfig(extendName, ctx);
      }
      return this._loadExtendedShareableConfig(extendName, ctx);
  } catch (error) {
      error.message += `\nReferenced from: ${ctx.filePath || ctx.name}`;
      throw error;
  }
}

/**
 * Load configs of an element in `extends`.
 * @param {string} extendName The name of a base config.
 * @param {ConfigArrayFactoryLoadingContext} ctx The loading context.
 * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
 * @private
 */
_loadExtendedBuiltInConfig(extendName, ctx) {
    if (extendName === "eslint:recommended") {
        return this._loadConfigData({
            ...ctx,
            filePath: eslintRecommendedPath,
            name: `${ctx.name} » ${extendName}`
        });
    }
    if (extendName === "eslint:all") {
        return this._loadConfigData({
            ...ctx,
            filePath: eslintAllPath,
            name: `${ctx.name} » ${extendName}`
        });
    }

    throw configMissingError(extendName, ctx.name);
}

/**
 * Load configs of an element in `extends`.
 * @param {string} extendName The name of a base config.
 * @param {ConfigArrayFactoryLoadingContext} ctx The loading context.
 * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
 * @private
 */
_loadExtendedPluginConfig(extendName, ctx) {
    const slashIndex = extendName.lastIndexOf("/");
    const pluginName = extendName.slice("plugin:".length, slashIndex);
    const configName = extendName.slice(slashIndex + 1);

    if (isFilePath(pluginName)) {
        throw new Error("'extends' cannot use a file path for plugins.");
    }

    const plugin = this._loadPlugin(pluginName, ctx);
    const configData =
        plugin.definition &&
        plugin.definition.configs[configName];

    if (configData) {
        return this._normalizeConfigData(configData, {
            ...ctx,
            filePath: plugin.filePath || ctx.filePath,
            name: `${ctx.name} » plugin:${plugin.id}/${configName}`
        });
    }

    throw plugin.error || configMissingError(extendName, ctx.filePath);
}

/**
 * Load configs of an element in `extends`.
 * @param {string} extendName The name of a base config.
 * @param {ConfigArrayFactoryLoadingContext} ctx The loading context.
 * @returns {IterableIterator<ConfigArrayElement>} The normalized config.
 * @private
 */
_loadExtendedShareableConfig(extendName, ctx) {
    const { cwd } = internalSlotsMap.get(this);
    const relativeTo = ctx.filePath || path.join(cwd, "__placeholder__.js");
    let request;

    if (isFilePath(extendName)) {
        request = extendName;
    } else if (extendName.startsWith(".")) {
        request = `./${extendName}`; // For backward compatibility. A ton of tests depended on this behavior.
    } else {
        request = naming.normalizePackageName(
            extendName,
            "eslint-config"
        );
    }

    let filePath;

    try {
        filePath = ModuleResolver.resolve(request, relativeTo);
    } catch (error) {
        /* istanbul ignore else */
        if (error && error.code === "MODULE_NOT_FOUND") {
            throw configMissingError(extendName, ctx.filePath);
        }
        throw error;
    }

    writeDebugLogForLoading(request, relativeTo, filePath);
    return this._loadConfigData({
        ...ctx,
        filePath,
        name: `${ctx.name} » ${request}`
    });
}

/**
 * Load a given plugin.
 * @param {string} name The plugin name to load.
 * @param {ConfigArrayFactoryLoadingContext} ctx The loading context.
 * @returns {DependentPlugin} The loaded plugin.
 * @private
 */
_loadPlugin(name, ctx) {
  debug("Loading plugin %j from %s", name, ctx.filePath);

  const { additionalPluginPool } = internalSlotsMap.get(this);
  const request = naming.normalizePackageName(name, "eslint-plugin");
  // console.log(name, request)
  const id = naming.getShorthandName(request, "eslint-plugin");
  const relativeTo = path.join(ctx.pluginBasePath, "__placeholder__.js");

  if (name.match(/\s+/u)) {
      const error = Object.assign(
          new Error(`Whitespace found in plugin name '${name}'`),
          {
              messageTemplate: "whitespace-found",
              messageData: { pluginName: request }
          }
      );

      return new ConfigDependency({
          error,
          id,
          importerName: ctx.name,
          importerPath: ctx.filePath
      });
  }

  // Check for additional pool.
  const plugin =
      additionalPluginPool.get(request) ||
      additionalPluginPool.get(id);

  if (plugin) {
      return new ConfigDependency({
          definition: normalizePlugin(plugin),
          filePath: "", // It's unknown where the plugin came from.
          id,
          importerName: ctx.name,
          importerPath: ctx.filePath
      });
  }

  let filePath;
  let error;

  try {
      filePath = ModuleResolver.resolve(request, relativeTo);
  } catch (resolveError) {
      error = resolveError;
      /* istanbul ignore else */
      if (error && error.code === "MODULE_NOT_FOUND") {
          error.messageTemplate = "plugin-missing";
          error.messageData = {
              pluginName: request,
              resolvePluginsRelativeTo: ctx.pluginBasePath,
              importerName: ctx.name
          };
      }
  }

  if (filePath) {
      try {
          writeDebugLogForLoading(request, relativeTo, filePath);

          const startTime = Date.now();
          const pluginDefinition = require(filePath);

          debug(`Plugin ${filePath} loaded in: ${Date.now() - startTime}ms`);

          return new ConfigDependency({
              definition: normalizePlugin(pluginDefinition),
              filePath,
              id,
              importerName: ctx.name,
              importerPath: ctx.filePath
          });
      } catch (loadError) {
          error = loadError;
      }
  }

  debug("Failed to load plugin '%s' declared in '%s'.", name, ctx.name);
  error.message = `Failed to load plugin '${name}' declared in '${ctx.name}': ${error.message}`;
  return new ConfigDependency({
      error,
      id,
      importerName: ctx.name,
      importerPath: ctx.filePath
  });
}

```

### 如何 debug ESLint？

- 在 node_modules 中的 ESLint 源码打上断点；

- 项目根目录下运行如下命令，其中 `-c .eslintrc.js` 指定 ESLint 配置文件，`./src/storage/testEslint.ts` 是待校验的文件；

```shell
node --inspect-brk ./node_modules/.bin/./eslint -c .eslintrc.js ./src/storage/testEslint.ts
```

- 打开 chrome://inspect/#devices，点击 `inspect`；

  ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f65f78b6b3f34cda91dbd9d9cae65465~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- 然后就可在 Chrome 或 VSCode 中调试 ESLint 源码；

### 参考

英文：[shareable-configs](https://link.juejin.cn?target=https%3A%2F%2Feslint.org%2Fdocs%2Fdeveloper-guide%2Fshareable-configs 'https://eslint.org/docs/developer-guide/shareable-configs')

中文：[shareable-configs](https://link.juejin.cn?target=http%3A%2F%2Feslint.cn%2Fdocs%2Fdeveloper-guide%2Fshareable-configs 'http://eslint.cn/docs/developer-guide/shareable-configs')
