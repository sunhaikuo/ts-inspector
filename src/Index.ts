import Verify from './Verify'
import CreateTS from './CreateTS'
import * as ora from 'ora'
import * as path from 'path'
import IConfig from './IConfig'
class Index {
    private config: IConfig
    private isGit: boolean
    constructor(config: IConfig) {
        // 合并config文件
        this.config = this.merge(config)
        this.isGit = this.checkIsGit()
    }
    private checkIsGit(): boolean {
        // 检查参数,如果是git提交,则不抛出Error,这是为了提高阅读
        let args = process.argv.splice(2)
        let isGit = args.length === 0 ? false : true
        return isGit
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
        // 生成.d.ts文件的条件是：代码规范、有输出路径、不是git做检查
        if (checkResult && this.config.output !== '' && !this.isGit) {
            this.write(this.config)
        }
    }

    private check() {
        let v = new Verify(this.config.path, this.config.whiteList, this.isGit)
        return v.verify()
    }

    private write(config: IConfig) {
        console.log('--------------------------------------')
        let ts = new CreateTS(config)
        const spinner = ora('已生成' + config.output + '文件! ')
        spinner.start()
        ts.createTS()
        console.log('✅')
        spinner.stop()
    }
}
export default Index
