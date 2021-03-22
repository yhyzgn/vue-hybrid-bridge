import {App} from 'vue'
import {getConfig, InstallerOptions, setConfig} from './option'
import {bridge} from './bridge'

const HybridBridge = {
  install (app: App<any>, opts?: InstallerOptions): void {
    if (opts) {
      setConfig(opts)
    }
    const namespace = getConfig().namespace
    app.config.globalProperties[`$${namespace}`] = {
      inject: bridge.inject,
      handle: function (fnName: string, data?: object): Promise<any> {
        return bridge.handle(namespace, fnName, data)
      }
    }
  }
}

export {
  HybridBridge,
  bridge
}