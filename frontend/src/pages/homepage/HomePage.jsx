import React from "react";
import { SideBar } from "../../components/sidebar/SideBar";
import MessageContainer from "../../components/messages/MessageContainer";
const Home = () => {
  return (
    <div className="flex min-h-[98%] max-h-[98%] max-w-[93%] min-w-[93%] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <SideBar />
      <MessageContainer />
        </div>
  )
}

export default Home;



// responsive ig :  flex sm:h-[450px] md:h-[900px] md:max-w-[90%] md:min-w-[90%] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0