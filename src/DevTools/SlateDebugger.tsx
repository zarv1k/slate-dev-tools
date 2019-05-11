import React from 'react';
import {Editor} from 'slate';
// import './SlateDebugger.scss';
import SlateDevToolsContext from './devToolsContext';
import {SlateDevToolsContextValue} from './interface';

interface Props {
  shouldRenderId: boolean;
  debugId: string;
  editor: Editor;
}

export class SlateDebugger extends React.Component<Props> {
  static contextType = SlateDevToolsContext;
  public context!: SlateDevToolsContextValue;
  public componentWillUnmount() {
    this.context.editorRemoved(this.props.debugId);
  }

  public render() {
    // if (!this.props.enabled) {
    //   return null;
    // }
    if (!this.props.shouldRenderId) {
      return null;
    }
    return (
      <span className="slate-debugger-id" onMouseDown={this.show}>
        {this.props.debugId}
      </span>
    );
  }

  public focusEditor = (debugId: string, change: Editor) => {
    this.context.editorSelected(debugId, change);
  };

  public changeValue = (debugId: string, change: Editor) => {
    this.context.editorChanged(debugId, change);
  };

  private show = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const {editor, debugId} = this.props;

    this.context.editorSelected(debugId, editor);
  };
}

export default SlateDebugger;
