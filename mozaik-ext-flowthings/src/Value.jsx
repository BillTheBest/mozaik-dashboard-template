import React, { Component } from 'react'
import Reflux from 'reflux'
import Mozaik from 'mozaik/browser'
import mixin from 'react-mixin'
import sha1 from 'sha1'

import { threshold } from './utils'

class Value extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: null
    }
  }

  getApiRequest() {
    let params = {
      flow: this.props.flow,
      accessor: this.props.elem
    }
    return {
      id: `flowthings.value.${ sha1(JSON.stringify(params)) }`,
      params
    }
  }

  onApiData(current) {
    this.setState({ current })
  }

  display(value) {
    if (value == null) {
      return '';
    }

    if (typeof value === 'number') {
      let str = value.toString().split('.')
      return str.length > 1
        ? str[0] + '.' + str[1].slice(0, 3)
        : str[0]
    }

    return value.toString()
  }

  render() {
    let iconClassName = 'fa fa-' + (this.props.icon || 'certificate')
    let header = this.props.header || this.props.accessor
    let status = threshold(this.props.threshold, this.state.current)
      ? "failure"
      : "success"

    return (
      <div className={ status }>
        <div className="widget__header">
          <span className="widget__header__subject">{ header }</span>
          <i className={ iconClassName } />
        </div>
        <div className="widget__body">
          <div className="flowthings__value__current number">
            { this.display(this.state.current) }
          </div>
        </div>
      </div>
    )
  }
}

mixin(Value.prototype, Reflux.ListenerMixin)
mixin(Value.prototype, Mozaik.Mixin.ApiConsumer)

export { Value as default }
