import React from 'react';
import {SlateDevToolsContextValue} from './interface';
import {SlateDevToolsInspect} from './constants';
import {Map} from 'immutable';
import {EditorRecord} from './EditorRecord';

const SlateDevToolsContext: React.Context<SlateDevToolsContextValue> = React.createContext({
  editors: Map<string, EditorRecord>(),
  inspect: SlateDevToolsInspect.VALUE_JSON,
  raw: false,
  editorSelected: () => {},
  editorChanged: () => {},
  editorRemoved: () => {},
  inspectChanged: () => {},
  toggleRaw: () => {},
  hyperprintOptions: {}
  // valueToJSONOptions: {}
});

export default SlateDevToolsContext;
