import print, {HyperprintOptions} from '@zarv1k/slate-hyperprint';
import {Value} from 'slate';

const defaultOptions: HyperprintOptions = {
  prettier: {
    singleQuote: true,
    tabWidth: 2,
    semi: false
  }
};

const hyperprint = (value: Value, options: HyperprintOptions = {}) => {
  return print(value, {
    ...defaultOptions,
    ...options,
    prettier: {
      ...defaultOptions.prettier,
      ...options.prettier
    }
  });
};

export default hyperprint;
