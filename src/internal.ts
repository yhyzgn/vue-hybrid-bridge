interface Internal {
  inject (fnName: string | object, fn?: Function): Promise<any>
}

interface Handler {
  handle (namespace: string, fnName: string, data?: object): Promise<any>
}

abstract class Native implements Internal, Handler {
  inject (fnName: string | object, fn?: Function): Promise<any> {
    if (arguments.length === 2 && typeof fnName === 'string') {
      window[fnName] = fn
      return Promise.resolve()
    } else if (arguments.length === 1 && typeof fnName === 'object') {
      for (let key of Object.keys(fnName)) {
        window[key] = fnName[key]
      }
      return Promise.resolve()
    }
    return Promise.reject('函数非法注入')
  }

  handle (namespace: string, fnName: string, data?: object): Promise<any> {
    return Promise.reject('未实现客户端接口')
  }
}

class AndroidNative extends Native {
  handle (namespace: string, fnName: string, data?: object): Promise<any> {
    // Android使用【window[namespace][方法名](参数)】方式
    if (arguments.length < 2) {
      return Promise.reject('命名空间和函数名称不能为空')
    }
    const bridge = window[namespace]
    try {
      const result = !data ? bridge[fnName]() : bridge[fnName](JSON.stringify(data))
      return Promise.resolve(result)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

class IOSNative extends Native {
  handle (namespace: string, fnName: string, data?: object): Promise<any> {
    // WKWebView使用【window.webkit.messageHandlers[方法名].postMessage(参数)】方式
    // UIWebView使用【JavaScriptCore】库的JSExport方式，直接【window[namespace][方法名](参数)】方式
    if (arguments.length < 2) {
      return Promise.reject('命名空间和函数名称不能为空')
    }
    if (isWKWebView()) {
      // WKWebView
      const bridge = window['webkit'].messageHandlers
      try {
        // 无参数时必须传 null，否则无法触发原生方法
        // const result = bridge[fnName](data ? JSON.stringify(data) : null)
        // 该方法无法通过命名空间触发，所以只能把命名空间通过data传递，原生端自行区分
        data = Object.assign(data || {}, {namespace: namespace})
        const result = bridge[fnName](JSON.stringify(data))
        return Promise.resolve(result)
      } catch (e) {
        return Promise.reject(e)
      }
    } else {
      // UIWebView
      const bridge = window[namespace]
      try {
        const result = !data ? bridge[fnName]() : bridge[fnName](JSON.stringify(data))
        return Promise.resolve(result)
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
}

class UnknownNative extends Native {
  handle (namespace: string, fnName: string, data?: object): Promise<any> {
    return Promise.reject('未知的客户端类型')
  }
}

function isWKWebView (): boolean {
  return typeof window['webkit'] !== 'undefined' && typeof window['webkit'].messageHandlers !== 'undefined'
}

export {
  Native,
  AndroidNative,
  IOSNative,
  UnknownNative
}