import Slate from 'slate';

declare module 'slate' {
  export type Next = () => any;

  export interface Controller {
    hasQuery: (type: string) => boolean;
    hasCommand: (type: string) => boolean;
    query(query: string, ...args: any[]): Editor;
    query(query: string, ...args: any[]): any;
  }

  export interface TextJSON {
    text: string;
    leaves?: never;
    marks?: Slate.MarkJSON[];
  }

  export interface Editor extends Slate.Editor {
    query(query: string, ...args: any[]): any;
    hasQuery: (type: string) => boolean;
    hasCommand: (type: string) => boolean;
    // app specific
    getEditorId: () => string;
  }

  export type InvalidReason = Slate.ErrorCode;
}
