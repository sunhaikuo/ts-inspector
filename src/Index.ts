import Verify from './Verify'
import CreateTS from './CreateTS'
import * as ora from 'ora'
import * as path from 'path'
import * as prettier from 'prettier'
import IConfig from './IConfig'
class Index {
    private config: IConfig
    constructor(config: IConfig) {
        // 合并config文件
        this.config = this.merge(config)
    }
    private merge(config: IConfig) {
        let defaultConfig: IConfig = {
            path: '',
            output: '',
            whiteList: ['index', '.DS_Store']
        }
        for (let key in config) {
            if (config[key]) {
                defaultConfig[key] = config[key]
            }
        }
        return defaultConfig
    }
    public run() {
        let checkResult = this.check()
        if (checkResult && this.config.output !== '') {
            this.write(this.config)
        }
    }

    public check() {
        let isGit = false
        if (this.config.output === '') {
            isGit = true
        }
        let v = new Verify(this.config.path, this.config.whiteList, isGit)
        return v.verify()
    }

    public write(config: IConfig) {
        console.log('--------------------------------------')
        let ts = new CreateTS(config)
        const spinner = ora('已生成' + config.output + '文件! ')
        spinner.start()
        ts.createTS()
        console.log('✅')
        spinner.stop()
    }
}
// let index = new Index({
//     path: path.resolve(__dirname, 'User.ts'),
//     output: path.resolve(__dirname, '../types/util.d.ts')
// })

// index.run()
export = Index
