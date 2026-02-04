import { Schema,model  } from "mongoose";
import bcrypt from 'bcryptjs';

//create user schema (username, password, age)

const UserSchema = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        minLength:[3,"minimum length is 3 characters"],
        maxLength:[100,"maximum length is 100 characters"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
        
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
   age:{
    type:Number,
    required:[true,"age is required"],
    min:[18,"age should be above   18"],
    max:[55,"age should be below 65"]
   }
},{
    strict:"throw",
    timestamps:true
});

// hash password before saving when modified
// use async middleware without `next` to avoid callback confusion
UserSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};

//create user model with that model 
export const UserModel = model('users', UserSchema);
