import React, { Component } from 'react'
import Reflux from 'reflux'
import Mozaik from 'mozaik/browser'
import mixin from 'react-mixin'
import sha1 from 'sha1'
import format from 'string-format'

import { threshold } from './utils'

const { BarChart } = Mozaik.Component

class Aggregation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataset: []
    }
  }

  getApiRequest() {
    let params = {
      flowId:  this.props.flowId,
      sorts:   this.props.sorts,
      rules:   this.props.rules,
      filter:  this.props.filter,
      groupBy: this.props.groupBy,
      output:  [this.props.field]
    }
    return {
      id: `flowthings.aggregation.${ sha1(JSON.stringify(params)) }`,
      params
    }
  }

  onApiData(dataset) {
    this.setState({
      dataset: dataset.map(d => {
        let x = format(this.props.format, d.id)
        let y = d[this.props.field]
        let status = threshold(this.props.threshold, y)
          ? "failure"
          : "success"
        return { x, y, status }
      })
    })
  }

  render() {
    let options = {
      mode: 'stacked',
      yLegend: this.props.field,
      xLegend: (this.props.groupBy || []).join(', '),
      barClass: d => 'bar-' + d.status
    }

    let iconClassName = 'fa fa-' + (this.props.icon || 'bar-chart')
    let header = this.props.header || this.props.field

    return (
      <div>
        <div className="widget__header">
          <span className="widget__header__subject">{ header }</span>
          <i className={ iconClassName } />
        </div>
        <div className="widget__body">
          <BarChart data={[{ data: this.state.dataset }]} options={ options }/>
        </div>
      </div>
    );
  }
}

mixin(Aggregation.prototype, Reflux.ListenerMixin)
mixin(Aggregation.prototype, Mozaik.Mixin.ApiConsumer)

export { Aggregation as default }
