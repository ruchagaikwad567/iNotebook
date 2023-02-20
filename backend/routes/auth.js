const express =require('express');
const User= require('../models/User');
//const { Schema } = mongoose;

const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken')
const JWT_SECRET='Harryisagood$boy'
var fetchuser=require('../middleware/fetchuser')

//ROUTE 1:Create a user using POST "api/auth/createuser".No login required
router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min: 5 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 }),
],async(req,res)=>{
    //console.log(req.body);
    //const user=User(req.body);
    //user.save();

    //if there are errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
//check if the user with this mail exists already
try{
    let user=await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({error:"A user with this email already exists"})
    }
    const salt=await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.password,salt)

    //create a new user 
    user=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })

      const data={
        user:{
            id:user.id
        }
      }
      //.then(user => res.json(user))
    //res.send(req.body)
    //.catch(err=>{console.log(err)
    //res.json({error:"Please enter a unique value for email",message:err.message})})


    const authtoken= jwt.sign(data,JWT_SECRET)
    console.log(jwtData)
    res.json(authtoken)}
    catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

})

//ROUTE 2:authenticate a new user using POST "api/auth/login".No login required
router.post('/login',[
    
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()
],async(req,res)=>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const{email,password}=req.body;
    try{
        let user=User.findOne({email})
        if(!user)
        {
            return res.status(400).json({error:"Try to login with correct credentials"});
        }
        const passwordCompare=bcrypt.compare(password,user.password)
        if(!passwordCompare)
        {
            return res.status(400).json({error:"Try to login with correct credentials"});

        }

        const data={
            user:{
                id:user.id
            }
          }
          const authtoken= jwt.sign(data,JWT_SECRET)
          res.json(authtoken)

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }})



    //ROUTE 3:get logged in user details using POST "api/auth/getuser".login required
    router.post('/getuser',fetchuser,async(req,res)=>{
        
        
    try {
        userId=req.user.id;
        const user=await User.findById().select("-password");
        res.send(user);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
        
    }})



module.exports=router 