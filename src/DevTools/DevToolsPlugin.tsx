import {DevToolsPluginCreator, DevToolsPluginOptions} from './interface';
import {Editor as SlateReactEditor} from 'slate-react';
import {Command, Editor} from 'slate';
import {genKey} from './utils';
import {QUERY_GET_EDITOR_ID, QUERY_GET_HYPERPRINT_OPTIONS} from './constants';
import {EditorProps} from 'slate-react';
import React from 'react';
import SlateDebugger from './SlateDebugger';

const DevToolsPlugin: DevToolsPluginCreator = (options: DevToolsPluginOptions = {}) => {
  const {
    generateId = genKey,
    getIdCommand = QUERY_GET_EDITOR_ID,
    hyperprintOptions = {},
    shouldRenderId = true
  } = options;

  const editorId = generateId();
  const debuggerRef = React.createRef<SlateDebugger>();

  return {
    onQuery: (command: Command, editor: Editor, next: () => void) => {
      if (command.type === getIdCommand) {
        return editorId;
      }
      if (command.type === QUERY_GET_HYPERPRINT_OPTIONS) {
        return hyperprintOptions;
      }
      return next();
    },
    onConstruct: (editor: Editor, next: () => void) => {
      const hasQuery = editor.hasQuery(getIdCommand);
      if (!hasQuery) {
        editor.registerQuery(getIdCommand);
      }
      editor.registerQuery(QUERY_GET_HYPERPRINT_OPTIONS);
      return next();
    },
    onFocus: (event: Event, editor: Editor & SlateReactEditor, next: () => unknown) => {
      const debuger = debuggerRef.current;
      if (debuger) {
        const debugId = editor.query(QUERY_GET_EDITOR_ID);
        debuger.focusEditor(debugId, editor.controller);
      }
      return next();
    },
    onChange: (editor: Editor & SlateReactEditor, next: () => void) => {
      const debuger = debuggerRef.current;
      const change = next();
      if (debuger) {
        const debugId = editor.query(QUERY_GET_EDITOR_ID);
        debuger.changeValue(debugId, editor.controller);
      }
      return change;
    },
    renderEditor: (props: EditorProps, editor: Editor, next: () => any) => {
      // if (!this.enabled) {
      //   return props.children;
      // }
      const debugId = editor.query(QUERY_GET_EDITOR_ID);
      return (
        <div style={{position: 'relative'}}>
          {next()}
          <SlateDebugger ref={debuggerRef} editor={editor} debugId={debugId} shouldRenderId={shouldRenderId} />
        </div>
      );
    }
  };
};

export default DevToolsPlugin;
