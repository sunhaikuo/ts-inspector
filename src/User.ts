/**
 * class of User
 */
class User {
    /**
     * 密码
     */
    password: string
    /**
     * property 姓名
     */
    private name: string
    /**
     * 地址
     */
    private addr: string
    /**
     * constructor
     * @param name c-name
     */
    constructor() {
        this.name = 'abc'
    }
    /**
     * setName1
     * @param name f-name
     * @param sex xxx
     */
    public setName(name: string, sex: boolean) {
        this.name = name
        sex = false
        return sex
    }
    /**
     * setAge1
     * @param age f-age
     */
    public setAge(age) {
        return age++
    }

    /**
     * setAge1
     */
    public voidFun() {
        return 'abc'
    }
}
export default User
