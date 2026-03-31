import express from "express";
import Thread from "../models/Thread.js";
import getGeminiApiResponse from "../utils/gemini.js";

const router = express.Router();

//test router fro testing and saving 
router.post("/test", async(req,res)=>{
    try{
        const thread= new Thread({
            threadId:"xyz",
            title:"new testing data"
        });

        const response=await thread.save();
        res.send(response);
    } catch (error) {
        console.error("Error creating thread:", error);
        res.status(500).json("Internal Server Error");
    }
});


//Get all threads
router.get("/thread", async (req, res) => {
    try{
        const threads = await Thread.find({}).sort({updatedAt: -1});
        //descending order of updateAt.... most recent data on top
        res.json(threads);
    }catch(err){
        console.log("Error fetching threads:", err);
        res.status(500).json("Internal Server Error");
    }
})

//get specific threads messages 
router.get("/thread/:threadId", async (req, res) => {
    const {threadId}=req.params;

    try{
        const thread= await Thread.findOne({threadId});
        if(!thread){
            return res.status(404).json({error:"Thread not found"});
        }
        res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to fetch chat"});
    }
})


//delete specific threads
router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;
    try{
       const deletedThread= await Thread.findOneAndDelete({threadId});
       if(!deletedThread){
           return res.status(404).json({error:"Thread not found"});
       }
       res.json({message:"Thread deleted successfully"});   
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to delete chat"});
    }
})

//chat route

router.post("/chat", async(req,res)=>{
    const {threadId, message} = req.body;    
    
    if(!threadId ||!message){
        return res.status(400).json({error:"Thread ID and messages are required"});
    }

    try {
      let thread = await Thread.findOne({ threadId });

      if (!thread) {
        // create a new thread in DB
        thread = new Thread({
          threadId,
          title: message,
          messages: [{ role: "user", content: message }],
        });
      } else {
        thread.messages.push({ role: "user", content: message });
      }

      const assistantReply = await getGeminiApiResponse(message)
      thread.messages.push({ role: "assistant", content: assistantReply });
      thread.updatedAt = new Date();
      await thread.save();
      res.json({ reply: assistantReply });
    } catch (err) {
      console.error("Error in chat route:", err);
      res.status(500).json({ error: err.message, stack: err.stack });
    }
})
export default router;
