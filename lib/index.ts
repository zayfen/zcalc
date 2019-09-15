
import {
  calcFormula, calcSimpleFormula
} from './calc'


import {
  makeMethodProcess, MethodPreprocess
} from './method_preprocess'
import { BaseMethod } from './math_methods';

class ZCalc {
  methodProcess: MethodPreprocess<BaseMethod> = makeMethodProcess()

  public addMathMethod(method: BaseMethod) {
    this.methodProcess.registerMethod(method)
  }

  public calc (formula: string): number {
    return calcFormula(formula, this.methodProcess)
  }
}

// 继承BaseMethod， 实现calc, 可以自定义高级函数
export { ZCalc, BaseMethod, calcFormula, calcSimpleFormula }



