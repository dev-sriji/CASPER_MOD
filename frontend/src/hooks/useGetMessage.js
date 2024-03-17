//useGetMessage.jsx

import { useEffect,useState } from "react";
import useChat from '../BearModule/UseChat'

const API = 'http://localhost:8080/';

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedChat } = useChat();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(API + "getMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat: selectedChat?.chat,
          }),
        });
        const data = await res.json();
        // await console.log(await data)
        if (data.error) {
          throw new Error(data.error);
        }
        setMessages(data.message);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedChat?.chat) {
      getMessages();
    }
  }, [selectedChat?.chat, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
