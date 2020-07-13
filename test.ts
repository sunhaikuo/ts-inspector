// import { Inspector } from './index'
// import * as path from 'path'
// let i = new Inspector({
//     path: path.resolve(__dirname, 'test'),
//     output: path.resolve(__dirname, './types/a.d.ts')
// })

// i.start()

import ClassAnalyst from "./src/ClassAnalyst";
import {writeJSONSync} from "fs-extra";

const res = ClassAnalyst.init("/Users/sunhaikuo/github/ts-inspector/demo.ts");
console.log("res = ", res);
writeJSONSync("/Users/sunhaikuo/github/ts-inspector/demo.json", res);
