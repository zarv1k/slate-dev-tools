const seenKeys: {[key: string]: boolean} = {};
const MULTIPLIER = Math.pow(2, 24);

export function genKey(): string {
  let key;
  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32);
  }
  seenKeys[key] = true;
  return key;
}
