import "./Sidebar.css";
import { MyContext } from "./MyContext";
import { useContext } from "react";
import { useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    cuurthreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrthreadID,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/thread");
      const res = await response.json();
      let filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      console.log(filterData);
      setAllThreads(filterData);
      //threadId,title
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [cuurthreadId]);


  const createNewChat=()=>{
    setNewChat(true);
    setPrompt("")
    setReply(null)
    setCurrthreadID(uuidv1())
    setPrevChats([])
  }

  const changeThread=async (newThreadId)=>{
      setCurrthreadID(newThreadId);

      try{
        let response=await fetch(`http://localhost:3000/api/thread/${newThreadId}`);
        let res=await response.json();
        console.log(res);
        setPrevChats(res);
        setNewChat(false);
        setReply(null);
      }catch(err){
        console.log(err);
      }
  }

  const deleteThread=async (threadId)=>{
    try{
     let response=await fetch(`http://localhost:3000/api/thread/${threadId}`,{method:"DELETE"});
      let res=await response.json();
      console.log(res)
      //update threads re-render

      setAllThreads(prev=>prev.filter(thread=>thread.threadId!==threadId));
      if(threadId===cuurthreadId){
        createNewChat();
      }
    }catch(e){

      console.log(e);
    }
  }

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={() => changeThread(thread.threadId)}  className={thread.threadId===cuurthreadId?"highlighted":""}>
           
            {thread.title}
            <i className="fa-solid fa-trash" 
            onClick={(e)=>{
              e.stopPropagation();
              deleteThread(thread.threadId);
            }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By Daksh kashyap &hearts;</p>
      </div>
    </section>
  );
}
