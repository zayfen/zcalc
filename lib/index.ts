import { 
  parse, 
  simplifyTokens, 
  componenizeTokens,
  normalizeTokens
} from './parser'

import {
  calcFormula
} from './calc'

import { tokenList2formula } from './utils'

// reexport interface
export default calcFormula



//////////////////////////////////////////////////////////////////////////////////////////
const expr = '(1.03 + 322 * 400 - (4 + 3.00 * 9.77 / (3.00 - 5)  ) * 788 - (.1 - .2))'
let tokens = parse(expr)
console.log(tokens)

console.log(simplifyTokens(tokens))

console.log(componenizeTokens(simplifyTokens(tokens)))

console.log("\n\n\n")
const expr2 = '(1)'
console.log(normalizeTokens(simplifyTokens(parse(expr2))))
console.log(tokenList2formula(normalizeTokens(simplifyTokens(parse(expr2)))))
console.log(componenizeTokens(normalizeTokens(simplifyTokens(parse(expr2)))))

console.log(calcFormula(expr2))




