import React from 'react';
import {Editor} from 'slate';
import classNames from 'classnames';
import JSONTree from 'react-json-tree';
import Icon from './Icon';
import {default as Immutable, List} from 'immutable';
import hyperprint from './hyperprint';
import Prism from 'prismjs';
import {SlateDevToolsInspect} from './constants';
import SlateDevToolsContext from './devToolsContext';
import {SlateDevToolsContextValue} from './interface';
// import theme from './react-json-tree-theme.json';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/components/prism-json.min';
import './SlateDevTools.scss';
import './DevToolsPrism.css';

// import parseHyperscript from '../../SlateEditor/plugins/parseHyperscript';

interface OwnProps {
  // TODO: check the prop is necessary
  readonly?: boolean;
}

type Props = OwnProps;

interface State {
  collapsed: boolean;
  syncJsonTree: boolean;
  remountJsonTree: boolean;
  // TODO: lockChange is broken - does not work at the moment
  lockChange: Editor | null;
}

class SlateDevTools extends React.PureComponent<Props, State> {
  public static contextType = SlateDevToolsContext;
  public context!: SlateDevToolsContextValue;

  constructor(props: Props, context: SlateDevToolsContextValue) {
    super(props, context);
    this.state = {
      collapsed: false,
      syncJsonTree: false,
      remountJsonTree: false,
      lockChange: null
    };
  }

  public componentDidMount() {
    const {raw, inspect} = this.context;
    if (raw || inspect === SlateDevToolsInspect.HYPERSCRIPT) {
      Prism.highlightAll();
    }
  }

  public componentDidUpdate() {
    const {raw, inspect} = this.context;
    if (raw || inspect === SlateDevToolsInspect.HYPERSCRIPT) {
      Prism.highlightAll();
    }
  }

  public componentWillReceiveProps(
    nextProps: Readonly<Props>,
    nextContext: SlateDevToolsContextValue
  ): void {
    if (
      !this.context.raw &&
      this.state.syncJsonTree &&
      this.editor &&
      nextContext.activeId &&
      this.editor.value.equals(nextContext.editors[nextContext.activeId].value)
    ) {
      this.setState({remountJsonTree: true}, () => {
        this.setState({remountJsonTree: false});
      });
    }
  }

  public render() {
    if (!this.editor /* || !this.props.enabled*/) {
      return null;
    }
    const classes = classNames('slate-editor-debug', {
      readonly: this.props.readonly,
      collapsed: this.state.collapsed,
      'debug-json-tree': !this.context.raw
    });

    return (
      <div className={classes}>
        <div className="debug-head">
          <div className="debug-title">
            <span>
              <Icon name={this.props.readonly ? 'eye' : 'pencil'} />
              {this.title()}
            </span>
          </div>
          <div className="debug-actions">
            <button
              title="Toggle Sync Selection (can degrade performance)"
              className={classNames({
                'toggle-sync': true,
                active: this.state.syncJsonTree,
                hide: this.context.raw
              })}
              onMouseDown={this.toggleSelectionSync}
              disabled={this.context.raw}
            >
              <Icon name="feed" />
            </button>
            <button title="Lock/Unlock Editor State" onMouseDown={this.toggleLockChanges}>
              <Icon name={this.state.lockChange ? 'lock' : 'unlock-alt'} />
            </button>
            <button title="Toggle view (JSONTree/raw)" onMouseDown={this.toggleRaw}>
              <Icon name={this.context.raw ? 'code' : 'indent'} />
            </button>
            <button title="Console Log State" onMouseDown={this.consoleState}>
              <Icon name="terminal" />
            </button>
            <button title="Switch State" onMouseDown={this.toggleState}>
              <Icon name={this.inspectIcon()} />
            </button>
            <button onMouseDown={this.toggle} className="debug-close">
              <Icon name="close" />
            </button>
          </div>
        </div>
        {this.renderRawContentState()}
        <button onMouseDown={this.toggle} className="hide-toggle">
          <Icon name="chevron-left" />
          <Icon name="bug" />
        </button>
      </div>
    );
  }

  private inspectIcon = () => {
    switch (this.context.inspect) {
      case SlateDevToolsInspect.HYPERSCRIPT:
        return 'code';
      case SlateDevToolsInspect.SELECTION:
        return 'location-arrow';
      case SlateDevToolsInspect.LAST_CHANGE:
        return 'exchange';
      case SlateDevToolsInspect.VALUE:
        return 'object-group';
      default:
        return 'pc-payments';
    }
  };
  private renderRawContentState = () => {
    return <div className="debug-body">{this.renderBody()}</div>;
  };

  private toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({collapsed: !this.state.collapsed});
  };

  private selectAllContent = (e: React.MouseEvent<HTMLPreElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const range = document.createRange();
    range.selectNodeContents(e.currentTarget);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  private valueJSON = (stateChange: Editor | null) => {
    const change = stateChange || this.editor;
    return change!.value.toJSON();
  };

  private value = (stateChange: Editor | null) => {
    const change = stateChange || this.editor;
    if (!this.context.raw) {
      return change!.value;
    }
    return change!.value.toJS();
  };

  private selection = (stateChange: Editor | null) => {
    const change = stateChange || this.editor;
    if (!this.context.raw) {
      return change ? change.value.selection : [];
    }
    return change!.value.selection.toJS();
  };

  private hyperprint = (stateChange: Editor | null) => {
    const change = stateChange || this.editor;

    return change
      ? hyperprint(change.value, this.context.hyperprintOptions[this.context.activeId!] || {})
      : '';
  };

  private lastChange = (stateChange: Editor | null) => {
    const change = stateChange || this.editor;
    if (!this.context.raw) {
      return change;
    }
    return {
      operations: change!.operations.toJS(),
      value: change!.value.toJS()
    };
  };

  private toggleState = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentIndex = Object.keys(SlateDevToolsInspect)
      .map(k => SlateDevToolsInspect[k])
      .indexOf(this.context.inspect);
    let inspect = this.context.inspect;
    if (currentIndex > 0 && currentIndex === Object.keys(SlateDevToolsInspect).length - 1) {
      inspect = SlateDevToolsInspect.VALUE_JSON;
    } else {
      inspect = SlateDevToolsInspect[Object.keys(SlateDevToolsInspect)[currentIndex + 1]];
    }

    this.context.inspectChanged(inspect);
  };

  private renderBody = () => {
    if (this.state.collapsed) {
      return null;
    }
    const state = this.getCurrentState();
    if (this.context.inspect === SlateDevToolsInspect.HYPERSCRIPT || this.context.raw) {
      const lang = this.context.inspect === SlateDevToolsInspect.HYPERSCRIPT ? 'jsx' : 'json';
      const raw =
        this.context.inspect === SlateDevToolsInspect.HYPERSCRIPT
          ? state
          : JSON.stringify(state, null, 2);
      // TODO: add onPaste={this.setChange} handler in pre below
      return (
        <pre className="raw-content" onDoubleClick={this.selectAllContent}>
          <code className={`language-${lang}`}>{raw}</code>
        </pre>
      );
    } else {
      return this.state.remountJsonTree ? null : (
        <JSONTree
          data={state}
          hideRoot={true}
          theme={{
            scheme: 'slate',
            base00: '#2a2f3a',
            base01: '#282a2e',
            base02: '#373b41',
            base03: '#969896',
            base04: '#b4b7b4',
            base05: '#c5c8c6',
            base06: '#e0e0e0',
            base07: '#ffffff',
            base08: '#cc6666',
            base09: '#fc6d24',
            base0A: '#f0c674',
            base0B: '#a1c668',
            base0C: '#8abeb7',
            base0D: '#6fb3d2',
            base0E: '#b294bb',
            base0F: '#a3685a'
          }}
          invertTheme={false}
          shouldExpandNode={this.shouldExpandNode}
        />
      );
    }
  };

  // private setChange = (e: React.ClipboardEvent) => {
  //   const change = this.state.lockChange || this.editor;
  //   const setChange = this.getChangeSetter();
  //   const types = e.clipboardData.types;
  //
  //   if (!change || !setChange || !types.includes('text/plain')) {
  //     return;
  //   }
  //
  //   e.preventDefault();
  //   e.stopPropagation();
  //
  //   try {
  //     const text = e.clipboardData.getData('text/plain');
  //     let value = parseHyperscript(text);
  //     // TODO: review setting of the all of value's properties below
  //     value = value.set('schema', change.value.schema) as Value;
  //     setChange(value.change());
  //   } catch (e) {
  //     console.error('Slate DevTools: onPaste - error occurred while parsing hyperprint JSX:', e);
  //   }
  // };

  private getCurrentState = () => {
    switch (this.context.inspect) {
      case SlateDevToolsInspect.HYPERSCRIPT:
        return this.hyperprint(this.state.lockChange);
      case SlateDevToolsInspect.SELECTION:
        return this.selection(this.state.lockChange);
      case SlateDevToolsInspect.LAST_CHANGE:
        return this.lastChange(this.state.lockChange);
      case SlateDevToolsInspect.VALUE:
        return this.value(this.state.lockChange);
      default:
        return this.valueJSON(this.state.lockChange);
    }
  };

  private title() {
    const currentState = this.context.inspect;
    return `Slate ${this.context.activeId || ''}: ${currentState}`;
  }

  private toggleRaw = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.context.toggleRaw();
  };

  private toggleLockChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      lockChange: !this.state.lockChange && this.editor ? this.editor : null
    });
  };

  private consoleState = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.group(this.title());
    console.log(this.getCurrentState());
    console.groupEnd();
  };

  private shouldExpandJSONNode = (keyPath: Array<string | number>): boolean => {
    if (keyPath.length < 3) {
      return true;
    } else {
      return this.shouldExpandDocumentPath(keyPath);
    }
  };

  private shouldExpandDocumentPath = (keyPath: Array<string | number>) => {
    const path: Immutable.List<number> | false | null = this.editor
      ? (this.editor.value.selection.anchor.path as Immutable.List<number> | null)
      : false;
    if (!path) {
      return false;
    }
    const keyPathNumeric = keyPath.filter(kp => (kp as string).length === undefined).reverse();
    if (keyPathNumeric.length > path.count()) {
      const jsonPath = keyPathNumeric.slice(0, path.count());
      return List(jsonPath).equals(path);
    } else if (keyPathNumeric.length < path.count()) {
      const shortPath = path.slice(0, keyPathNumeric.length);
      return List(keyPathNumeric).equals(shortPath);
    } else {
      return List(keyPathNumeric).equals(path);
    }
  };

  private shouldExpandSelection = (keyPath: Array<string | number>): boolean => {
    return true;
  };

  private shouldExpandLastChange = (keyPath: Array<string | number>): boolean => {
    if (
      keyPath.length > 0 &&
      keyPath.length < 5 &&
      keyPath[keyPath.length - 1] === 'operations' &&
      keyPath[0] !== 'value'
    ) {
      return true;
    }
    return false;
  };

  private shouldExpandValueNode = (keyPath: Array<string | number>): boolean => {
    if (keyPath.length > 0 && keyPath[keyPath.length - 1] === 'document') {
      return this.shouldExpandDocumentPath(keyPath);
    }

    return false;
  };

  private shouldExpandNode = (
    keyPath: Array<string | number>,
    data: [any] | {},
    level: number
  ): boolean => {
    switch (this.context.inspect) {
      case SlateDevToolsInspect.HYPERSCRIPT:
        return false;
      case SlateDevToolsInspect.SELECTION:
        return this.shouldExpandSelection(keyPath);
      case SlateDevToolsInspect.LAST_CHANGE:
        return this.shouldExpandLastChange(keyPath);
      case SlateDevToolsInspect.VALUE:
        return this.shouldExpandValueNode(keyPath);
      default:
        return this.shouldExpandJSONNode(keyPath);
    }
  };

  private toggleSelectionSync = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({syncJsonTree: !this.state.syncJsonTree});
  };

  private get editor(): Editor | undefined {
    const {editors, activeId} = this.context;
    return activeId ? editors[activeId] : undefined;
  }

  // private getChangeSetter = (): ((change: Editor) => void) | undefined => {
  //   const change = this.state.lockChange || this.editor;
  //   if (!change) {
  //     return;
  //   }
  //   const value = change.value;
  //   const changeSetterPlugins = value.schema.stack.getPluginsWith('setChange');
  //   if (changeSetterPlugins.length === 1) {
  //     return (changeSetterPlugins[0] as DevToolsPlugin).setChange;
  //   }
  //   return;
  // };
}

export default SlateDevTools;
