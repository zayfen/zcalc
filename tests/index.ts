import { MethodPreprocess } from '../lib/method_preprocess'
import { Sqrt, BaseMethod } from '../lib/math_methods'
import { parse, simplifyTokens, componenizeTokens, normalizeTokens } from '../lib/parser';
import { calcFormula, calcSimpleFormula } from '../lib/calc';
import { tokenList2formula } from '../lib/utils';
import { ZCalc } from '../lib';

// 简单的计算表达式求值
const simpleExpr = '1 + 2.5 * (4 + 4) / 2' // expect: 11
console.log(calcSimpleFormula(simpleExpr)) // output: 11


// 计算表达式解析 与 求值
const expr = '(1.03 + 322 * 400 - (4 + 3.00 * 9.77 / (3.00 - 5)  ) * 788 - (.1 - .2))' // expect: 137197.27

console.log("result: " + calcFormula(expr)) // output: 137197.27


let tokens = parse(expr)

console.log(tokens)

console.log(simplifyTokens(parse(expr)))
console.log(tokenList2formula(normalizeTokens(simplifyTokens(parse(expr)))))
console.log(componenizeTokens(simplifyTokens(parse(expr))))

console.log("\n\n\n")

const expr2 = '(1)' // expect: 1
console.log(normalizeTokens(simplifyTokens(parse(expr2))))
console.log(tokenList2formula(normalizeTokens(simplifyTokens(parse(expr2)))))
console.log(componenizeTokens(normalizeTokens(simplifyTokens(parse(expr2)))))
console.log(calcFormula(expr2)) // output: 1


console.log("\n\n\n")

// 高级函数支持
let process = new MethodPreprocess()
process.registerMethod(new Sqrt())
const advExpr = '3 + 2 * sqrt(sqrt(100 * 100 / 1)) + sqrt(100)' // expect:3 33
console.log(process.process(advExpr))
console.log(calcFormula(advExpr)) // output: 33


// 自定义高级函数支持

const zcalc = new ZCalc()

class Model extends BaseMethod {
  name:string = 'model'
  protected calc(record: { args: string[]; start: number; length: number; }): number {
    if (record.args.length !== 2) {
      throw new Error(" Model arguments error, expect 2 but found " + record.args.length)
    }
    return calcFormula(record.args[0]) % calcFormula(record.args[1])
  }
}

// 注册 Model
zcalc.addMathMethod(new Model)

// 定义含有自定义高级函数的表达式
const customFormula: string = ' 1 + model( 100, model(200, 400) ) * 10' // expect：1001
console.log(zcalc.calc(customFormula)) // output: 1001
