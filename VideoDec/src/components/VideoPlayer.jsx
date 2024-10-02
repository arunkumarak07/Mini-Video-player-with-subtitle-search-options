import React, { useState, useEffect, useRef } from 'react'
import { BsArrowUpCircleFill } from "react-icons/bs";

const VideoPlayer = ({ url, caption, localUrls, setLocalUrls}) => {
  const videoRef = useRef(null);
  const [search, setSearch] = useState("");
  const [subtitlesWithTimestamps, setSubtitlesWithTimestamps] = useState([]);
  
  // Function to fetch VTT file content and return it
  const fetchVTTContent = async (vttUrl) => {
    try {
      const response = await fetch(vttUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch subtitle file: ${response.statusText}`);
      }
      const vttContent = await response.text();
      return vttContent;
    } catch (error) {
      console.error('Error fetching VTT file:', error);
    }
  };

  const parseVTTContent = (vttContent) => {
    const lines = vttContent.split('\n');
    const result = [];
    let currentTime = '';

    lines.forEach((line) => {
      const timeRegex = /(\d{2}:\d{2}:\d{2}\.\d{3}|\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3}|\d{2}:\d{2}\.\d{3})/;
      const match = line.match(timeRegex);
      if (match) {
        currentTime = match[1]; // Capture the start time
      } else if (line.trim() && currentTime) {
        result.push({ time: currentTime, text: line.trim() });
        currentTime = ''; // Reset after adding subtitle
      }
    });

    return result;
  };

  // Fetch VTT content and create Blob URLs
  const createBlobUrl = async (subtitles) => {
    const urls = {};
    setSubtitlesWithTimestamps(() => [])
    for (let i = 0; i < subtitles.length; i++) {
      const sub = subtitles[i];
      const vttContent = await fetchVTTContent(`http://localhost:8000${sub.subtitle_path}`);
      if (vttContent) {
        const blobUrl = URL.createObjectURL(new Blob([vttContent], { type: 'text/vtt' }));
        urls[sub.subtitle_path] = blobUrl; // Store Blob URL in the object

        const parsedSubtitles = parseVTTContent(vttContent);
        setSubtitlesWithTimestamps((prevSubtitles) => [...prevSubtitles, ...parsedSubtitles]);
      }
    }
    setLocalUrls(urls); // Update state with Blob URLs
  };

  useEffect(() => {
    createBlobUrl(caption); // Fetch subtitles and create Blob URLs on component mount
  }, [caption]);

  const seekToTimestamp = (timestamp) => {
    if (!timestamp) {
      console.error('Invalid timestamp:', timestamp);
      return;
    }
    console.log(timestamp)
    const timeParts = timestamp.split(':');
    console.log(timeParts)

    // Check if the timestamp is in the expected format
    if (timeParts.length < 2 || timeParts.length > 3) {
      console.error('Unexpected timestamp format:', timestamp);
      return;
    }

    const hours = timeParts.length === 3 ? parseInt(timeParts[0], 10) : 0;
    const minutes = parseInt(timeParts[timeParts.length - 2], 10);
    const seconds = parseFloat(timeParts[timeParts.length - 1]);

    // Ensure parsed values are finite numbers
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      console.error('Failed to parse time components:', { hours, minutes, seconds });
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Check if totalSeconds is a valid number before updating currentTime
    if (!isFinite(totalSeconds)) {
      console.error('Non-finite totalSeconds value:', totalSeconds);
      return;
    }

    if (videoRef.current) {
      console.log(totalSeconds)
      videoRef.current.currentTime = totalSeconds; // Set video playback to the specified timestamp
      videoRef.current.play(); // Start playing the video
    }
  };

  // Filtered subtitles based on the search query
  const filteredSubtitles = subtitlesWithTimestamps.filter((sub) =>
    sub.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <video
        ref={ videoRef }
        controls
        className='w-[50rem] h-[22rem] px-10 mt-10'
        src={`http://localhost:8000${url}`}
      >
        {caption.map((sub,index) => (
          <track
            src={localUrls[sub.subtitle_path]}
            kind='subtitles'
            srcLang={sub.srclang}
            label={sub.language}
            key={index}
            default={index === 0}
          />
        ))}
        Your browser does not support the video tag.
      </video>

      <form action="" className="flex justify-center items-center mt-4">
       <div className=" w-[800px] h-12 bg-gray-100 rounded-full flex px-4">
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

      <div className="subtitles-list">
        <h3>Subtitles:</h3>
        <ul>
          {filteredSubtitles.map((sub, index) => (
            <li key={index}>
              <button
                className="timestamp text-blue-800"
                onClick={() => seekToTimestamp(sub.time)}
              >
                {sub.time}
              </button>
              : {sub.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default VideoPlayer;
