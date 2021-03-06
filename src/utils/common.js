import {isArrayLike, isString, isObject} from 'lodash'

function pickOrOmit(pickOrOmit, param, ...args) {
  if (!param) return param

  const arg = args[0]

  args.length === 1 && !isString(arg) && isArrayLike(arg) && (args = Array.from(arg))

  const objOrArr = isObject(param)

  const processed = objOrArr ? {} : []

  if (pickOrOmit) {
    for (const arg of args) {
      const value = param[arg]
      const keys = Object.keys(param)
      if (keys.includes(arg + '')) {
        objOrArr ? (processed[arg] = value) : processed.push(value)
      }
    }
  } else {
    for (const [key, value] of Object.entries(param)) {
      if (!args.includes(key) && !args.includes(+key)) {
        objOrArr ? (processed[key] = value) : processed.push(value)
      }
    }
  }

  return processed
}

export const pick = (...args) => pickOrOmit(true, ...args)

export const omit = (...args) => pickOrOmit(false, ...args)

export const each = (collection, iteratee, context) => {
  iteratee = context ? iteratee.bind(context) : iteratee
  let entries

  if (isArrayLike(collection)) {
    entries = Array.from(collection).entries()
  } else if (isObject(collection)) {
    entries = Object.entries(collection)
  }

  if (entries) {
    for (const [key, value] of entries) {
      if (iteratee(value, key, collection) === false) return
    }
  } else each([collection], iteratee, context)
}

export function obj2Arr(obj, objKey = 'key', objValue = 'value') {
  const result = []
  for (const [key, value] of Object.entries(obj)) {
    result.push({
      [objKey]: key,
      [objValue]: value
    })
  }
  return result
}
