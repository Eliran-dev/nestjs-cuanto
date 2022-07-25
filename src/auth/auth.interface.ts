import { Document } from "mongoose";


interface User extends Document {
    email: string,
    password: string,

}

export default User;