import mongoose from "mongoose"

const usersCollection="users"
const usersSchema=new mongoose.Schema(
    {
        name: String, 
        lastName: String, 
        email: {
            type: String,
            unique: true, 
            required: true
        },
        age: Number,
        password: String,
        role: {
            type: String,
            default: "user"
          }
    },
    {
        timestamps: true, 
        strict: false
    }
)

export const userModel=mongoose.model(
    usersCollection,
    usersSchema
)

