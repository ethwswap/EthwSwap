// type.d.ts文件中
declare interface Window {
  web3: any,
  Web3: any,
  ethereum: any
}

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer;
