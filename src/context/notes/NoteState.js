import react from 'react';
import NoteContext from './noteContext';
import { useState } from 'react';
import { useContext } from 'react';

const NoteState=(props)=>{
    const host="http://localhost:5000"
    const notesInitial=[ ]
    const [notes,setNotes]=useState(notesInitial)


    //Get all notes
    const getNotes=async(title,description,tag,id)=>{
        //todo api call
        const response = await fetch(`${host}/api/notes/fetchallnotes/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzMWRjNWUzZTQwMzdjZDQ3MzRhMDY2In0sImlhdCI6MTYzMDY2OTU5Nn0.hJS0hx6I7ROugkqjL2CjrJuefA3pJi-IU5yGUbRHI4Q"
            },
          
            
          });
          const json =await response.json
          console.log(json);
          setNotes(json)



        

    }

    //Add a note
    const addNote=async(title,description,tag,id)=>{
        //todo api call
        const response = await fetch(`${host}/api/notes/addnote/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzMWRjNWUzZTQwMzdjZDQ3MzRhMDY2In0sImlhdCI6MTYzMDY2OTU5Nn0.hJS0hx6I7ROugkqjL2CjrJuefA3pJi-IU5yGUbRHI4Q"
            },
          
            body: JSON.stringify({title,description,tag}),
          });
          const json= response.json();



        console.log("adding a new note")
       const note={
            "_id": "61322f19553781a8cas8vd0e06",
            "_id": "61322f195153781a8ca8d0e06",
            "user": "6131dc5e3e4037cd4734a066",
            "title": {title},
            "description": {description},
            "tag":{tag}
        };
        setNotes(notes.concat(note))

    }

    //Delete a note
    
    
    const deleteNote=async(id)=>{
        //API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzMWRjNWUzZTQwMzdjZDQ3MzRhMDY2In0sImlhdCI6MTYzMDY2OTU5Nn0.hJS0hx6I7ROugkqjL2CjrJuefA3pJi-IU5yGUbRHI4Q"
            },
          
            
          });
          const json= response.json();
          console.log(json);


        console.log("deleting the note with id"+id);
        const newNotes=notes.filter(()=>{
            return notes._id!=id
        })
        setNotes(newNotes);

    }

    //Edit a note
    const editNote=async(title,description,tag,id)=>{
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzMWRjNWUzZTQwMzdjZDQ3MzRhMDY2In0sImlhdCI6MTYzMDY2OTU5Nn0.hJS0hx6I7ROugkqjL2CjrJuefA3pJi-IU5yGUbRHI4Q"
            },
          
            body: JSON.stringify({title,description,tag}),
          });
          const json= response.json();
          

        //Logic to edit in client
        for(let index=0;index<notes.length;index++)
        {
            const element=notes[index];
            if(element.id===id)
            {
                element.title=title;
                element.description=description;
                element.tag=tag;
            }
        }
        

    }
    


    return <NoteContext.Provider value={{notes,addNote,deleteNote,getNotes,editNote}}>
       { props.children}
    </NoteContext.Provider>

}

export default NoteState;