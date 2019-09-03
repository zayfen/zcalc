/**
 * 一些高级计算函数
 */
import { calcFormula } from './calc'

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

    protected parse(formula: string): MethodRecord {
        let record: MethodRecord = { args: [], start: -1, length: 0 }
        let foundIndex = formula.indexOf(this.name)
        if (foundIndex === -1) {
            return record
        }

        record.start = foundIndex

        let leftParenIndex = foundIndex + this.name.length
        let rightParenIndex = leftParenIndex

        while (formula[leftParenIndex] === ' ') {
            leftParenIndex++
        }

        if (formula[leftParenIndex] !== '(') {
            throw new Error('method call error')
        }

        // find hole arguments
        let counter = 0
        rightParenIndex = leftParenIndex
        let argSepratorPos: Array<number> = []
        while (rightParenIndex < formula.length) {
            if (formula[rightParenIndex] === '(') {
                counter++
            }
            if (formula[rightParenIndex] === ')') {
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
        console.log("leftParenIndex: " + leftParenIndex + " ;rightParenIndex: " + rightParenIndex)
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

