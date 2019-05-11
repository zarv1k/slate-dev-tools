import React from 'react';
import {SlateDevToolsContextValue} from './interface';
import SlateDevToolsContext from './devToolsContext';
import {Editor} from 'slate';
import SlateDevTools from './SlateDevTools';
import {QUERY_GET_HYPERPRINT_OPTIONS, SlateDevToolsInspect} from './constants';

interface Props {
  localStorageKey: string | null;
}

class Provider extends React.Component<Props, SlateDevToolsContextValue> {
  public static defaultProps: Partial<Props> = {
    localStorageKey: '@zarv1k/slate-dev-tools'
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      editors: {},
      editorSelected: this.activateEditor,
      editorChanged: this.activateEditor,
      editorRemoved: this.removeEditor,
      inspectChanged: this.changeInspect,
      toggleRaw: this.toggleRaw,
      hyperprintOptions: {},
      ...this.getDefaultModes()
    };
  }
  render() {
    return (
      <SlateDevToolsContext.Provider value={this.state}>
        {this.props.children}
        <SlateDevTools />
      </SlateDevToolsContext.Provider>
    );
  }

  private activateEditor = (editorId: string, editor: Editor) => {
    const newState = {
      activeId: editorId,
      editors: {
        ...this.state.editors,
        [editorId]: editor
      },
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
    this.setState({activeId, editors, hyperprintOptions})
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
}

export default Provider;
