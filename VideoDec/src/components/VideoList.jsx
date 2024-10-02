import React from 'react'
import { IoMdPlay } from "react-icons/io";

const VideoList = ( { videos, onPlay } ) => {

  return (
    <div className='mt-10 w-[350px] h-[400px] flex flex-col overflow-y-scroll'>
      <h1 className='text-2xl mb-4'>Uploaded Videos List</h1>
      <div className='flex flex-col gap-3'>
        {/* <div className='bg-zinc-100 px-4 py-2 flex justify-between items-center text-slate-900'>
          <div>
            <h1 className='text-lg font-semibold tracking-widest'>Video 1</h1>
            <p className='text-sm text-gray-400'>Date:1/1/1111</p>
          </div>
          <IoMdPlay size={25} />
        </div> */}

        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id} className="bg-zinc-100 px-4 py-2 flex justify-between items-center text-slate-900">
              <div>
                <h1 className="text-lg font-semibold tracking-widest">{video.file_name}</h1>
                <p className="text-sm text-gray-400">Video ID: {video.id}</p>
              </div>
              <IoMdPlay size={25} className="hover:scale-110"
                onClick={ () => onPlay(video) }
              />
            </div>
          ))
        ) : (
          <p>No videos available</p>
        )}
      </div>

    </div>
  )
}

export default VideoList