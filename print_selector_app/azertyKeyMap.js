var changes = {
  Q: 'A',
  W: 'Z',
  A: 'Q',
  ';': 'M',
  Z: 'W'
}

module.exports = function(qwerty){
  return changes[qwerty] || qwerty;
}