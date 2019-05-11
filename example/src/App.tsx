import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
// import slate from 'slate.module.scss';
// import messages from 'ru-RU.json';
import {Value, ValueJSON} from 'slate';
import doc from './slate.json';
import {Provider, withDevTools} from '@zarv1k/slate-dev-tools'
import {Editor} from 'slate-react';

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
              <code>SlateJS v0.46.1</code>
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
              // className={slate.editor}
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
