import React, {useState, useEffect, useRef} from "react";
import './App.css'
import SubtitleSearch from "./components/SubtitleSearch";
import VideoPlayer from "./components/VideoPlayer";
import VideoList from "./components/VideoList";
import Navbar from './components/Navbar';
import api from './components/api'

const App = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [caption, setCaptions] = useState([]);
  const [localUrls, setLocalUrls] = useState([]);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/list-videos');
      setVideos(response.data); 
    } catch (error) {
      console.error('Error fetching videos:', error);
    } 
  };
  
  useEffect(() => {
    fetchVideos();
  }, []); 

  useEffect(() => {
    const fetchSubtitle = async () => {
      try {
        const response = await api.get(`/get-subtitle/${currentVideoId}/`);
        setCaptions(response.data); 
      } catch (error) {
        console.error('Error fetching videos:', error);
      } 
    };
    fetchSubtitle();
  }, [currentUrl])

  const handlePlay = (video) => {
    setCurrentUrl(video.file);
    setCurrentVideoId(video.id);
  };

  return (
    <div>
      <Navbar fetchVideos={fetchVideos} />

      <div className=" flex flex-row gap-6 items-center ">
        <div className="flex">
          <div className="">
            <div className="" >
              <VideoPlayer url={ currentUrl } caption={caption} localUrls={localUrls} setLocalUrls={setLocalUrls} />
            </div>
            {/* <div className="flex flex-row w-1/2 justify-between   ">
              <SubtitleSearch
              />
            </div> */}
          </div>
          <div className="w-full">
            <VideoList videos={videos} onPlay={handlePlay} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
