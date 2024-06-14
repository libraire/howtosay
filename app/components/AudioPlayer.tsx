import { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline'
import styles from "./ComponentStyle.module.css";

interface AudioPlayerProps {
    audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            audioElement.src = audioUrl;
            audioElement.preload = 'auto';
            audioElement.addEventListener('ended', handleAudioEnded);
            return () => {
                audioElement.removeEventListener('ended', handleAudioEnded);
            };

        }
    }, [audioUrl]);

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    const handlePlayPause = () => {
        const audioElement = audioRef.current;

        if (audioElement) {
            if (isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div>
            <button className={styles.star_button} onClick={handlePlayPause}>
                {!isPlaying && <PlayIcon className="h-[24px] w-[24px]"></PlayIcon>}
                {isPlaying && <PauseIcon className="h-[24px] w-[24px]"></PauseIcon>}
            </button>
            <audio ref={audioRef} />
        </div>
    );
};

export default AudioPlayer;