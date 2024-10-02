import React, { useState } from "react";
import axios from "axios";
import api from "./api";
import "../assets/css/modal.css";
import { BiSolidFilePlus } from "react-icons/bi";
import { FiFilePlus } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { FaArrowCircleRight } from "react-icons/fa";

const VideoUpload = ({fetchVideos}) => {
  const [isModal, setModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [responseMsge, setResponseMsge] = useState(null);

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken'))
    ?.split('=')[1];

    if (!csrfToken) {
      console.error("CSRF token not found in cookies");
    }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setResponseMsge("Video not yet uploaded");
      closeModal();
      return;
    }
    closeModal();
    const formData = new FormData();
    formData.append("file_name", fileName);
    formData.append("file", videoFile);

    try {
      const response = await api.post("upload-videos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'X-CSRFToken': csrfToken,
        },
      });
      console.log(response);
      if (response.status === 201) {
        console.log("uploaded successfully");
        setFileName("");
        setVideoFile(null);
        await fetchVideos()
      } else {
        console.log("uploaded failed");
      }
    } catch (error) {
      console.log(error);
      setResponseMsge(`Upload error: {error} `);
    }
  };

  const fileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="py-2 px-4 text-base text-white hover:bg-violet-700  bg-violet-500 flex gap-1 items-center rounded-md"
      >
        <FiFilePlus />
        <label>
          <div>Choose File</div>
        </label>
      </button>

      {isModal && (
        <div className="modal-overlay">
          <div className="modal-content relative ">
            <form encType="multipart/form-data" onSubmit={handleSubmit} className="flex flex-col justify-center px-10 gap-5">
              <input
                className="bg-gray-100 px-3 py-2 active:outline-none focus:outline-none border-none"
                type="text"
                name="fileName"
                value={fileName}
                placeholder="Enter The File Name"
                onChange={(e) => setFileName(e.target.value)}
              />
              <input
                type="file"
                className="font-mono "
                name="files"
                accept="video/"
                onChange={fileChange}
              />
              <div className="text-white flex items-center gap-3 w-36 active:scale-90 transition-all  justify-center hover:bg-violet-600 tracking-widest font-semibold  px-5 py-2 bg-violet-700">
                <button
                  type="submit"
                  className=""
                >
                  Upload 
                </button>
                <FaArrowCircleRight />
              </div>

              <button
                className="absolute right-3 hover: top-3"
                onClick={closeModal}
              >
                <IoMdClose size={25} className="hover:cursor-pointer hover:scale-90 transition-all " />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoUpload;
