interface IConfig {
    // 不需要检查的文件名
    whiteList?: Array<String>
    // 需要检查的文件或文件夹路径
    path: string
    // 输出.d.ts文件的文件路径
    output?: string
}

export default IConfig
