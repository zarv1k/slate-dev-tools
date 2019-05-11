import {Editor as SlateReactEditor, EditorProps, Plugin} from 'slate-react';
import * as React from 'react';
import {DevToolsPluginOptions} from './interface';
import DevToolsPlugin from './DevToolsPlugin';

const withDevTools = (options: DevToolsPluginOptions = {}) => (
  editor: React.ComponentClass<EditorProps>
): React.ComponentClass<EditorProps> => {
  class Editor extends React.Component<EditorProps> {
    static displayName = `withDevTools(${editor.name})`;
    private readonly plugins: Plugin[];
    constructor(props: EditorProps) {
      super(props);
      this.plugins = props.plugins || [];

      this.plugins.push(DevToolsPlugin(options));
    }
    render() {
      return <SlateReactEditor {...this.props} plugins={this.plugins} />;
    }
  }
  return Editor;
};
export default withDevTools;
