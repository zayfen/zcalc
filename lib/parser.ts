import {
  Token,
  TokenList,
  Number,
  Plus,
  Minus,
  Times,
  Div,
  LParen,
  RParen,
  Nop,
  Space,
  Component
} from './token'

interface Clazz<T> extends Function {
  new (...args: any[]): T;
}

type States = Clazz<Number> | Clazz<Plus> | Clazz<Minus> | Clazz<Times> | Clazz<Div> | Clazz<LParen> | Clazz<RParen> | Clazz<Nop> | Clazz<Space>

type TokenState = {
  str: string,
  type: States
}

function printError (expr: string, position: number, len: number) {
  console.log(expr)
  let spaces = Array.prototype.map.call({length: position}, () => ' ').join()
  let errDesc = '^'
  for (let i = 1; i < len; i++) {
    errDesc += '~'
  }
  console.log(spaces + errDesc)
}

function recordToken (tokens: TokenList, tokenState: TokenState, position: number) {
  switch (tokenState.type) {
    case Plus:
      tokens.push(new Plus(position))
      break
    case Minus:
      tokens.push(new Minus(position))
      break
    case Times:
      tokens.push(new Times(position))
      break
    case Div:
      tokens.push(new Div(position))
      break
    case LParen:
      tokens.push(new LParen(position))
      break
    case RParen:
      tokens.push(new RParen(position))
      break
    case Number:
      tokens.push(new Number(+tokenState.str, position))
      break
    case Space:
      tokens.push(new Space(position))
      break
    default:
      throw new Error("Found unknow token when recording: (" + position + "," + tokenState.str + ")")
  }
}



export function parse (expr: string): TokenList {
  let tokens: TokenList = []

  let position = 0
  const exprLen: number = expr.length

  let currState: States = Nop
  let tokenState: TokenState = {
    str: '',
    type: Nop
  }

  while (position < exprLen) {

    // 上一个token解析结束
    if (currState === Nop && tokenState.type !== Nop) {
      recordToken(tokens, tokenState, position - tokenState.str.length)
      tokenState = { str: '', type: Nop }
    }

    let currChar = expr[position++]
    switch (currChar) {
      case '+':
        tokenState.type = Plus
        tokenState.str = currChar
        currState = Nop
        break

      case '-':
        tokenState.type = Minus
        tokenState.str = currChar
        currState = Nop
        break

      case '*':
        tokenState.type = Times
        tokenState.str = '*'
        currState = Nop
        break

      case '/':
        tokenState.type = Div
        tokenState.str = '/'
        currState = Nop
        break

      case '(':
        tokenState.type = LParen
        tokenState.str = '('
        currState = Nop
        break

      case ')':
        tokenState.type = RParen
        tokenState.str = ')'
        currState = Nop
        break
      
      case ' ':
        tokenState.type = Space
        tokenState.str = ' '
        currState = Nop
        break

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '.':
        if (currState === Nop || currState === Number) {
          currState = Number
          tokenState.type = Number
          tokenState.str += currChar

          // 下一个字符不是数字或者点号，则表示 number token解析结束
          let nextChar = expr[position]
          if (nextChar === '.' && tokenState.str.indexOf('.') > -1) {
            throw new Error("It\'s not a number: " + tokenState.str + nextChar);
          }

          if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].indexOf(nextChar) === -1) {
            currState = Nop
          }

        }
        break;
      
      default: 
        throw new Error('Unknown token: ' + currChar)
    }
  }

  // 记录最后一个token
  if (currState === Nop && tokenState.type !== Nop) {
    recordToken(tokens, tokenState, position - tokenState.str.length)
    tokenState = { str: '', type: Nop }
  }

  return tokens
}


export function simplifyTokens (tokens: TokenList): TokenList {
  return tokens.filter(token => token.tag !== 'space')
}

function calcParensInsertPos (tokens: TokenList, index: number): { lparenPos: number, rparenPos: number } {
  let lparenPos = -1
  let rparenPos = -1

  // pre token
  let preToken = tokens[index - 1]
  if (preToken.tag === 'number' || preToken.tag === 'lparen') {
    lparenPos = index - 1
  }

  if (preToken.tag === 'rparen') {
    // 找到这个右括号对应的左括号
    let counter = 0
    let step = index - 1;
    while (step > 0) {
      if (tokens[step].tag === 'rparen') {
        counter++
      }
      if (tokens[step].tag === 'lparen') {
        if (--counter === 0) { // 找到对应的左括号
          lparenPos = step
          break
        }
      }

      step-- // step backward
    }
  }

  if (lparenPos === -1) {
    throw new Error("Can't find left parenthese of " + preToken)
  }


  let nextToken = tokens[index + 1]
  if (nextToken.tag === 'number' || nextToken.tag === 'rparen') {
    rparenPos = index + 2
  }
  if (nextToken.tag === 'lparen') {
    // 找到这个左括号对应的右括号
    let counter = 0
    let step = index + 1
    while (step < tokens.length) {
      if (tokens[step].tag === 'lparen') {
        counter++
      }
      if (tokens[step].tag === 'rparen') {
        if (--counter === 0) { // 找到对应的右括号
          rparenPos = step + 1
        }
      }
      step++ // step forward 
    }
  }
  
  if (rparenPos === -1) {
    throw new Error("Can't find right parenthese of " + nextToken)
  }

  return { lparenPos, rparenPos }
}

/**
 * 高优先级的运算用括号括起来, 
 * @param token token 列表
 */
export function insertParens (tokens: TokenList): TokenList {
  let _tokens: TokenList = []  

  let index = tokens.findIndex((token) => token.tag === 'times' || token.tag === 'div')
  let pos = calcParensInsertPos(tokens, index)
  
  return _tokens
}


/**
 * 去括号（用Component代替）
 * @param tokens 
 */
export function componenizeTokens (tokens: TokenList): TokenList {
  let stack: Array<number> = []
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    if (token.tag === 'lparen') {
      stack.push(i)
    }
    if (token.tag === 'rparen') {
      let lparenTokenIndex = stack.pop()
      let rparenTokenIndex = i
      let num = rparenTokenIndex - lparenTokenIndex + 1
      if (rparenTokenIndex - lparenTokenIndex <= 1) {
        tokens.splice(lparenTokenIndex, num)
      } else {
        let newTokens = Array.from(tokens.slice(lparenTokenIndex + 1, rparenTokenIndex))
        tokens.splice(lparenTokenIndex, num, new Component(newTokens))
        componenizeTokens(tokens)
      }
      break
    }
  }

  return tokens
}