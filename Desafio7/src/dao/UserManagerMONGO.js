import { userModel } from "./models/userModel.js"

export class UserManagerMONGO{

    async create(user){
        let newUser=await userModel.create(user)
        return newUser.toJSON()
    }

    async getBy(filter={}){
        return await userModel.findOne(filter).lean()
    }
}