import {Editor as SlateReactEditor, EditorProps, Plugin} from 'slate-react';
import * as React from 'react';
import {DevToolsPluginOptions} from './interface';
import DevToolsPlugin from './DevToolsPlugin';
import defaults from './defaults';

const withDevTools = (options: Partial<DevToolsPluginOptions> = {}) => (
  editor: React.ComponentClass<EditorProps>
): React.ComponentClass<EditorProps> => {
  const opts: DevToolsPluginOptions = {...defaults, ...options};

  if (!opts.enabled) {
    return editor;
  }

  class Editor extends React.Component<EditorProps> {
    static displayName = `withDevTools(${editor.name})`;
    private readonly plugins: Plugin[];
    constructor(props: EditorProps) {
      super(props);
      const plugins = props.plugins || [];
      this.plugins = [...plugins, DevToolsPlugin(opts)];
    }
    render() {
      return <SlateReactEditor {...this.props} plugins={this.plugins} />;
    }
  }
  return Editor;
};
export default withDevTools;
