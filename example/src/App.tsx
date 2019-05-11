import React, {useState} from 'react';
import {Value, ValueJSON} from 'slate';
import {Editor} from 'slate-react';

import {Provider, withDevTools} from '@zarv1k/slate-dev-tools';
import '@zarv1k/slate-dev-tools/dist/SlateDevTools.css';

import doc from './default.json';
import logo from './logo.svg';
import './App.css';

const defaultValue = () => {
  const value = localStorage.getItem('cra:slate');
  return Value.fromJSON(value ? JSON.parse(value) : doc);
};

const SlateEditor = withDevTools()(Editor);

const App: React.FC = () => {
  const [value, setValue] = useState(defaultValue());
  return (
    <Provider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <pre>
            <code>@zarv1k/slate-dev-tools@0.1.0</code>
          </pre>
          <p>
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.setItem('cra:slate', JSON.stringify(doc));
                setValue(Value.fromJSON(doc as ValueJSON));
              }}
            >
              Flush storage
            </button>
          </p>
          <SlateEditor
            value={value}
            className="App-editor"
            placeholder="Slate is awesome"
            onChange={({value}) => {
              localStorage.setItem('cra:slate', JSON.stringify(value.toJSON()));
              setValue(value);
            }}
          />
        </header>
      </div>
    </Provider>
  );
};

export default App;
