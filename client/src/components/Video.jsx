import React from 'react'
import ReactPlayer from 'react-player'
import vid from '../assets/video/vid.mp4'
import thumbnail from '../assets/image/thumbnail.jpg'
const Video = ({video}) => {
    console.log(video)
    const videoUrl = video.startsWith("http") ? video : vid
    return (
        <div className='max-w-[1200px] h-[720px]'>
            <ReactPlayer
                url={videoUrl}
                light={<img src={thumbnail} className='w-full h-full' alt='Thumbnail' />}
                width="100%"
                height="100%"
                playing={true}
                controls={true}
                pip
            />
        </div>
    )
}

export default Video