import { TokenList } from './token'

export function tokenList2formula (tokenList: TokenList): string {
  let formula: Array<string> = []
  tokenList.forEach(token => formula.push(token.value as string))
  return formula.join(' ')
}


export function printError (formular: string, position: number, len: number) {
  console.log(formular)
  let spaces = Array.prototype.map.call({length: position}, () => ' ').join()
  let errDesc = '^'
  for (let i = 1; i < len; i++) {
    errDesc += '^'
  }
  console.log(spaces + errDesc)
}

export interface Clazz<T> extends Function {
  new (...args: any[]): T;
}