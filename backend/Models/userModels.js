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

UserSchema.methods = {
    generateJWTToken: async function(){
        return await this.generateJWTToken.sign(
            { id: this._id, emails: this.email, subscription: this.subscription, role: this.role},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    },
     //userSchema method for generating and return forgotPassword token
  getForgotPasswordToken() {
    const forgotToken = crypto.randomBytes(20).toString('hex');
    //step 1 - save to DB
    this.forgotPasswordToken = crypto
      .createHash('sha256')
      .update(forgotToken)
      .digest('hex');

    /// forgot password expiry date
    this.forgotPasswordExpiryDate = Date.now() + 20 * 60 * 1000; // 20min

    //step 2 - return values to user
    return forgotToken;
  }
}
const userModel = model('user',UserSchema)
export default userModel




