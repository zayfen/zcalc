import { Token, Component, TokenList, Number } from './token'

import { 
parse,
simplifyTokens,
normalizeTokens,
componenizeTokens
} from './parser'


/**
 * 计算表达式
 * @param formula 计算表达式(加减乘除基本表达式)
 */
export function calcFormula (formula: string): number {
  return calc(componenizeTokens(normalizeTokens(simplifyTokens(parse(formula)))))
}

/**
 * 
 * @param tokens 标准化的tokenList
 */
export function calc (tokens: TokenList): number {
  let result: Number = calcTokenList(tokens)

  if (result instanceof Number) {
    return result.value
  }

  throw new Error("calc error: " + result)
}


function calcComponent (component: Component): Number {
  let number = calcTokenList(component.value)
  if (number instanceof Number) {
    return number
  }

  throw new Error("calcTokenList didnt return [Number]: " + number)
}

function calcTokenList (tokenList: TokenList): Number {
  if (tokenList.length <= 0) {
    throw new Error('Empty Token List')
  }

  if (tokenList.length === 1) {
    let token = tokenList[0]
    if  (token instanceof Component) {
      return calcComponent(token)
    }
    if (token instanceof Number) {
      return token
    }
    
    throw new Error("Unknown Or Illegal Token In calcTokenList: " + token.tag)
  }

  for (let i = 0; i < tokenList.length; i++) {
    if (tokenList[i].tag === 'plus') {
        calcPlus(tokenList, i)
        break
    }
    if (tokenList[i].tag === 'minus') {
        calcMinus(tokenList, i)
        break
    }

    if (tokenList[i].tag === 'times') {
        calcTimes(tokenList, i)
        break
    }

    if (tokenList[i].tag === 'div') {
      calcDiv(tokenList, i)
      break
    }
  }

  return calcTokenList(tokenList)
}

function calcPlus (tokenList: TokenList, plusTokenIndex: number): Number {
  let ret: Number

  let leftToken = tokenList[plusTokenIndex-1]
  let rightToken = tokenList[plusTokenIndex+1]
  if (leftToken instanceof Component) {
    leftToken = calcComponent(leftToken)
  }
  if (rightToken instanceof Component) {
    rightToken = calcComponent(rightToken)
  }
  if (leftToken instanceof Number && rightToken instanceof Number) {
    ret = new Number(leftToken.value + rightToken.value, -1)
    tokenList.splice(plusTokenIndex-1, 3, ret)
    return ret
  }
  throw new Error("leftToken and rightToken are not Number(leftToken: " + leftToken.tag + " rightToken:" + rightToken.tag + ")")
}


function calcMinus (tokenList: TokenList, plusTokenIndex: number): Number {
  let ret: Number

  let leftToken = tokenList[plusTokenIndex-1]
  let rightToken = tokenList[plusTokenIndex+1]
  if (leftToken instanceof Component) {
    leftToken = calcComponent(leftToken)
  }
  if (rightToken instanceof Component) {
    rightToken = calcComponent(rightToken)
  }

  if (leftToken instanceof Number && rightToken instanceof Number) {
    ret = new Number(leftToken.value - rightToken.value, -1)
    tokenList.splice(plusTokenIndex-1, 3, ret)
    return ret
  }
  throw new Error("leftToken and rightToken are not Number(leftToken: " + leftToken.tag + " rightToken:" + rightToken.tag + ")")
}


function calcTimes (tokenList: TokenList, plusTokenIndex: number): Number {
  let ret: Number

  let leftToken = tokenList[plusTokenIndex-1]
  let rightToken = tokenList[plusTokenIndex+1]
  if (leftToken instanceof Component) {
    leftToken = calcComponent(leftToken)
  }
  if (rightToken instanceof Component) {
    rightToken = calcComponent(rightToken)
  }
  if (leftToken instanceof Number && rightToken instanceof Number) {
    ret = new Number(leftToken.value * rightToken.value, -1)
    tokenList.splice(plusTokenIndex-1, 3, ret)
    return ret
  }
  
  throw new Error("leftToken and rightToken are not Number(leftToken: " + leftToken.tag + " rightToken:" + rightToken.tag + ")")
}


function calcDiv (tokenList: TokenList, plusTokenIndex: number): Number {
  let ret: Number

  let leftToken = tokenList[plusTokenIndex-1]
  let rightToken = tokenList[plusTokenIndex+1]
  if (leftToken instanceof Component) {
    leftToken = calcComponent(leftToken)
  }
  if (rightToken instanceof Component) {
    rightToken = calcComponent(rightToken)
  }
  if (leftToken instanceof Number && rightToken instanceof Number) {
    ret = new Number(leftToken.value / rightToken.value, -1)
    tokenList.splice(plusTokenIndex-1, 3, ret)
    return ret
  }
  throw new Error("leftToken and rightToken are not Number(leftToken: " + leftToken.tag + " rightToken:" + rightToken.tag + ")")
}