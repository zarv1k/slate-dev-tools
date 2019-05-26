import {Editor, Plugin} from 'slate';
import {SlateDevToolsInspect} from './constants';
import {HyperprintOptions} from '@zarv1k/slate-hyperprint';
import {Map} from 'immutable';
import {EditorRecord} from './EditorRecord';

export type EditorsMap = Map<string, EditorRecord>;

export interface DevToolsPlugin extends Plugin {}

export interface DevToolsPluginCreator {
  (options?: DevToolsPluginOptions): DevToolsPlugin;
}

export interface DevToolsPluginOptions {
  enabled?: boolean;
  getIdQuery?: string;
  generateId?: () => string;
  shouldRenderId?: boolean;
  hyperprintOptions?: HyperprintOptions;
}

export interface SlateDevToolsContextValue {
  activeId?: string;
  editors: EditorsMap;
  inspect: SlateDevToolsInspect;
  raw: boolean;
  editorSelected: (editorId: string, editor: Editor) => void;
  editorChanged: (editorId: string, editor: Editor) => void;
  editorRemoved: (editorId: string) => void;
  inspectChanged: (inspect: SlateDevToolsInspect) => void;
  toggleRaw: () => void;
  hyperprintOptions: {[editorId: string]: HyperprintOptions};
  // TODO: implement following options
  // toJSONOptions?: ValueToJSONOptions;
}
