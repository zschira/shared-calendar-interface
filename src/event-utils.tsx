import crypto from 'crypto'

export function createHashId(vals: any[]) {
  let shasum = crypto.createHash('sha1');
  vals.forEach((val) => { shasum.update(val.toString()) });
  return String(shasum.digest("hex"))
}
