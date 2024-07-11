import React from 'react'
import ReactPlayer from 'react-player'
import vid from '../assets/video/vid.mp4'
import thumbnail from '../assets/image/thumbnail.jpg'
const Video = ({video, setIsPlaying}) => {
    console.log(video)
    const videoUrl = video.startsWith("http") ? video : vid;
    return (
        <div className='w-[100%]'>
            <ReactPlayer
                config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                url={videoUrl}
                light={<img src={thumbnail} className='w-full h-full' alt='Thumbnail' />}
                playing={true}
                controls={true}
                width='100%'
                onPlay={() => setIsPlaying(true)} 
                onPause={() => setIsPlaying(false)}
                pip
            />
        </div>
    )
}

export default Video