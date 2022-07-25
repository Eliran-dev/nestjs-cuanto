import * as mongoose from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'
import * as bcrypt from 'bcrypt'
import User from './auth.interface';

const UserSchema = new mongoose.Schema<User>({
    email:  { type: String, unique: true, required: true, uniqueCaseInsensitive: true},
    password: { type: String, required: true},
    id: Number




}, {
    collection: "Users",
    versionKey: false,
    _id: true
})
UserSchema.plugin(uniqueValidator,  { message: 'mongoose-unique-validator' })


export default UserSchema;