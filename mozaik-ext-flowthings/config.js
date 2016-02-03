import convict from 'convict'

export default convict({
  flowthings: {
    account: {
      doc: 'The flowthings.io account name',
      env: 'FLOWTHINGS_ACCOUNT',
      arg: 'flowthings-account',
      default: '',
      format: x => typeof x === 'string' && x.length > 0
    },
    token: {
      doc: 'The flowthings.io token',
      env: 'FLOWTHINGS_TOKEN',
      arg: 'flowthings-token',
      default: '',
      format: x => typeof x === 'string' && x.length > 0
    }
  }
})
