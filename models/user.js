const mongoose=require('mongoose');
const schema=mongoose.Schema;
const { isEmail }=require('validator');
const bcrypt=require('bcrypt');

const userSchema=new schema({
    email:{
        type: String,
        required: [true,'Please give an email id'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please give a valid email id']
    },
    password:{
        type: String,
        required: [true,'Please give a password'],
        minlength: [6,'Please give a password length graeter than 6 characters']
    },
    username:{
        type: String,
        required: [true,'Please give a username'],
        unique: true,
    },
    age:{
        type: Number,
        required: [true,'Please give your age'],
    },
},{timestamps: true},{ typeKey: '$type' });

//password hashing
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

userSchema.statics.login=async function(email,password){
    const user= await this.findOne({email: email});
    if(user){
        const auth=await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error("Incorrect password for the given email id :(");
    }
    throw Error("User not found!");
}

const User= mongoose.model('User', userSchema);

module.exports=User;