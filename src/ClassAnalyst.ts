import * as ts from 'typescript'
import * as fs from 'fs'
import IProp from './IProp'
import IConstructor from './IConstructor'
import IFunction from './IFunction'
import IClass from './IClass'
import Interface from './Interface'

let program
let checker
let classInfo: IClass
function init(path: string) {
    classInfo = {} as IClass
    program = ts.createProgram([path], {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
    })
    checker = program.getTypeChecker()
    program.getSourceFiles().forEach(sourceFile => {
        if (!sourceFile.isDeclarationFile) {
            ts.forEachChild(sourceFile, visit)
        }
    })
    return classInfo
}

function visit(node: ts.Node) {
    if (!isNodeExported(node)) {
        return
    }
    if (ts.isInterfaceDeclaration(node) && node.name) {
        let symbol = checker.getSymbolAtLocation(node.name)
        // 新建一个classInfo
        let detail = serializeSymbol(symbol)
        classInfo.name = detail.name
        classInfo.documentation = detail.documentation
        // 获取属性
        let type = checker.getDeclaredTypeOfSymbol(symbol)
        // 4>属性 | 33562624>方法
        let propertyFlag = 4
        let props = type
            .getProperties()
            .filter(prop => {
                return prop.flags === propertyFlag
            })
            .map(serializeProperty)
        // *设置属性
        classInfo.properties = props
    }
    if (ts.isClassDeclaration(node) && node.name) {
        let symbol = checker.getSymbolAtLocation(node.name)
        // 新建一个classInfo
        let detail = serializeSymbol(symbol)
        classInfo.name = detail.name
        classInfo.documentation = detail.documentation
        // 这样写不对
        // let constructorType = checker.getDeclaredTypeOfSymbol(symbol)
        let constructorType = checker.getTypeOfSymbolAtLocation(
            symbol,
            // symbole的node节点
            symbol.valueDeclaration!
        )
        // 获取属性
        let type = checker.getDeclaredTypeOfSymbol(symbol)
        // 4>属性 | 33562624>方法
        let propertyFlag = 4
        let props = type
            .getProperties()
            .filter(prop => {
                return prop.flags === propertyFlag
            })
            .map(serializeProperty)
        // *设置属性
        classInfo.properties = props
        // 获取构造方法
        let constructors = constructorType
            .getConstructSignatures()
            .map(serializeConstructor)
        // *设置构造方法
        if (constructors && constructors.length > 0) {
            classInfo.constructor = constructors[0]
        } else {
            classInfo.constructor = null
        }

        // 获取普通方法
        let functions = [] as Array<IFunction>
        let cls: ts.ClassDeclaration = <ts.ClassDeclaration>node
        cls.forEachChild(function(m: ts.Node) {
            let method = <ts.MethodDeclaration>m
            if (method.parameters && method.name) {
                // 获取方法名称
                const signature = checker.getSignatureFromDeclaration(method)
                // let sr = serializeSignature(signature)
                let fun: IFunction = serializeFunction(signature, method)
                // let methodName = method.name.getText()
                // detail[methodName] = sr
                functions.push(fun)
            }
        })
        classInfo.functions = functions
        // let num = 4
        // fs.writeFileSync(
        //     'class-file.json',
        //     JSON.stringify(classInfo, undefined, num)
        // )
    }
}

// 遍历属性
function serializeProperty(prop: ts.Symbol) {
    // 4>属性 | 33562624>方法
    let propInfo = {} as IProp
    let propertyFlag = 4
    if (prop.flags && prop.flags === propertyFlag) {
        propInfo.name = prop.name
        propInfo.documentation = ts.displayPartsToString(
            prop.getDocumentationComment(undefined)
        )
        propInfo.type = checker.typeToString(
            checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration!)
        )
    }
    return propInfo
}

function serializeConstructor(signature: ts.Signature) {
    let constructor = {} as IConstructor
    constructor.returnType = checker.typeToString(signature.getReturnType())
    constructor.documentation = ts.displayPartsToString(
        signature.getDocumentationComment(undefined)
    )
    constructor.parameters = signature.parameters.map(serializeParam)
    return constructor
}

function serializeFunction(
    signature: ts.Signature,
    method: ts.MethodDeclaration
) {
    let fun = {} as IFunction
    fun.name = method.name.getText()
    fun.returnType = checker.typeToString(signature.getReturnType())
    fun.documentation = ts.displayPartsToString(
        signature.getDocumentationComment(undefined)
    )
    fun.decorate = getDecorate(method.getText())
    fun.static = getStatic(method.getText())
    fun.parameters = signature.parameters.map(serializeParam)
    return fun
}

function serializeParam(symbol: ts.Symbol) {
    let prop = {} as IProp
    prop.name = symbol.getName()
    prop.documentation = ts.displayPartsToString(
        symbol.getDocumentationComment(undefined)
    )
    prop.type = checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    )
    return prop
}

/** Serialize a signature (call or construct) */
function serializeSignature(signature: ts.Signature) {
    return {
        parameters: signature.parameters.map(serializeSymbol),
        returnType: checker.typeToString(signature.getReturnType()),
        documentation: ts.displayPartsToString(
            signature.getDocumentationComment(undefined)
        )
    }
}

function serializeSymbol(symbol: ts.Symbol) {
    let tes = symbol.getDeclarations()
    return {
        name: symbol.getName(),
        documentation: ts.displayPartsToString(
            symbol.getDocumentationComment(undefined)
        ),
        type: checker.typeToString(
            checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
        )
    }
}

function isNodeExported(node: ts.Node): boolean {
    return (
        (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
        (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    )
}

function getDecorate(text: string) {
    if (!text) {
        return ''
    }
    if (text.indexOf('private ') > -1 || text.indexOf('public ') > -1) {
        let decorateLength = 7
        return text.substr(0, decorateLength).trim()
    }
    return ''
}

function getStatic(text: string): boolean {
    if (!text) {
        return false
    }
    if (text.indexOf(' static ') > -1) {
        return true
    }
    return false
}

init('./User.ts')

export default {
    init: init
}
