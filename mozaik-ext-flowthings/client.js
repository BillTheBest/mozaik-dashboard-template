import _ from 'lodash'
import flowthings from 'flowthings'
import config from './config'

export default function(context) {
  context.loadApiConfig(config)

  let api = flowthings.API({
    account: config.get('flowthings.account'),
    token:   config.get('flowthings.token')
  }, {
    transform: flowthings.promisify(Promise)
  })

  let ws = new Promise((resolve, reject) => {
    api.webSocket.connect((socket, err) => {
      if (err) {
        console.log('Error connecting to flowthings')
        reject(err)
      } else {
        console.log('Connected to flowthings')
        resolve(socket)
      }
    })
  })

  // Initial drop promises as a result of a query
  let initial = {}

  // Cache of value promises as a result of websocket push
  let values = {}

  // Cache of Flow paths to id
  let idByPath = {}

  return {
    value(params) {
      return getIdByPath(params.flow)
        .then(id => getOrSubscribe(id, params.accessor))
        .then(val => {
          return val == null
            ? Promise.reject(requestError('No value for ' + params.flow + '@' + params.accessor))
            : Promise.resolve(val)
        })
    },
    aggregation(params) {
      return getIdByPath(params.flow)
        .then(id => api.drop(id).aggregate(params))
        .catch(e => console.log(e))
    }
  }

  function getOrSubscribe(id, accessor) {
    let key = id + ':' + accessor
    if (values.hasOwnProperty(key)) {
      return values[key]
    }
    if (initial.hasOwnProperty(key)) {
      return initial[key]
    }
    return initial[key] = api.drop(id).find({ limit: 1 }).then(drops => {
      if (drops.length === 0) {
        return Promise.resolve(void 0)
      }
      let drop = drops[0]
      ws.then(conn => {
        conn.flow.subscribe(id, newDrop => {
          let val = accessorGet(accessor, newDrop)
          if (!_.isUndefined(val)) {
            values[key] = Promise.resolve(val)
          }
        })
      })
      return values[key] = Promise.resolve(accessorGet(accessor, drop))
    })
  }

  function getIdByPath(path) {
    if (path[0] === 'f') {
      return Promise.resolve(path)
    }
    if (idByPath.hasOwnProperty(path)) {
      return Promise.resolve(idByPath[path])
    }
    return api.flow.find({ filter: { path }}).then(fs => {
      return fs.length > 0
        ? Promise.resolve(idByPath[path] = fs[0].id)
        : Promise.reject(requestError('Path not found: ' + path))
    })
  }
}

function requestError(message) {
  let err = new Error(message)
  err.status = message
  return err
}

function accessorGet(accessor, drop) {
  let keys = accessor.split('.')
  let value = drop

  if (!_.has(drop, keys[0])) {
    value = drop.elems
  }

  for (let key; key = keys.shift();) {
    value = value[key]
    if (_.isUndefined(value)) {
      return value
    }
    if (_.has(value, 'type') && _.has(value, 'value')) {
      value = value.value
    }
  }

  return value
}
