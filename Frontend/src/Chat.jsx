import "./Chat.css";
import { MyContext } from "./MyContext";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/a11y-dark.css";
import { useState } from "react";
import { useEffect } from "react";

//react-markdown
//rehype-highlight

export default function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if(reply===null){
      setLatestReply(null);//prevchats load
      return;
    }

    if (!prevChats?.length) return;
    const content = reply.split(" "); //inidvidual words

    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);
  return (
    <>
      {newChat && <h1>Start a new Chat!</h1>}

      <div className="chats">
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "geminiDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}
        {prevChats.length > 0 && latestReply !== null && (
          <div className="geminiDiv" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        )}

        {prevChats.length > 0 && latestReply ===null && (
          <div className="geminiDiv" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {prevChats[prevChats.length-1].content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
}
