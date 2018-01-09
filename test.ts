import { Inspector } from './index'
import * as path from 'path'
let i = new Inspector({
    path: path.resolve(__dirname, 'test'),
    output: path.resolve(__dirname, './types/a.d.ts')
})

i.start()
