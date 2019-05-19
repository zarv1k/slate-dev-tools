import {Operation, Value} from 'slate';
import {Record, List} from 'immutable';

interface RecordInterface {
  value: Value;
  operations: List<Operation>;
}

const defaults = {
  value: Value.create({}),
  operations: List<Operation>()
};

export class EditorRecord extends Record(defaults) implements RecordInterface {
  public get value(): Value {
    return super.get('value');
  }

  public get operations(): List<Operation> {
    return this.get('operations');
  }
}
