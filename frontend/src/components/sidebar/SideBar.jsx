import React from "react";
import SearchInput from "./SearchInput";
import Chats from "./Chats";

export const SideBar = () => {
  return (
    <div>
            <SearchInput />
      <div className="divider px-3"></div>
      <Chats />
    </div>
  );
};
