import React, { useState } from "react";
import logo from "../assets/icons8-search.svg";
import { IoSearch } from "react-icons/io5";
import { BsArrowUpCircleFill } from "react-icons/bs";

const SubtitleSearch = () => {
  const [search, setSearch] = useState("");
  // const [searchText, setSearchText] = useState('');


  return (
    <>
      <form action="" className="flex justify-center items-center mt-4">
       <div className=" w-[800px] h-12 bg-gray-100 rounded-full flex px-4   ">
       <input
          type="text"
          className=" bg-transparent outline-none w-full tracking-wider ml-2"
          placeholder="<- Search here! ->"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="">
        <BsArrowUpCircleFill size={30} className="text-gray-500 transition-all active:scale-95 hover:text-black" />
        </button>
       </div>
      </form>
    </>
  );
};

export default SubtitleSearch;
