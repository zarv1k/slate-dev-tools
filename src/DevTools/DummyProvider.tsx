import React from 'react';
import {ProviderProps} from './interface';

type Props = ProviderProps;

class DummyProvider extends React.Component<Props> {
  public static displayName = 'SlateDevToolsProviderDummy';
  public static defaultProps: Partial<Props> = {
    enabled: process.env.NODE_ENV === 'development',
    localStorageKey: '@zarv1k/slate-dev-tools'
  };
  render() {
    return this.props.children;
  }
}

export default DummyProvider;
