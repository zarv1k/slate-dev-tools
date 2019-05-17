import React, {useState} from 'react';
import {Value} from 'slate';
import {Editor as SlateReactEditor} from 'slate-react';

import {Provider, withDevTools} from '@zarv1k/slate-dev-tools';
import '@zarv1k/slate-dev-tools/dist/SlateDevTools.css';

import {version} from '../package.json';
import logo from './logo.svg';
import './App.css';

import doc from './default.json';

const defaultValue = (index: number, useLocalStorage = true): Value => {
  const value = localStorage.getItem(`@zarv1k/slate-dev-tools:editor${index}`);
  return Value.fromJSON(useLocalStorage && value ? JSON.parse(value) : doc);
};

// enable by default in production environment just for gh-pages
const enabled = process.env.NODE_ENV === 'production';

const Editor = withDevTools({enabled})(SlateReactEditor);

const App: React.FC = () => {
  const [value1, setValue1] = useState(defaultValue(1));
  const [value2, setValue2] = useState(defaultValue(2));
  const [value3, setValue3] = useState(defaultValue(3));
  const [value4, setValue4] = useState(defaultValue(4));
  return (
    <Provider enabled={enabled}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a className="App-link" href="https://github.com/zarv1k/slate-dev-tools">
            <pre>
              <code>@zarv1k/slate-dev-tools</code>
            </pre>
          </a>
          <Editor
            autoFocus={true}
            value={value1}
            className="App-editor"
            placeholder="Slate Editor 1"
            onChange={({value}) => {
              localStorage.setItem(
                '@zarv1k/slate-dev-tools:editor1',
                JSON.stringify(value.toJSON())
              );
              setValue1(value);
            }}
          />
          <Editor
            autoFocus={true}
            value={value2}
            className="App-editor"
            placeholder="Slate Editor 2"
            onChange={({value}) => {
              localStorage.setItem(
                '@zarv1k/slate-dev-tools:editor2',
                JSON.stringify(value.toJSON())
              );
              setValue2(value);
            }}
          />
          <Editor
            autoFocus={true}
            value={value3}
            className="App-editor"
            placeholder="Slate Editor 3"
            onChange={({value}) => {
              localStorage.setItem(
                '@zarv1k/slate-dev-tools:editor3',
                JSON.stringify(value.toJSON())
              );
              setValue3(value);
            }}
          />
          <Editor
            autoFocus={true}
            value={value4}
            className="App-editor"
            placeholder="Slate Editor 4"
            onChange={({value}) => {
              localStorage.setItem(
                '@zarv1k/slate-dev-tools:editor4',
                JSON.stringify(value.toJSON())
              );
              setValue4(value);
            }}
          />
          <p>
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.setItem('@zarv1k/slate-dev-tools:editor1', JSON.stringify(doc));
                localStorage.setItem('@zarv1k/slate-dev-tools:editor2', JSON.stringify(doc));
                localStorage.setItem('@zarv1k/slate-dev-tools:editor3', JSON.stringify(doc));
                localStorage.setItem('@zarv1k/slate-dev-tools:editor4', JSON.stringify(doc));
                setValue1(defaultValue(1, false));
                setValue2(defaultValue(2, false));
                setValue3(defaultValue(3, false));
                setValue4(defaultValue(4, false));
              }}
            >
              Reset
            </button>
          </p>
          <a className="App-version" href="https://www.npmjs.com/package/@zarv1k/slate-dev-tools">
            v{version}
          </a>
        </header>
      </div>
    </Provider>
  );
};

export default App;
