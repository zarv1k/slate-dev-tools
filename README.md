# @zarv1k/slate-dev-tools

> DevTools for [Slate](https://www.slatejs.org/)

[![NPM](https://img.shields.io/npm/v/@zarv1k/slate-dev-tools.svg)](https://www.npmjs.com/package/@zarv1k/slate-dev-tools)

## Features

- Allows inspecting Slate `ValueJSON` `Value`, `Selection` and `Editor` controller live in UI;
- Works with multiple Slate Editors on a web page;
- Collapse/Expand `Text` node in `JSONTree` according to current `Selection` (aka very simple `Selection` synchronization);
- Dump current state object to console in selected format;
- Saves the selected mode between page reloads (localStorage).

[Demo](https://zarv1k.github.io/slate-dev-tools)

## Install

yarn:
```bash
yarn add --dev @zarv1k/slate-dev-tools
```

or npm:
```bash
npm install --save-dev @zarv1k/slate-dev-tools
```

## Usage

1. Using HOC `withDevTools()`:
    ```tsx
    import React from 'react';
    
    import {Value, ValueJSON} from 'slate';
    import {Editor as SlateReactEditor} from 'slate-react';
    
    import {Provider, withDevTools} from '@zarv1k/slate-dev-tools';
    import '@zarv1k/slate-dev-tools/dist/SlateDevTools.css';
    
    const valueJSON: ValueJSON = {
      object: 'value',
      document: {
        object: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            data: {},
            nodes: [
              {
                object: 'text',
                text: '',
                marks: []
              }
            ]
          }
        ]
      }
    };
    
    const Editor = withDevTools()(SlateReactEditor);
    
    const App: React.FC = () => {
      const [value, setValue] = React.useState(Value.fromJSON(valueJSON));
      return (
        <Provider>
          <Editor
            value={value}
            placeholder="Slate is awesome"
            onChange={({value}) => setValue(value)}
          />
        </Provider>
      );
    };
    
    export default App;
    ```
2. Using plugin `DevToolsPlugin()`:

If you don't want to use `withDevTools()` HOC for `Editor` component, you can use `DevToolsPlugin()` slate plugin:

```tsx
import React from 'react';

import {Value, ValueJSON} from 'slate';
import {Editor} from 'slate-react';

import {Provider, DevToolsPlugin} from '@zarv1k/slate-dev-tools';
import '@zarv1k/slate-dev-tools/dist/SlateDevTools.css';


const plugins = [DevToolsPlugin()];

const App: React.FC = () => {
  const [value, setValue] = React.useState(Value.fromJSON(valueJSON));
  return (
    <Provider>
      <Editor
        value={value}
        placeholder="Slate is awesome"
        onChange={({value}) => setValue(value)}
        plugins={plugins}
      />
    </Provider>
  );
};

export default App;
``` 

## TODO:
 - [ ] document all available options;
 - [ ] add `prop-types` for vanilla JS users;
 - [ ] add all options available in `Value.toJSON(options)` as `DevToolsPluginOptions.valueToJSONOptions`;
 - [ ] move entire codebase of [`slate-hyperprint`](https://github.com/zarv1k/slate-hyperprint/tree/0.46.1-dev) dependency into slate core package `slate-hypescript` as a [printer](https://github.com/ianstormtaylor/slate/pull/1902#issuecomment-434852988);
 - [ ] fix feature "lock/unlock state"  - it is broken at the moment
 - [ ] replace `Editor` (aka Last Change) in dev tools with `Value` and `operations`
 - [ ] add new inspect modes, e.g. applied Plugins per Editor, registered commands, queries, middlewares and many for Schema;
 - [ ] make it possible to set Editor Value from dev tools UI either with ValueJSON or with Hyperscript;
 - [ ] make it possible to run Editor commands and queries from dev tools UI;