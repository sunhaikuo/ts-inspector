import * as fs from 'fs-extra'
import * as path from 'path'
/**
 * File类, 文件处理的方法都在这里面定义
 */
class MFile {
    /**
     * 获取目录下所有的文件或单个文件
     * @param pathStr 文件或文件夹的路径路径名称
     * @param isExt 是否包含后缀
     * @param isFullPath 是否需要全路径
     */
    public static getFiles(
        pathStr: string,
        isExt: boolean,
        isFullPath: boolean
    ): string[] {
        let result: string[] = []
        const exit = fs.existsSync(pathStr)
        if (exit) {
            this.finder(result, pathStr, isExt, isFullPath)
        }
        return result
    }
    /**
     * getFiles的私有方法，递归调用
     * @param pathArr 文件或文件夹的路径路径名称
     * @param startPath 文件路径
     * @param isExt 是否包含后缀
     * @param isFullPath 是否为全路径
     */
    private static finder(
        pathArr: string[],
        startPath: string,
        isExt: boolean,
        isFullPath: boolean
    ): void {
        let stats = fs.statSync(startPath)
        if (stats.isFile()) {
            let ext = ''
            let filePath = path.dirname(startPath)
            if (!isExt) {
                ext = path.extname(startPath)
            }
            let fileName = path.basename(startPath, ext)
            if (isFullPath) {
                pathArr.push(path.join(filePath, fileName))
            } else {
                pathArr.push(fileName)
            }
        } else if (stats.isDirectory()) {
            let files = fs.readdirSync(startPath)
            files.forEach(val => {
                let fPath = path.join(startPath, val)
                this.finder(pathArr, fPath, isExt, isFullPath)
            })
        }
    }
}

// 读取文件夹下所有文件
export default MFile
