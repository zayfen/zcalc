/**
 * 一些高级计算函数
 */
import { calcFormula } from './calc'
import { Plus, Minus, Times, Div, LParen, RParen, Space } from './token'

type MethodRecord = {
  args: Array<string>,
  start: number,
  length: number
}

interface Method {
  name: string,
  pipe: (formula: string) => string
}

export abstract class BaseMethod implements Method {
  name: string = ''
  protected abstract calc(record: MethodRecord): number

  private findMethodIndex(formula: string, startPos: number): number {
    // console.log("findMethodIndex: ", formula, " ;startPos: ", startPos)

    let index: number = -1
    index = formula.indexOf(this.name, startPos)
    if (index === -1) {
      return -1
    }

    let preChar = formula[index - 1]
    let nextChar = formula[index + this.name.length]
    if ([Space.TAG_VALUE, Plus.TAG_VALUE, Minus.TAG_VALUE, Times.TAG_VALUE, Div.TAG_VALUE, LParen.TAG_VALUE, void 0].indexOf(preChar) > -1 &&
      [Space.TAG_VALUE, LParen.TAG_VALUE].indexOf(nextChar) > -1) { // valid
      return index
    }

    // skip this method
    startPos = this.skipMethod(formula, index)
    return this.findMethodIndex(formula, startPos)
  }

  private skipMethod(formula: string, methodIndex: number): number {
    // find first '('
    let len = formula.length
    let firstLParenIndex = -1
    while (++firstLParenIndex < len) {
      if (formula[firstLParenIndex] === LParen.TAG_VALUE) {
        break;
      }
    }

    let matchRParenIndex = firstLParenIndex
    let counter = 0
    while (matchRParenIndex < len) {
      if (formula[matchRParenIndex] === LParen.TAG_VALUE) {
        counter++
      }
      if (formula[++matchRParenIndex] === RParen.TAG_VALUE) {
        counter--
        if (counter <= 0) {
          break
        }
      }
    }

    return matchRParenIndex
  }

  protected parse(formula: string): MethodRecord {
    let record: MethodRecord = { args: [], start: -1, length: 0 }
    // let foundIndex = formula.indexOf(this.name)
    let foundIndex = this.findMethodIndex(formula, 0)
    if (foundIndex === -1) {
      return record
    }

    record.start = foundIndex

    let leftParenIndex = foundIndex + this.name.length
    let rightParenIndex = leftParenIndex

    while (formula[leftParenIndex] === Space.TAG_VALUE) {
      leftParenIndex++
    }

    if (formula[leftParenIndex] !== LParen.TAG_VALUE) {
      throw new Error('method call error')
    }

    // find hole arguments
    let counter = 0
    rightParenIndex = leftParenIndex
    let argSepratorPos: Array<number> = []
    while (rightParenIndex < formula.length) {
      if (formula[rightParenIndex] === LParen.TAG_VALUE) {
        counter++
      }
      if (formula[rightParenIndex] === RParen.TAG_VALUE) {
        if (--counter === 0) {
          // find the rightParen
          argSepratorPos.push(rightParenIndex) // 参数分割记录
          record.length = rightParenIndex - record.start + 1
          break
        }
      }

      if (formula[rightParenIndex] === ',' && counter === 1) { // 最外层的逗号，分割参数的
        argSepratorPos.push(rightParenIndex)
      }
      rightParenIndex++
    }
    if (counter !== 0) {
      throw new Error("formula is illegal: " + formula)
    }

    let argsIndicator = leftParenIndex + 1
    argSepratorPos.forEach(pos => {
      let args = formula.slice(argsIndicator, pos)
      record.args.push(args)
      argsIndicator = pos + 1
    })

    return record
  }

  public pipe(formula: string): string {
    let record: MethodRecord = this.parse(formula)
    if (record.start === -1) { // 没有这个方法了
      return formula
    }

    let value: number = this.calc(record)
    let methodstr: string = formula.slice(record.start, record.start + record.length)
    return formula.replace(methodstr, '' + value)
  }
}



export class Sqrt extends BaseMethod {
  name: string = 'sqrt'
  public calc(record: MethodRecord): number {
    let arg: string = record.args[0]
    return Math.sqrt(calcFormula(arg))
  }
}

