import React from 'react';
import {SlateDevToolsContextValue} from "./interface";
import {SlateDevToolsInspect} from "./constants";

const SlateDevToolsContext: React.Context<SlateDevToolsContextValue> = React.createContext({
  editors: {},
  inspect: SlateDevToolsInspect.VALUE_JSON,
  raw: false,
  editorSelected: () => {},
  editorChanged: () => {},
  editorRemoved: () => {},
  inspectChanged: () => {},
  toggleRaw: () => {},
  hyperprintOptions: {},
  // valueToJSONOptions: {},
  // editorRemoved: (editorId: string) => {}
});

export default SlateDevToolsContext;