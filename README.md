# mozaik-dashboard-template

## Setup

```sh
npm install .
npm link mozaik-ext-flowthings
npm run build-assets
```

## Config

```sh
cp config.js.base config.js
```

Configure flowthings credentials (can also be added as env vars `FLOWTHINGS_ACCOUNT|TOKEN`)
```js
    api: {
      flowthings: {
        account: 'foo',
        token: 'foo123'
      }
    },
```

Configure dashboards
```js
    dashboards: [
        {
            columns: 4,
            rows:    4,

            widgets: [
                {
                  type: 'flowthings.value',
                  flowId: 'f54a1a2350cf287ee63602394',
                  accessor: 'foo',
                  threshold: 60,
                  columns: 2, rows: 2,
                  x: 0, y: 0
                },
                {
                  type: 'flowthings.aggregation',
                  flowId: 'f54a1a2350cf287ee63602394',
                  groupBy: ['$minute'],
                  sorts: ['$minute:asc'],
                  field: '$avg:foo',
                  format: '{$hour}:{$minute}',
                  header: "Average Foo",
                  threshold: 60,
                  columns: 2, rows: 2,
                  x: 2, y: 0
                },
            ]
        }
    ]
```

## Run

```sh
node app.js
```
