import { parse, simplifyTokens } from './parser'


const expr = '1.03 + 322 * 400 - (4 + 3.00 * 9.77 / 3.00  ) * 788 - .1'
let tokens = parse(expr)
console.log(tokens)

console.log(simplifyTokens(tokens))
