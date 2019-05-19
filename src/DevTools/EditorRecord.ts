import {Operation, Value} from 'slate';
import {Record, List} from 'immutable';

const defaults = {
  value: Value.create({}),
  operations: List<Operation>()
};
export class EditorRecord extends Record(defaults) {}
