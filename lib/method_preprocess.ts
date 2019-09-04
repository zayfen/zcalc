/**
 * 替换formula中的一些函调调用，
 * 1 + sqrt(1 + 3) => 1 + 2
 */
import { BaseMethod, Sqrt } from './math_methods'

export class MethodPreprocess<T extends BaseMethod> {
  methods: Array<T> = []
  constructor() {

  }

  /**
   * 检测method是否合法
   * @param method 
   */
  private checkMethodValid (method: T) {
    if (method.name === '') {
      throw new Error('method must has name property: ' + method)
    }
    this.methods.forEach(_method => {
      if (_method.name === method.name) {
        throw new Error('method name already existed: ' + method.name)
      }
    })
  }

  /**
   * 计算新数学方法
   * @param method 
   */
  public registerMethod(method: T) {
    this.methods.push(method)
  }

  public process(formula: string): string {
    if (formula === '') {
      return formula
    }

    let currFormula: string = formula
    let lastFormula: string = ''

    while (lastFormula !== currFormula) {
      console.log("last: " + lastFormula + " ;current: " + currFormula)
      this.methods.forEach(method => {
        lastFormula = currFormula
        currFormula = method.pipe(currFormula)
      })
    }

    return currFormula
  }
}


/**
 * 
 * @param process 注册内置的高级函数支持
 */
function registerInternalMethods (process: MethodPreprocess<BaseMethod>) {
  process.registerMethod(new Sqrt)
}


let singleInstanceHandler = (function singleMethodProcessInstance () {
  let process: MethodPreprocess<BaseMethod>

  return function () {
    if (!process) {
      process = new MethodPreprocess ()
      registerInternalMethods(process)
    }
    return process
  }
})()

/**
 * 返回单例MethodPreProcess对象
 */
export function makeMethodProcess(): MethodPreprocess<BaseMethod> {
  return singleInstanceHandler()
}

