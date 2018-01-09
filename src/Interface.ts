import IProp from './IProp'

interface Interface {
    // 名称
    name: string
    // 注释
    documentation: string
    // 属性
    properties: Array<IProp>
}
export default Interface
