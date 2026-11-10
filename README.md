# @cto.af/ncurc

Utilities for configuring [npm-check-updates](https://github.com/raineorshine/npm-check-updates).

## Use

```bash
npm install -D @cto.af/ncurc
```

In .ncurc.js:

```js
import {localCooldown} from './index.js';

export default {
  cooldown: await localCooldown(),
}
```

Put names of local packages in ../deps.json:

```json
{
  "local": ["foo", "bar"]
}
```

## Cooldown Options

```ts
export type CooldownOptions = {
    /**
     * Dependency file name.
     */
    fileName?: string;
    /**
     * Directories to look for fileName.
     */
    directories?: string[];
    /**
     * Non-local packages should cool down this long.
     */
    defaultCooldown?: number;
    /**
     * Local packages should coold down this long.
     */
    localCooldown?: number;
    /**
     * Key in dependency file holding array of local package names.
     */
    key?: string | null;
    /**
     * Verbose logging.
     */
    verbose?: boolean;
};
```
