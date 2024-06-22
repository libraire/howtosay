import React, { useRef, useState } from 'react';
import Image from "next/image";
import { PlayCircleIcon } from '@heroicons/react/24/outline'

interface VideoPlayerProps {
    src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoSrc, setVideoSrc] = useState<string>('');

    const handlePlay = () => {
        setVideoSrc(src)
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    return (
        <div className="mt-40 mb-10">
            {videoSrc && <video ref={videoRef} src={videoSrc} style={{ width: '100%' }} controls />}
            {!videoSrc &&
                <div className='rounded-lg flex flex-col justify-center'>

                    <h1 className="text-4xl font-medium tracking-tight text-center mb-10 flex justify-center"><PlayCircleIcon className="h-10 w-10 rounded-full mr-2"/> Learn How to Use </h1>
                    <Image className='rounded-lg' style={{cursor: 'pointer'}} src={"https://images.bytegush.com/demo2.png"} alt="Video" width={600} height={300} onClick={handlePlay} />

                    

                </div>}
        </div>
    );
};

export default VideoPlayer;