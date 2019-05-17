import {DevToolsPluginOptions} from './interface';
import {genKey} from './utils';
import {QUERY_GET_EDITOR_ID} from './constants';

const defaults: Required<DevToolsPluginOptions> = {
  enabled: process.env.NODE_ENV === 'development',
  generateId: genKey,
  getIdQuery: QUERY_GET_EDITOR_ID,
  hyperprintOptions: {},
  shouldRenderId: true
};

export default defaults;
