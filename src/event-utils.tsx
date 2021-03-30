import crypto from 'crypto'

export function createEventId(title: string, 
                              description: string, 
                              startStr: Date, 
                              endStr: Date, 
                              recurrence: string) {
  let shasum = crypto.createHash('sha1');
  shasum.update(title);
  shasum.update(description);
  shasum.update(startStr.toISOString());
  shasum.update(endStr.toISOString());
  shasum.update(recurrence);
  return String(shasum.digest())
}
