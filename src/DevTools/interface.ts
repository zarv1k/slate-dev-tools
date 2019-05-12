import {Editor, Plugin} from 'slate';
import {SlateDevToolsInspect} from './constants';
import {HyperprintOptions} from 'slate-hyperprint';

export interface DevToolsPlugin extends Plugin {}

export interface DevToolsPluginCreator {
  (options?: DevToolsPluginOptions): DevToolsPlugin;
}

export interface DevToolsPluginOptions {
  getIdCommand?: string;
  generateId?: () => string;
  shouldRenderId?: boolean;
  hyperprintOptions?: HyperprintOptions;
}

export interface SlateDevToolsContextValue {
  activeId?: string;
  editors: {[editorId: string]: Editor}; // TODO: {operations, value, [something else from Editor]} object should be used instead of Editor
  inspect: SlateDevToolsInspect;
  raw: boolean;
  editorSelected: (editorId: string, editor: Editor) => void;
  editorChanged: (editorId: string, editor: Editor) => void;
  editorRemoved: (editorId: string) => void;
  inspectChanged: (inspect: SlateDevToolsInspect) => void;
  toggleRaw: () => void;
  hyperprintOptions: {[editorId: string]: HyperprintOptions};
  // TODO: implement following options
  // enabled?: boolean;
  // toJSONOptions?: ValueToJSONOptions;
}
