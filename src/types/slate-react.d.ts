import SlateReact from 'slate-react';
import Slate from 'slate';
declare module 'slate-react' {
  type SlateType = 'fragment' | 'html' | 'node' | 'rich' | 'text' | 'files';

  interface EventTransfer {
    type: SlateType;
    files: File[];
    fragment: Slate.Document | null;
    html: string | null;
    node: Slate.Node | null;
    rich: string | null;
    text: string | null;
  }

  export function getEventTransfer(event: Event): EventTransfer;

  export interface Plugin extends Object, Slate.Plugin, SlateReact.Plugin {
    plugins?: Plugin[];
  }
}
