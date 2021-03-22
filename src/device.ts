interface device {
  ua: string,
  lang: string
}

let instance = {
  ua: navigator.userAgent,
  lang: (navigator['browserLanguage'] || navigator.language).toLowerCase()
} as device

function isAndroid (): boolean {
  return instance.ua.indexOf('Android') > -1 || instance.ua.indexOf('Linux') > -1
}

function isIOS (): boolean {
  return !!instance.ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

export {
  isAndroid,
  isIOS
}