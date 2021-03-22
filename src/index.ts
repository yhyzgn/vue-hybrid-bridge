import {App} from 'vue'
import {getConfig, InstallerOptions, setConfig} from './option'
import {bridge} from './bridge'

const HybridBridge = {
  install (app: App<any>, opts?: InstallerOptions): void {
    if (opts) {
      setConfig(opts)
    }
    opts = getConfig()
    app.config.globalProperties[`$${opts.namespace}`] = {
      inject: bridge.inject,
      handle: bridge.handle
    }
  }
}

export {
  HybridBridge,
  bridge
}