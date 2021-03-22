export declare interface InstallerOptions {
  namespace: string
}

let instance = {
  namespace: 'app'
} as InstallerOptions

const setConfig = (option: InstallerOptions): void => {
  instance = option
}

const getConfig = (): InstallerOptions => {
  return instance
}

export {
  getConfig,
  setConfig
}