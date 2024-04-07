//sidebar.jsx

import React from "react";
import SearchInput from "./SearchInput";
import Chats from "./Chats";

export const SideBar = () => {
  return (
    <div>
            <SearchInput />
      <div className="min-w-[80%] flex flex-col"></div>
      <Chats />
    </div>
  );
};
