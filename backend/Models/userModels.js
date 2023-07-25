import {Schema, model} from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
  
    fullname:{
        type: 'String',
        required: [true,'Name is required'],
        minLength:[5,'Name must be at least 5 characters'],
        maxLength:[50,'Name must not be greater than 50 characters'],
        lowercase: true,
        trim: true
    },
    email:{
        type: 'String',
        required: [true,'email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: ["^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",'please fill in valid email id']
    },
    password:{
        type: 'String',
        required:[true,'password is required'],
        minLength: [8,'password must be atleast 8 characters'],
        select: false
    },
    avatar:{
        public_id: {
             type: 'String'
        },
        secure_url: {
            type: 'String'
        }
    },
    role:{
          type: 'String',
          enum: ['USER', 'ADMIN'],
          default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date

},{
    timestamps: true
})

UserSchema.pre('save',function(next){
        if(!this.isModified('passowrd')){
            return next()
        }
        this.password = bcrypt.hash(this.password,10)
})
const userModel = model('user',UserSchema)
export default userModel




