# zcalc
表达式计算器

## Usage Example

### 简单的计算表达式求值
```typescript
const simpleExpr = '1 + 2.5 * (4 + 4) / 2' // expect: 11
console.log(calcSimpleFormula(simpleExpr)) // output: 11
```

### 简单的计算表达式求值 及 过程展示
```typescript

const expr = '(1.03 + 322 * 400 - (4 + 3.00 * 9.77 / (3.00 - 5)  ) * 788 - (.1 - .2))' // expect: 137197.27
console.log("result: " + calcFormula(expr)) // output: 137197.27

console.log(parse(expr))
console.log(simplifyTokens(parse(expr)))
console.log(tokenList2formula(normalizeTokens(simplifyTokens(parse(expr)))))
console.log(componenizeTokens(simplifyTokens(parse(expr))))


const expr2 = '(1)' // expect: 1
console.log(normalizeTokens(simplifyTokens(parse(expr2))))
console.log(tokenList2formula(normalizeTokens(simplifyTokens(parse(expr2)))))
console.log(componenizeTokens(normalizeTokens(simplifyTokens(parse(expr2)))))
console.log(calcFormula(expr2)) // output: 1

```

### 高级函数支持 (目前内置的只支持 sqrt)
```typescript
// 高级函数支持
let process = new MethodPreprocess()
process.registerMethod(new Sqrt())
const advExpr = '3 + 2 * sqrt(sqrt(100 * 100 / 1)) + sqrt(100)' // expect: 33
console.log(process.process(advExpr))
console.log(calcFormula(advExpr)) // output: 33

```


### 自定义高级函数支持
```typescript 

const zcalc = new ZCalc()

// 自定义高级函数，需要继承BaseMethod, 并且制定 name 和 实现 calc方法
class Mode extends BaseMethod {
  name:string = 'mode'
  protected calc(record: { args: string[]; start: number; length: number; }): number {
    if (record.args.length !== 2) {
      throw new Error(" Mode arguments error, expect 2 but found " + record.args.length)
    }
    return calcFormula(record.args[0]) % calcFormula(record.args[1])
  }
}

// 注册 Model
zcalc.addMathMethod(new Mode)

// 定义含有自定义高级函数的表达式
const customFormula: string = ' 1 + mode( 100, mode(200, 400) ) * 10' // expect：1001
console.log(zcalc.calc(customFormula)) // output: 1001

```

