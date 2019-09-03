# zcalc
表达式计算器

## Usage Example
```typescript

const expr = '(1.03 + 322 * 400 - (4 + 3.00 * 9.77 / (3.00 - 5)  ) * 788 - (.1 - .2))'
let tokens = parse(expr)
console.log(tokens)

console.log(simplifyTokens(tokens))

console.log(componenizeTokens(simplifyTokens(tokens)))

console.log(calcFormula(expr))

console.log("\n\n\n")

const expr2 = '(1)'
console.log(normalizeTokens(simplifyTokens(parse(expr2))))
console.log(tokenList2formula(normalizeTokens(simplifyTokens(parse(expr2)))))
console.log(componenizeTokens(normalizeTokens(simplifyTokens(parse(expr2)))))

console.log(calcFormula(expr2))

```

### 高级函数支持 (支持自定义高级函数扩展)
```typescript
// 高级函数支持
let process = new MethodPreprocess()
process.registerMethod(new Sqrt())
const advExpr = '3 + 2 * sqrt(sqrt(100 * 100 / 1)) + sqrt(100)'
console.log(process.process(advExpr))
console.log(calcFormula(advExpr))

```

