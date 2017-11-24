import IProp from './IProp'
// 方法
interface IFunction {
    // 名称
    name: string
    // 参数
    parameters: Array<IProp>
    // 返回类型
    returnType: string
    // 修饰符
    decorate: string
    // 注释
    documentation: string
    // 是否为静态方法
    static: boolean
}

export default IFunction
