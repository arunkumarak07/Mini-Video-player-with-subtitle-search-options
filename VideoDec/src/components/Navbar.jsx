import React from "react";
import VideoUpload from "./VideoUpload";

const Navbar = ({fetchVideos}) => {
  return (
    <>
      <nav className="relative text-center h-14 border-gray-500 border-b-0 flex items-center justify-center shadow-lg">
        <h1 className="text-xl font-bold tracking-widest">QuoteTrackr</h1>
        <div className="absolute right-10 cursor-pointer ">
        <VideoUpload fetchVideos={fetchVideos} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
