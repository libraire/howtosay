import { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline'
import styles from "./ComponentStyle.module.css";

interface AudioPlayerProps {
    word: string;
    showLabel?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ word, showLabel = false }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            audioElement.src = 'https://audio.bytegush.com/' + word + '.mp3';
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
        <div className={showLabel ? '' : 'mt-2'}>
            <button
                className={showLabel
                    ? "inline-flex h-8 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.08] px-2.5 text-[13px] font-semibold text-white/88 shadow-[0_1px_6px_rgba(0,0,0,0.16)] backdrop-blur transition hover:bg-white/[0.14]"
                    : styles.star_button}
                onClick={handlePlayPause}
                title={isPlaying ? "Pause audio" : "Play audio"}
            >
                {!isPlaying && <PlayIcon className="h-[18px] w-[18px]"></PlayIcon>}
                {isPlaying && <PauseIcon className="h-[18px] w-[18px]"></PauseIcon>}
                {showLabel && <span>{isPlaying ? "Pause" : "Speak"}</span>}
            </button>
            <audio ref={audioRef} />
        </div>
    );
};

export default AudioPlayer;
