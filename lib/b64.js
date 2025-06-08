export default function toBase64(v) {
  if (!v) return '';
  if (Buffer.isBuffer(v)) return v.toString('base64');
  const s = v.toString();
  if (s.startsWith('\\x')) return Buffer.from(s.slice(2), 'hex').toString('base64');
  return s;
}
