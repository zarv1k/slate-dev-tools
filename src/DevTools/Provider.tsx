import React from 'react';
import {SlateDevToolsContextValue} from './interface';
import SlateDevToolsContext from './devToolsContext';
import {Editor} from 'slate';
import SlateDevTools from './SlateDevTools';
import {QUERY_GET_HYPERPRINT_OPTIONS, SlateDevToolsInspect} from './constants';
import {Map} from 'immutable';
import {EditorRecord} from './EditorRecord';

interface Props {
  enabled: boolean;
  localStorageKey: string | null;
}

class Provider extends React.Component<Props, SlateDevToolsContextValue> {
  public static displayName = 'SlateDevToolsProvider';
  public static defaultProps: Partial<Props> = {
    enabled: process.env.NODE_ENV === 'development',
    localStorageKey: '@zarv1k/slate-dev-tools'
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      editors: Map(),
      editorSelected: this.onEditorSelected,
      editorChanged: this.onEditorChanged,
      editorRemoved: this.removeEditor,
      inspectChanged: this.changeInspect,
      toggleRaw: this.toggleRaw,
      hyperprintOptions: {},
      ...this.getDefaultModes()
    };
  }
  render() {
    const {enabled, children} = this.props;
    if (!enabled) {
      return children;
    }
    return (
      <SlateDevToolsContext.Provider value={this.state}>
        {children}
        <SlateDevTools />
      </SlateDevToolsContext.Provider>
    );
  }

  private onEditorSelected = (editorId: string, editor: Editor) => {
    this.saveState(editorId, editor, true);
  };

  private onEditorChanged = (editorId: string, editor: Editor) => {
    this.saveState(editorId, editor);
  };

  private saveState = (editorId: string, editor: Editor, selectOnly = false) => {
    const newState = {
      activeId: editorId,
      editors: this.state.editors.set(
        editorId,
        this.ensureEditorRecord(editorId, editor, selectOnly)
      ),
      hyperprintOptions: {
        ...this.state.hyperprintOptions
      }
    };
    if (!this.state.hyperprintOptions[editorId]) {
      newState.hyperprintOptions = {
        [editorId]: editor.query(QUERY_GET_HYPERPRINT_OPTIONS) || {}
      };
    }
    this.setState(newState);
  };

  private removeEditor = (editorId: string) => {
    const activeId = editorId !== this.state.activeId ? this.state.activeId : undefined;
    const {...editors} = this.state.editors;
    const {...hyperprintOptions} = this.state.hyperprintOptions;
    delete editors[editorId];
    delete hyperprintOptions[editorId];
    this.setState({activeId, editors, hyperprintOptions});
  };

  private changeInspect = (inspect: SlateDevToolsInspect) => {
    this.setState({inspect}, () => {
      this.saveModes();
    });
  };

  private toggleRaw = () => {
    const {raw} = this.state;
    this.setState({raw: !raw}, () => {
      this.saveModes();
    });
  };

  private saveModes = () => {
    if (this.props.localStorageKey) {
      const {inspect, raw} = this.state;
      localStorage.setItem(this.props.localStorageKey, JSON.stringify({inspect, raw}));
    }
  };

  private getDefaultModes = (): Pick<SlateDevToolsContextValue, 'inspect' | 'raw'> => {
    if (this.props.localStorageKey) {
      const storedModes = localStorage.getItem(this.props.localStorageKey);
      if (storedModes) {
        const {inspect = SlateDevToolsInspect.VALUE_JSON, raw = false} = JSON.parse(
          storedModes
        ) as Pick<SlateDevToolsContextValue, 'inspect' | 'raw'>;
        return {inspect, raw};
      }
    }
    return {
      inspect: SlateDevToolsInspect.VALUE_JSON,
      raw: false
    };
  };

  private ensureEditorRecord(editorId: string, editor: Editor, selectOnly = false): EditorRecord {
    const record = this.state.editors.get(editorId);
    if (!record) {
      return new EditorRecord({
        value: editor.value,
        operations: editor.operations
      });
    } else if (!selectOnly) {
      return record.withMutations((r: EditorRecord) =>
        r.set('value', editor.value).set('operations', editor.operations)
      ) as EditorRecord;
    }
    return record;
  }
}

export default Provider;
