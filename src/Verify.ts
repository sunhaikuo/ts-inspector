/**
 * 通用
 *      1.参数/变量 要有类型
 *      2.参数/变量/类/方法/接口 要有注释
 *      3.尽量不要使用any
 *      4.注释和参数的数量要匹配
 * Class校验
 *      1.类名要和文件名一致
 *      2.不能直接使用export default class Test
 *      3.类名的首字母要大写
 * 方法检验
 *      1.要显示的写返回值
 *      2.要显示的写修饰符:public/private
 *      3.首字母要小写
 * 接口
 *      1.要以大写字母I开头
 */
import * as fs from 'fs-extra'
import IClass from './IClass'
import IProp from './IProp'
import IFun from './IFunction'
import ca from './ClassAnalyst'
import File from '../../src/node/MFile'
import config from './config'
import * as ora from 'ora'
enum Type {
    class = 1,
    property = 2,
    constructor = 3,
    function = 4
}
enum Level {
    error = 1,
    warn = 2
}
interface IClassError {
    code: string
    message: string
    extraInfo: string
}
interface IPropError {
    code: string
    className: string
    funName: string
    propName: string
    message: string
    extraInfo?: string
}
interface IFunError {
    code: string
    className: string
    message: string
    extraInfo: string
}
interface IError {
    /**
     * 哪种类型:Core/Class/Property/Function
     */
    // className: string
    level: Level
    message: string
    propName?: string
    funName?: string
}

const errors: any = config.errors

class Verify {
    filePath: string
    isGit: boolean
    /**
     * 构造方法
     * @param filePath 文件/文件夹路径
     */
    constructor(filePath: string, isGit: boolean) {
        // let result = ca.init('../../src/File.ts')
        // console.log(result)
        // console.log(error.C001)
        // this.test()
        // let cst: IFun = json.constructor
        // cst.name = 'constructor'
        // cst.decorate = 'private'
        // const result = this.checkFunction(cst)
        // this.printError(result)
        // ../../src/web/Url.ts

        this.filePath = filePath
        this.isGit = isGit
    }
    /**
     * 校验文件
     */
    public verify(): boolean {
        const paths = File.getFiles(this.filePath, true, true)
        const fileNames = File.getFiles(this.filePath, false, false)
        const whiteList = config.whiteList
        let isSuccess = true
        for (let i = 0; i < paths.length; i++) {
            let myPath = paths[i]
            let fileName = fileNames[i]
            // console.log(fileName, whiteList, whiteList.indexOf(fileName))
            if (whiteList.indexOf(fileName) > -1) {
                continue
            }
            // 输出
            let msg = '正在检查' + fileName + '.ts ...'
            const spinner = ora(msg)
            spinner.start()

            let json = ca.init(myPath)
            let filePath = './json/' + fileName + '.json'
            fs.createFileSync(filePath)
            fs.writeJSONSync(filePath, json)
            const resultC = this.checkClass(json, fileName)
            const resultP = this.checkProperties(json)
            const resultF = this.checkFunctions(json)
            if (resultC === null && resultP === null && resultF === null) {
                console.log(this.addSpace(20, msg) + '✅')
            } else {
                // 有错误
                isSuccess = false
                console.log(this.addSpace(20, msg) + '❌')
                spinner.stop()
                this.printError(resultC)
                this.printError(resultP)
                this.printError(resultF)
                if (this.isGit) {
                    throw new Error('👁请参照提示检查代码规范!')
                }
                break
            }
            spinner.stop()
        }
        return isSuccess
    }
    public checkClass(ci: IClass, fileName: string) {
        let classError = {} as IPropError
        if (ci.name === '') {
            classError.code = 'C001'
            classError.message = errors.C001
            classError.extraInfo = '当前名称为:' + ci.name
            return classError
        }
        if (ci.name === 'default') {
            classError.code = 'C002'
            classError.message = errors.C002
            return classError
        }
        let reg = /^[A-Z]/
        if (!reg.test(ci.name)) {
            classError.code = 'C003'
            classError.message = errors.C003
            classError.extraInfo = '当前名称为:' + ci.name
            return classError
        }
        if (fileName !== ci.name) {
            classError.code = 'C004'
            classError.message = errors.C004
            classError.extraInfo =
                '文件名称为:' + fileName + '.ts, class名称为:' + ci.name
            return classError
        }
        if (ci.documentation === '') {
            classError.code = 'C005'
            classError.message = errors.C005
            classError.extraInfo = '当前名称为:' + ci.name
            return classError
        }
        return null
    }
    /**
     * 检查Properties
     * @param ci class信息
     */
    public checkProperties(ci: IClass) {
        let props: Array<IProp> = ci.properties
        let result = {} as IPropError
        let hasError = false
        for (let i = 0; i < props.length; i++) {
            result = this.checkProperty(props[i], ci.name, '')
            if (result) {
                hasError = true
                break
            }
        }
        if (hasError) {
            return result
        } else {
            return null
        }
    }
    /**
     * 检查属性和方法参数
     * @param prop prop对象
     * @param className class名称
     * @param funName 方法名称
     */
    public checkProperty(prop: IProp, className: string, funName: string) {
        let propErr = {} as IPropError
        propErr.className = className
        propErr.funName = funName
        propErr.propName = prop.name
        if (prop.name === '') {
            propErr.code = 'P001'
            propErr.message = errors.P001
            return propErr
        }
        if (prop.documentation === '') {
            propErr.code = 'P002'
            propErr.message = errors.P002
            return propErr
        }
        if (prop.type === '') {
            propErr.code = 'P003'
            propErr.message = errors.P003
            return propErr
        }
        // if (prop.type === 'any') {
        //     propErr.code = 'P004'
        //     propErr.message = errors.P004
        //     return propErr
        // }
        return null
    }
    public checkFunctions(ci: IClass) {
        let funs = ci.functions
        let err = null
        for (let i = 0; i < funs.length; i++) {
            let fun = funs[i]
            err = this.checkFunction(fun)
            if (err) {
                err.className = ci.name
                break
            }
        }
        return err
    }
    public checkFunction(fun: IFun): IFunError | IPropError {
        let funErr = {} as IFunError
        funErr.extraInfo = '方法名：' + fun.name
        if (fun.returnType === '') {
            funErr.code = 'F001'
            funErr.message = errors.F001
            return funErr
        }
        if (fun.decorate === '') {
            funErr.code = 'F002'
            funErr.message = errors.F002
            return funErr
        }
        let reg = /^[A-Z]/
        if (reg.test(fun.name)) {
            console.log(fun.name)
            funErr.code = 'F003'
            funErr.message = errors.F003
            return funErr
        }
        if (fun.documentation === '') {
            funErr.code = 'F042'
            funErr.message = errors.F004
            return funErr
        }
        let params = fun.parameters
        let propErr = null
        for (let i = 0; i < params.length; i++) {
            let param = params[i]
            propErr = this.checkProperty(param, '', fun.name)
            if (propErr) {
                break
            }
        }
        return propErr
    }
    public printError(err: IPropError): boolean {
        let hasError = false
        // let errorMsg = ''
        err = this.sortError(err)
        for (let key in err) {
            // console.log('key=' + key + ' val=' + err[key])
            if (err[key] === '') {
                continue
            }
            hasError = true
            // '\n' + key + ': ' + key + err[key]
            console.log(key + ': ' + this.addSpace(10, key) + err[key])
        }
        if (hasError) {
            console.log('-----------------------------------------------\n')
        }
        return hasError
    }
    public sortError(err: IPropError) {
        if (err) {
            let returnErr = {} as IPropError
            if (err.code) returnErr.code = err.code
            if (err.className) returnErr.className = err.className
            if (err.funName) returnErr.funName = err.funName
            if (err.propName) returnErr.propName = err.propName
            if (err.message) returnErr.message = err.message
            if (err.extraInfo) returnErr.extraInfo = err.extraInfo
            return returnErr
        }
        return null
    }
    public addSpace(width: number, key: string) {
        let spaces = []
        let length = key.length
        while (width - length > 0) {
            spaces.push(' ')
            length++
        }
        return spaces.join('')
    }
}

export default Verify
