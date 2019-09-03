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
  Component,
  TokensClazz
} from './token'



type States = TokensClazz

type TokenState = {
  str: string,
  type: States
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

/**
 * 简化tokens列表
 * 去空格，转换 Sqrt() => Number   Power() => Number
 * @param tokens 
 */
export function simplifyTokens (tokens: TokenList): TokenList {
  tokens = tokens.filter(token => token.tag !== Space.TAG)

  return tokens
}


/**
 * 判断token 是否规范化了
 * (a * b) + (c * d + e * f)
 * @param tokens 
 * @param index 
 * 
 */
function tokenNormalized (tokens: TokenList, index: number): boolean {
  let nextToken = tokens[index + 1]
  let nextnextToken = tokens[index + 2]

  if (nextToken instanceof Number && (nextnextToken && (nextnextToken instanceof RParen))) {
    return true
  }

  if (nextToken.tag === LParen.TAG) {
    // find preToken 对应的 lparen token
    let step = index + 1
    let counter = 0
    while (step < tokens.length) {
      if (tokens[step].tag === LParen.TAG) {
        counter++
      }
      if (tokens[step].tag === RParen.TAG) {
        if (--counter === 0) {
          // 找到对应的左括号
          if (step < tokens.length && tokens[step - 1] instanceof RParen) {
            return true
          }
          return false
        }
      }
      step++
    }
  }

  return false
}


/**
 * 规范化token
 * @param tokens 
 * @param index 
 */
function normalizeToken (tokens: TokenList, index: number) {
  let lparenPos = -1
  let rparenPos = -1

  // 寻找 lparenPos
  let preToken = tokens[index - 1]
  if (preToken.tag === Number.TAG) {
    lparenPos = index - 1
  }
  if (preToken.tag === RParen.TAG) {
    // find rparen 对应的 lparen
    let step = index - 1
    let counter = 0
    while (step >= 0) {
      if (tokens[step].tag === RParen.TAG) {
        counter++
      }
      if (tokens[step].tag === LParen.TAG) {
        if (--counter === 0) {
          lparenPos = step
          break
        }
      }
      step--
    }
  }

  // 寻找 rparenPos
  let nextToken = tokens[index + 1]
  if (nextToken.tag === Number.TAG) {
    rparenPos = index + 2
  }
  if (nextToken.tag === LParen.TAG) {
    // 找到 lparen 对应的 rparen
    let step = index + 1
    let counter = 0
    while (step < tokens.length) {
      if (tokens[step].tag === LParen.TAG) {
        counter++
      }
      if (tokens[step].tag === RParen.TAG) {
        if (--counter === 0) {
          rparenPos = step + 1
          break
        }
      }
      step++
    }
  }

  if (lparenPos === -1 || rparenPos === -1) {
    throw new Error('Can\'t normalize token ' + index + ' index of ' + tokens)
  }

  tokens.splice(lparenPos, 0, new LParen(-1))
  tokens.splice(rparenPos+1, 0, new RParen(-1))
}

/**
 * 括号中放同优先级的计算
 * @param token token 列表
 */
export function normalizeTargetTokens (tokens: TokenList, targetTokenTag: string): TokenList {

  let indicator = 0;
  while (indicator < tokens.length) {
    let token = tokens[indicator]
    if (token.tag !== targetTokenTag) {
      indicator++
      continue
    }

    if (!tokenNormalized (tokens, indicator)) {
      normalizeToken(tokens, indicator)
      indicator += 2
      continue
    } 
    indicator++
  }

  return tokens
}

export function normalizeTokens (tokens: TokenList): TokenList {
  // 优先级高的操作，优先处理
  normalizeTargetTokens(tokens, Div.TAG)
  normalizeTargetTokens(tokens, Times.TAG)
  return tokens
}




/**
 * 去括号（用Component代替）
 * @param tokens 
 */
export function componenizeTokens (tokens: TokenList): TokenList {
  let stack: Array<number> = []
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    if (token.tag === LParen.TAG) {
      stack.push(i)
    }
    if (token.tag === RParen.TAG) {
      let stackTop = stack.pop()
      if (stackTop === undefined) {
        throw new Error('括号不匹配')
      }
      let lparenTokenIndex: number = stackTop
      let rparenTokenIndex: number = i
      let num = rparenTokenIndex - lparenTokenIndex + 1
      if (rparenTokenIndex - lparenTokenIndex <= 1) {
        tokens.splice(lparenTokenIndex, num)
      } else {
        let newTokens = tokens.slice(lparenTokenIndex + 1, rparenTokenIndex)
        tokens.splice(lparenTokenIndex, num, new Component(newTokens))
        componenizeTokens(tokens)
      }
      break
    }
  }

  return tokens
}

