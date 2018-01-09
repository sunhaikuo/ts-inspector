// let Index = require('./lib/Index')
// let fs = require('fs-extra')
// let path = require('path')

import Index from './src/Index'
import * as fs from 'fs-extra'
import * as path from 'path'
import IConfig from './src/IConfig'

class Inspector {
    private config: IConfig
    constructor(config: IConfig) {
        // 如果输入路径如果是空
        if (!config.path) {
            throw new Error('要检查的文件路径为空！')
        }
        // 如果路径不存在
        if (!fs.existsSync(config.path)) {
            throw new Error(config.path + '文件路径不存在！')
        }
        // 检查输出路径
        // if (!config.output) {
        //     throw new Error(config.output + '文件路径为空！')
        // }
        this.config = config
    }
    public start() {
        let index = new Index({
            path: this.config.path,
            output: this.config.output
        })
        index.run()
    }
}
export { Inspector }
