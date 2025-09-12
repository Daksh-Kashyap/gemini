import "./Chatwindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState } from "react";
import {BeatLoader} from "react-spinners"
import { useEffect } from "react";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    cuurthreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const[loading,setLoading]=useState(false)
  const[isOpen,setIsOpen]=useState(false);

  const getReply = async () => {
    setLoading(true)
    setNewChat(false)
    
    console.log("message", prompt, "threadId", cuurthreadId);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: cuurthreadId,
      }),
    };

    try{
      const response= await fetch("http://localhost:3000/api/chat",options)
       const res=await response.json();
       console.log(res)
       setReply(res.reply)
    }catch(err){
       console.log(err)
    }
    setLoading(false)
  };

  //append new chat to prevchat

  useEffect(()=>{
    if(prompt && reply){
      setPrevChats(prevChats=>(
        [...prevChats,{
          role:"user",
          content:prompt
        },{
          role:"assistant",
          content:reply
        }]
      ))
    }
    setPrompt("")
  },[reply])

  const handleProfileClick=()=>{
    setIsOpen(!isOpen)
  }

  return (
    <div className="chatwindow">
      <div className="navbar">
        <span>
          MyGPT<i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i>Setting
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Log Out
          </div>
        </div>
      )}
      <Chat></Chat>
      <BeatLoader color="white" loading={loading}></BeatLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          MyGPT can make mistakes. Check important info. See Cookie Prefrences
        </p>
      </div>
    </div>
  );
}
