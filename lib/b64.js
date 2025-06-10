export default function toBase64(v) {
  if (!v) return '';
  // Handle Node Buffers directly
  if (Buffer.isBuffer(v)) return v.toString('base64');
  // Support ArrayBuffer and typed arrays returned from databases
  if (v instanceof ArrayBuffer || ArrayBuffer.isView(v)) {
    return Buffer.from(v).toString('base64');
  }
  const s = v.toString();
  // Convert Postgres bytea hex format to base64
  if (s.startsWith('\\x')) return Buffer.from(s.slice(2), 'hex').toString('base64');
  return s;
}
