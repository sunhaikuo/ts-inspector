import IProp from './IProp'
import IConstructor from './IConstructor'
import IFunction from './IFunction'

interface IClass {
    // 名称
    name: string
    // 注释
    documentation: string
    // 属性
    properties: Array<IProp>
    // 构造方法
    constructor: IConstructor
    // 普通方法
    functions: Array<IFunction>
}
export default IClass
