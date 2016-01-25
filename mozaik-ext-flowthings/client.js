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

  // Cache of drop promises as a result of websocket push
  let latest  = {}

  return {
    value(params) {
      return getOrSubscribe(params.flowId)
        .then(drop => {
          let val = accessorGet(params.accessor, drop)
          return val == null
            ? Promise.reject(new Error('No value'))
            : Promise.resolve(val)
        })
    },
    aggregation(params) {
      return api.drop(params.flowId).aggregate(params)
    }
  }

  function getOrSubscribe(path) {
    if (latest.hasOwnProperty(path)) {
      return latest[path]
    }
    if (initial.hasOwnProperty(path)) {
      return initial[path]
    }
    return initial[path] = api.drop(path).find({ limit: 1 }).then(drops => {
      if (drops.length === 0) {
        return Promise.reject(new Error('No value'))
      }
      let drop = drops[0]
      ws.then(conn => {
        conn.flow.subscribe(path, newDrop => {
          console.log('Drop', newDrop)
          latest[path] = Promise.resolve(newDrop)
        })
      })
      return latest[path] = Promise.resolve(drop)
    })
  }
}

function accessorGet(accessor, drop) {
  let keys = accessor.split('.')
  let value = drop

  if (!_.has(drop, keys[0])) {
    value = drop.elems
  }

  for (let key; key = keys.shift();) {
    value = value[key]
    if (_.has(value, 'type') && _.has(value, 'value')) {
      value = value.value
    }
  }

  return value
}
