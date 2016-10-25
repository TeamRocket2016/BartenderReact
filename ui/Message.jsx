export default function Message(type, body) {
  this.type = type;
  this.body = body;

  if (this.type !== 'remote' && this.type !== 'local') {
    throw 'Unknown Message Type Set';
  }
}
