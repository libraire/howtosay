import { useEffect, useRef } from 'react';

function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    return () => {
      // Clean up the audio context when the component unmounts
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return audioContextRef.current;
}

export default useAudioContext;