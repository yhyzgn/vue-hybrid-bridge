import {isAndroid, isIOS} from './device'
import {AndroidNative, IOSNative, Native, UnknownNative} from './internal'

const native: Native = isAndroid() ? new AndroidNative() : isIOS() ? new IOSNative() : new UnknownNative()

const bridge = {
  inject (fnName: string | object, fn?: Function): Promise<any> {
    return native.inject(fnName, fn)
  },

  handle (namespace: string, fnName: string, data?: object): Promise<any> {
    return native.handle(namespace, fnName, data)
  }
}
export {
  bridge
}