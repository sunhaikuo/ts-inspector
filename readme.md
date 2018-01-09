### 用于检查 ts 文件的规范性

#### 检查的项目如下：

* 通用
  * 参数 / 变量 要有类型
  * 参数 / 变量 / 类 / 方法 / 接口 要有注释
  * 尽量不要使用 any
  * 注释和参数的数量要匹配
* Class 校验
  * 类名要和文件名一致
  * 不能直接使用 export default class Test
  * 类名的首字母要大写
* 方法检验
  * 要显示的写返回值
  * 要显示的写修饰符 :public/private
  * 首字母要小写
* 接口
  * 要以大写字母 I 开头

#### 安装

```
npm install @mtime-node-mlibs/ts-inspector
```

#### ts 文件中使用

```
import { Inspector } from '@mtime-node-mlibs/ts-inspector'
import * as path from 'path'
let i = new Inspector({
    path: path.join(__dirname, 'User.ts'),
    output: path.join(__dirname, 'User1.d.ts')
})
i.start()
```

#### js 文件中使用

```
let insp = require('@mtime-node-mlibs/ts-inspector')
let path = require('path')
let i = new insp.Inspector({
    path: path.join(__dirname, 'User.ts'),
    output: path.join(__dirname, 'User.d.ts')
})
i.start()
```

#### 构造函数 - 参数说明

```
{
    path: string, // 需要检查的文件或文件夹路径(必选)
    output?: string, // 输出.d.ts文件的文件路径（可选）
    whiteList?: Array<String> // 不需要检查的文件名（可选）
}
```
