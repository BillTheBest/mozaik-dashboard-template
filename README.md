# mozaik-dashboard-template

## Install

```sh
git clone https://github.com/flowthings/mozaik-dashboard-template.git
cd mozaik-dashboard-template
npm install .
```

## Getting Started

First, we want to copy over `config.js.base`, as this will serve as our
configuration template.

```sh
cp config.js.base config.js
```

You can find the full details on `config.js` [here](http://mozaik.rocks/docs/config-file.html),
but for now let's look at how to configure it for flowthings.io.

The first thing to setup is your `account` and `token`:

```js
    api: {
      flowthings: {
        account: '<account>',
        token: '<token>'
      }
    },
```

Alternatively, this can be configured using the env variables `FLOWTHINGS_ACCOUNT`
and `FLOWTHINGS_TOKEN`.

Next, let's setup our dashboard widgets. The flowthings Mozaik plugin supports
two kinds of widgets: `value` and `aggregation`. The `value` widget will display
the current value for an elem based on the latest Drop in a Flow. The `aggregation`
widget will display a histogram based on an Aggregation query.

A sample `value` widget might look like:
```js
{
  type: 'flowthings.value',
  flow: '/path/to/my/flow',
  header: 'Current Temperature',
  elem: 'temperature',
  threshold: ['<', 20],

  // Positioning for Mozaik
  columns: 2, rows: 2, x: 0, y: 0
}
```

-   *`flow`*: The path or id of your Flow
-   *`header`*: The name you'd like displayed for your widget
-   *`elem`*: The Drop elem to show. You can use dot syntax for nested elems.
-   *`threshold`*: A special "warning" style will be applied when the threshold is triggered.
    You may use `<`, `>`, `<=`, or `>=` as the threshold operator.

A sample `aggregation` widget might look like:
```js
{
  type: 'flowthings.aggregation',
  flow: '/path/to/my/flow',
  header: 'Average Temperature',
  xLegend: 'Temperature',
  yLegend: 'By Hour',
  field: '$avg:temperature',
  groupBy: ['$hour'],
  sorts: ['$year:asc', '$month:asc', '$day:asc', '$hour:asc'],
  format: '{$day}:{$hour}',
  threshold: ['<', 20]

  // Positioning for Mozaik
  columns: 2, rows: 2, x: 2, y: 0
}
```

-   *`flow`*: The path or id of your Flow
-   *`header`*: The name you'd like displayed for your widget
-   *`xLegend`*: The name for the graph's x-axis (defaults to the `field`)
-   *`yLegend`*: The name for the graph's y-axis (defaults to `groupBy`)
-   *`field`*: The elem/function to aggregate.
-   *`format`*: A simple interpolation based on the aggregation row id.
-   *`threshold`*: A special "warning" style will be applied when the threshold is triggered.
    You may use `<`, `>`, `<=`, or `>=` as the threshold operator.

Additionally, other options (such as "sorts", "filter", "rules", etc) from the
[Drop Aggregate](https://flowthings.io/docs/flow-drop-aggregate) API are supported.

## Run

Once you've configured and positioned your widgets, you're ready to go.

To run your dashboard, just use `npm start` or `node app.js` and direct your
browser to the configured host and port.
