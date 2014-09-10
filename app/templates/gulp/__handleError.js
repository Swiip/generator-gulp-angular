function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}
