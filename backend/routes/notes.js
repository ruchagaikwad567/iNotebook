const express =require('express')
const Note= require('../models/Note');
const router=express.Router();
var fetchuser=require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//ROUTE1:get all the notes of logged in user using: GET "/api/notes/getuser".login required
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try {
        const notes=await Note.find({user:req.user.id})
    
    res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
        
    }

})


//ROUTE2:add a new note using using: POST "/api/notes/addnote".login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({ min: 5 }),
    
    body('description','Description must be at least 5 characters').isLength({ min: 5 }),
],async(req,res)=>{
    //const notes=await Note.find({user:req.user.id})

    try {
        const{title,description,tag}=req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note=new Note({
        title,description,tag,user:req.user.id

    })
    const savedNote= await note.save();
    


    res.json(savednote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
        
    }

})


//ROUTE3:update an existing note using using: PUT "/api/notes/updatenote".login required
router.put('/updatenote/:id',fetchuser,[
    body('title','Enter a valid title').isLength({ min: 5 }),
    
    body('description','Description must be at least 5 characters').isLength({ min: 5 }),
],async(req,res)=>{
    const{title,description,tag}=req.body

    try {
        //create a new note object
    const newNote={};
    if(title){
        newNote.title=title;
    }
    if(description){
        newNote.description=description;
    }
    if(tag){
        newNote.tag=tag;
    }

    //find note to be updated and update it
    let note=await Note.findById(req.params.id);
    if(!note){
       return res.status(404).send("Not found")
    }
    //allow deletion only if user owns this note
    if(note.user.toString()!==req.user.id)
    {
        return res.status(401).send("Not allowed")
    }

    note=await Note.findByIdAndDelete(req.params.id,{$set:newNote},{new:true});
    res.json({"Success":"Note has been deleted",note:note})



    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
        
    }
})



//ROUTE4:delete an existing note using using: DELETE "/api/notes/deletenote".login required
router.delete('/deletenote/:id',fetchuser,[
    body('title','Enter a valid title').isLength({ min: 5 }),
    
    body('description','Description must be at least 5 characters').isLength({ min: 5 }),
],async(req,res)=>{
    const{title,description,tag}=req.body

  try {
      //create a new note object
      const newNote={};
      if(title){
          newNote.title=title;
      }
      if(description){
          newNote.description=description;
      }
      if(tag){
          newNote.tag=tag;
      }
  
      //find note to be deleted and delete it
      let note=await Note.findById(req.params.id);
      if(!note){
         return res.status(404).send("Not found")
      }
  
      if(note.user.toString()!==req.user.id)
      {
          return res.status(401).send("Not allowed")
      }
  
      note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
      res.json({note})
  } catch (error) {
    console.error(error.message);
        res.status(500).send("Some error occured");
    
  }



})





module.exports=router 