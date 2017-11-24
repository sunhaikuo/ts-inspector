import Verify from './Verify'
import CreateTS from './CreateTS'
import * as ora from 'ora'
class Index {
    constructor() {
        // 检查参数,如果是git提交,则不抛出Error,这是为了提高阅读
        let args = process.argv.splice(2)
        let isGit = args.length === 0 ? false : true

        let path = '../../src'
        let v = new Verify(path, isGit)
        let isSuccess = v.verify()
        if (isSuccess && !isGit) {
            console.log('--------------------------------------')
            const spinner = ora('已生成/types/mtime-util.d.ts文件! ')
            spinner.start()
            let ts = new CreateTS(path)
            ts.createTS()
            console.log('✅')
            spinner.stop()
        }
    }
}

new Index()
