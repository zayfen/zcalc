/**
 * 替换formula中的一些函调调用，
 * 1 + sqrt(1 + 3) => 1 + 2
 */
import { BaseMethod, Sqrt } from './math_methods'

export class MethodPreprocess<T extends BaseMethod> {
  methods: Array<T> = []
  constructor() {

  }

  public registerMethod(method: T) {
    this.methods.push(method)
  }

  public process(formula: string): string {
    if (formula === '') {
      return formula
    }

    let currFormula: string = formula
    let lastFormula: string = ''

    while (lastFormula !== formula) {
      this.methods.forEach(method => {
        lastFormula = currFormula
        currFormula = method.pipe(currFormula)
      })
    }

    return currFormula
  }
}

export function makeMethodProcess(): MethodPreprocess<BaseMethod> {
  let process: MethodPreprocess<BaseMethod> = new MethodPreprocess()
  process.registerMethod(new Sqrt())

  return process
}

