import React from 'react'
import ReactPlayer from 'react-player'

const Video = () => {
    return (
        <div className='max-w-[1200px] h-[720px]'>
            <ReactPlayer
                url='https://www.youtube.com/watch?v=LXb3EKWsInQ'
                light={<img src='https://accesstrade.vn/wp-content/uploads/2023/02/thumbnail-la-gi-1.jpg' className='w-full h-full' alt='Thumbnail' />}
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