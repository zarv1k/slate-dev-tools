import {DevToolsPluginCreator, DevToolsPluginOptions} from './interface';
import {Editor as SlateReactEditor, EditorProps} from 'slate-react';
import {Command, Editor} from 'slate';
import {QUERY_GET_EDITOR_ID, QUERY_GET_HYPERPRINT_OPTIONS} from './constants';
import React from 'react';
import SlateDebugger from './SlateDebugger';
import defaults from './defaults';

const DevToolsPlugin: DevToolsPluginCreator = (options: DevToolsPluginOptions = defaults) => {
  const {generateId, getIdCommand, hyperprintOptions, shouldRenderId, enabled} = {
    ...defaults,
    ...options
  };

  if (!enabled) {
    return {};
  }

  const editorId = generateId!();
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
      const debugId = editor.query(QUERY_GET_EDITOR_ID);
      return (
        <div style={{position: 'relative'}}>
          {next()}
          <SlateDebugger
            ref={debuggerRef}
            editor={editor}
            debugId={debugId}
            shouldRenderId={shouldRenderId}
          />
        </div>
      );
    }
  };
};

export default DevToolsPlugin;
