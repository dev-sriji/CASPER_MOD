import React, { useState } from "react";
import useChat from "../../BearModule/UseChat";
import useGetChats from "../../hooks/useGetChats"; 

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedChat } = useChat();
  const { chats } = useGetChats(); 

//todebug
  // console.log("Chats:", chats);
  // console.log("Search Query:", search);

  const chat = chats.find((o) =>
    o.chat.toLowerCase().includes(search.toLowerCase())
  );

  // console.log("Found Chat:", chat); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if(search.length < 3) return console.log("no such user found");
    if (chat) {
      setSelectedChat(chat);
      setSearch("");
    } else {
      return console.log("no such user found");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="search ..."
        className="input input-bordered rounded-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        🔍
      </button>
    </form>
  );
};

export default SearchInput;
