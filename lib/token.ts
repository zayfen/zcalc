

export interface Token<T> {
  tag: string,
  value: T,
  position: number
}

export type TokenList = Array<Token<number | string> | Component>

export class Number implements Token<number> {
  tag: string = 'number'
  value: number
  position: number = -1

  constructor (value: number, pos: number) {
    this.value = value
    this.position = pos
  }
}


export class Plus implements Token<string> {
  tag: string = 'plus'
  value: string = '+'
  position: number = -1
  
  constructor (pos: number) {
    this.position = pos
  }
}

export class Minus implements Token<string> {
  tag: string = 'minus'
  value: string = '-'
  position: number = -1

  constructor (pos: number) {
    this.position = pos
  }
}

export class Times implements Token<string> {
  tag: string = 'times'
  value: string = '*'
  position: number = -1

  constructor (pos: number) {
    this.position = pos
  }
}

export class Div implements Token<string> {
  tag: string = 'div'
  value: string = '/'
  position: number = -1

  constructor (pos: number) {
    this.position = pos
  }
}

export class LParen implements Token<string> {
  tag: string = 'lparen'
  value: string = '('
  position: number = -1

  constructor (pos: number) {
    this.position = pos
  }
}

export class RParen implements Token<string> {
  tag: string = 'rparen'
  value: string = ')'
  position: number = -1

  constructor (pos: number) {
    this.position = pos
  }
}

export class Space implements Token<string> {
  tag: string = 'space'
  value: string = ' '
  position: number = -1

  constructor (pos: number) {
    this.position = pos
  }
}


export class Component implements Token<TokenList> {
  tag = 'component'
  value: TokenList
  position = -1

  constructor (tokens: TokenList) {
    this.value = tokens
  }
}

export class Nop implements Token<string> {
  tag: string = 'nop'
  value: string = ''
  position: number = -1
}

