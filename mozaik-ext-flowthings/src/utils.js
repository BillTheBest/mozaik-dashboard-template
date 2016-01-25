export function threshold(thresh, value) {
  if (value == null || thresh == null) {
    return false
  }

  let comp = '>='
  if (typeof thresh !== 'number') {
    comp   = thresh[0]
    thresh = thresh[1]
  }

  switch (comp) {
    case '>':  return value > thresh
    case '<':  return value < thresh
    case '>=': return value >= thresh
    case '<=': return value <= thresh
    default:   return false
  }
}

