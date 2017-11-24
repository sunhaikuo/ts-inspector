declare module "@mtime-node-mlibs/live-util-ts" {
/**
 * class of User
 */
export class User {

	/**
	 * 密码
	 */
	password: string
	/**
	 * property 姓名
	 */
	name: string
	/**
	 * 地址
	 */
	addr: string

	/**
	 * setName1
	 * @param name f-name
	 * @param sex xxx
	 */
	setName(name: string, sex: boolean): boolean
	/**
	 * setAge1
	 * @param age f-age
	 */
	setAge(age: any): number
	/**
	 * setAge1
	 */
	voidFun(): string

}
}