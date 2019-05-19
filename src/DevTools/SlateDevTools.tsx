import React from 'react';
import classNames from 'classnames';
import JSONTree from 'react-json-tree';
import Icon from '../icons/Icon';
import {default as Immutable, List} from 'immutable';
import hyperprint from './hyperprint';
import Prism from 'prismjs';
import {SlateDevToolsInspect} from './constants';
import SlateDevToolsContext from './devToolsContext';
import {SlateDevToolsContextValue, EditorsMap} from './interface';
import {ReactComponent as Bug} from '../icons/other/bug.svg';
import {ReactComponent as ChevronLeft} from '../icons/other/chevron-left.svg';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/components/prism-json.min';
import './SlateDevTools.scss';
import './PrismTheme.scss';
import {EditorRecord} from './EditorRecord';

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
  lockedEditors: EditorsMap | null;
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
      lockedEditors: null
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
      this.editor.value.equals(nextContext.editors.getIn([nextContext.activeId, 'value']))
    ) {
      this.setState({remountJsonTree: true}, () => {
        this.setState({remountJsonTree: false});
      });
    }
  }

  public render() {
    if (!this.editor) {
      return null;
    }
    const classes = classNames('slate-dev-tools', {
      readonly: this.props.readonly,
      collapsed: this.state.collapsed,
      'debug-json-tree': !this.context.raw
    });

    return (
      <div className={classes}>
        <div className="debug-head">
          <div className="debug-title">
            <span className="debug-title-mode">{this.title()}</span>
          </div>
          <div className="debug-actions">
            <button
              title="Auto-expand JSONTree node with selection"
              className={classNames({
                'toggle-sync': true,
                active: this.state.syncJsonTree,
                hide: this.context.raw
              })}
              onMouseDown={this.toggleSelectionSync}
              disabled={this.context.raw}
            >
              <Icon name="cast" />
            </button>
            <button
              title="Lock/unlock re-render changes from editors"
              onMouseDown={this.toggleLockChanges}
              className={classNames('toggle-lock', {active: this.state.lockedEditors})}
            >
              <Icon name={this.state.lockedEditors ? 'lock' : 'unlockOutline'} />
            </button>
            <button title="Toggle view JSONTree/JSON" onMouseDown={this.toggleRaw}>
              <Icon name={this.context.raw ? 'curly' : 'menu2Outline'} />
            </button>
            <button title="Console current state" onMouseDown={this.consoleState}>
              <Icon name="downloadOutline" />
            </button>
            <button title="Switch inspect mode" onMouseDown={this.toggleState}>
              <Icon name={this.inspectIcon()} />
            </button>
            <button onMouseDown={this.toggle} className="debug-close">
              <Icon name="cross" />
            </button>
          </div>
        </div>
        {this.renderRawContentState()}
        <button onMouseDown={this.toggle} className="hide-toggle">
          <ChevronLeft viewBox="0 0 1792 1792" />
          <Bug viewBox="0 0 1792 1792" />
        </button>
      </div>
    );
  }

  private inspectIcon = () => {
    switch (this.context.inspect) {
      case SlateDevToolsInspect.HYPERSCRIPT:
        return 'code';
      case SlateDevToolsInspect.SELECTION:
        return 'iCursor';
      case SlateDevToolsInspect.LAST_OPERATIONS:
        return 'swapOutline';
      case SlateDevToolsInspect.VALUE:
        return 'cubeOutline';
      default:
        return 'fileTextOutline';
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

  private valueJSON = () => {
    const change = this.editor;
    return change!.value.toJSON();
  };

  private value = () => {
    const change = this.editor;
    if (!this.context.raw) {
      return change!.value;
    }
    return change!.value;
  };

  private selection = () => {
    const change = this.editor;
    if (!this.context.raw) {
      return change ? change.value.selection : [];
    }
    return change!.value.selection.toJS();
  };

  private hyperprint = () => {
    const change = this.editor;

    return change
      ? hyperprint(change.value, this.context.hyperprintOptions[this.activeId!] || {})
      : '';
  };

  private lastOperations = () => {
    const change = this.editor;
    if (!this.context.raw) {
      return {
        operations: change!.operations
      };
    }
    return {
      operations: change!.operations.toJS()
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
  //   const change = this.state.lockedEditors || this.editor;
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
        return this.hyperprint();
      case SlateDevToolsInspect.SELECTION:
        return this.selection();
      case SlateDevToolsInspect.LAST_OPERATIONS:
        return this.lastOperations();
      case SlateDevToolsInspect.VALUE:
        return this.value();
      default:
        return this.valueJSON();
    }
  };

  private title() {
    const currentState = this.context.inspect;
    return (
      <span>
        Slate <span className="slate-dev-tools-id">{this.context.activeId || ''}</span>:{' '}
        {currentState}
      </span>
    );
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
      lockedEditors: !this.state.lockedEditors && this.context.editors ? this.context.editors : null
    });
  };

  private consoleState = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.group(`Slate ${this.context.activeId || ''}: ${this.context.inspect}`);
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
      case SlateDevToolsInspect.LAST_OPERATIONS:
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

  private get editor(): EditorRecord | undefined {
    const {activeId} = this.context;
    const editors = this.state.lockedEditors || this.context.editors;
    return activeId ? editors.get(activeId) : undefined;
  }

  private get activeId(): string | undefined {
    return this.context.activeId;
  }
}

export default SlateDevTools;
