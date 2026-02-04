import exp from "express";
import {UserModel} from '../Model/usermodel.js';

export const userApp= exp.Router();


//create user

//read user 
userApp.get('/users',async (req,res)=>{
  try{
    let userlist= await UserModel.find().select('-password');
    res.status(200).json({message:"user list",payload:userlist}); 
  }catch(err){
    console.error(err);
    res.status(500).json({message:'Server error', error: err.message});
  }

});


  userApp.post('/users',async (req,res)=>{
  try{
    let newUser=req.body;
    //create user model document
    let newUserDoc=new UserModel(newUser);
    // save to db 
    await newUserDoc.save();
    //response without password
    const safe = newUserDoc.toObject();
    delete safe.password;
    res.status(201).json({message:"user created", payload: safe}); 
  }catch(err){
    console.error(err);
    // duplicate key error (e.g., unique email)
    if(err && err.code === 11000){
      return res.status(400).json({message: 'Duplicate field error', details: err.keyValue});
    }
    res.status(500).json({message: 'Server error', error: err.message});
  }



});
// update user

userApp.put("/users/:id",async (req,res)=>{
  try{
    //get user id from url
    let objId=req.params.id;

    //get updated user from req body
    let modifiedUser=req.body;

    // if password is being updated, load doc and save to trigger pre-save hook
    if(modifiedUser.password){
      let user = await UserModel.findById(objId);
      if(!user) return res.status(404).json({message:'User not found'});
      Object.assign(user, modifiedUser);
      let latestUser = await user.save();
      const safe = latestUser.toObject(); delete safe.password;
      return res.status(200).json({message:"user updated",payload:safe});
    }

    // otherwise perform a normal update and exclude password from result
    let latestUser= await UserModel.findByIdAndUpdate(objId,modifiedUser,{new:true}).select('-password');
    if(!latestUser) return res.status(404).json({message:'User not found'});
    //response
    res.status(200).json({message:"user updated",payload:latestUser});
  }catch(err){
    console.error(err);
    res.status(500).json({message:'Server error', error: err.message});
  }

});

// login route - compare hashed password
userApp.post('/login', async (req,res)=>{
  try{
    // extract credentials from request body
    const { email, password } = req.body;
    // validate presence of required fields
    if(!email || !password) return res.status(400).json({message:'Email and password required'});
    // find user by unique email (returns hashed password on the document)
    const user = await UserModel.findOne({ email });
    // if user not found, return generic auth error (don't reveal which)
    if(!user) return res.status(401).json({message:'Invalid credentials'});
    // compare provided password with stored hashed password using model method
    const isMatch = await user.comparePassword(password);
    // invalid password -> auth error
    if(!isMatch) return res.status(401).json({message:'Invalid credentials'});
    // remove sensitive fields before sending back
    const safe = user.toObject(); delete safe.password;
    // successful login response (token generation could be added here)
    res.status(200).json({message:'Login successful', payload: safe});
  }catch(err){
    console.error(err);
    res.status(500).json({message:'Server error', error: err.message});
  }
});

