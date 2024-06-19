import { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline'
import styles from "./ComponentStyle.module.css";

interface AudioPlayerProps {
    word: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ word }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            audioElement.src = 'https://audio.howtosay.one/' + word + '.mp3';
            audioElement.preload = 'auto';
            audioElement.addEventListener('ended', handleAudioEnded);
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                audioElement.removeEventListener('ended', handleAudioEnded);
                document.removeEventListener("keydown", handleKeyDown);
            };

        }
    }, [word]);

    function handleKeyDown(event: KeyboardEvent) {
        const key = event.key;
        if (key == "2") {
            handlePlayPause();
        }
    }

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    const handlePlayPause = () => {
        const audioElement = audioRef.current;
        if (audioElement) {
            if (isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play().catch(error => {
                    speechSynthesis.speak(new SpeechSynthesisUtterance(word));
                    setIsPlaying(false);
                });
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