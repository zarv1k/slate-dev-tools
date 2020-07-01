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

**Note**: You may also need to install `peerDependencies`, list of which you can find in [`package.json`](https://github.com/zarv1k/slate-dev-tools/blob/master/package.json).

## Usage

1. Using HOC `withDevTools(options)`:

   ```tsx
   import React from 'react';

   import {Value, ValueJSON} from 'slate';
   import {Editor as SlateReactEditor} from 'slate-react';

   import {Provider, withDevTools} from '@zarv1k/slate-dev-tools';
   import '@zarv1k/slate-dev-tools/lib/SlateDevTools.css';

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

2. Using plugin `DevToolsPlugin(options)`:

   If you don't want to use `withDevTools()` HOC with your `Editor` component, you can use `DevToolsPlugin(options)` slate plugin:

   ```tsx
   import React from 'react';

   import {Value, ValueJSON} from 'slate';
   import {Editor} from 'slate-react';

   import {Provider, DevToolsPlugin} from '@zarv1k/slate-dev-tools';
   import '@zarv1k/slate-dev-tools/lib/SlateDevTools.css';

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

## Configuration:

#### Options:

| Option                                | Default                                  | Description                                                                                                                                                                                                            |
| ------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled?: boolean                     | `process.env.NODE_ENV === 'development'` | Enable/disable `DevToolsPlugin`                                                                                                                                                                                        |
| getIdQuery?: string                 | 'getEditorId'                            | Slate query name that is used internally for identifying concrete editor on a web page. You can provide your own, if you have already used something similar for your needs in your editor.                            |
| generateId?: () => string             | _(internal build in genKey function)_    | Editor ID generator. Unused if you have already implemented your own query handler for query name defined by `getIdQuery`.                                                                                           |
| shouldRenderId?: boolean              | true                                     | Enable/disable rendering of editor ID using renderEditor() `slate-react` middleware by `DevToolsPlugin` if dev tools enabled. Can also be used to change active editor in dev tools without bluring the focused editor |
| hyperprintOptions?: HyperprintOptions | {}                                       | Hyperscript printer options (TODO: to be documented)                                                                                                                                                                   |

#### Provider props:

| Name                                 | Default                                  | Description                                                                                                                 |
| ------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| enabled?: boolean                    | `process.env.NODE_ENV === 'development'` | Enable/disable render dev tools React Provider.                                                                             |
| localStorageKey?: string &#124; null | '@zarv1k/slate-dev-tools'                | localstorage key for saving selected modes in dev tools. Set `null` to disable saving dev tools modes between page reloads. |

## TODO:

- [ ] add `prop-types` for vanilla JS users;
- [ ] add all options available in `Value.toJSON(options)` as `DevToolsPluginOptions.valueToJSONOptions` and make these options editable in UI;
- [ ] move entire codebase of [`@zarv1k/slate-hyperprint`](https://github.com/zarv1k/slate-hyperprint) dependency into slate core package `slate-hypescript` as a [printer](https://github.com/ianstormtaylor/slate/pull/1902#issuecomment-434852988);
- [ ] add new inspect modes, e.g. applied Plugins per Editor, registered commands, queries, middlewares and schema rules;
- [ ] make it possible to set Editor Value from dev tools UI either with ValueJSON or with Hyperscript;
- [ ] make it possible to run Editor commands and queries from dev tools UI;
