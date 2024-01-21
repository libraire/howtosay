import { useEffect, useRef,useState } from "react";

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

const AudioComponent: React.FC<{str:string}> = ({str}) => {
  const audioContext = useAudioContext();
  let pressBuffer: AudioBuffer | null = null;
  let alertBuffer: AudioBuffer | null = null;
  let completeBuffer: AudioBuffer | null = null;

  const [word, setWord] = useState<string>(str);

  function loadBuffer(audioContext: AudioContext | null) {
    if (audioContext == null) {
      return;
    }

    fetch("/press.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        // Use the audioBuffer as needed
        pressBuffer = audioBuffer!;
      })
      .catch((error) => {
        console.error("Error loading sound file:", error);
      });

    fetch("/completed.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        // Use the audioBuffer as needed
        completeBuffer = audioBuffer!;
      })
      .catch((error) => {
        console.error("Error loading sound file:", error);
      });

    fetch("/alert.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        // Use the audioBuffer as needed
        alertBuffer = audioBuffer!;
      })
      .catch((error) => {
        console.error("Error loading sound file:", error);
      });
  }

  function playSound(event: CustomEvent) {

    const name = event.detail.name;
    var buffer:AudioBuffer | null = null;
    if (name == "press") {
      buffer = pressBuffer;
    }else if(name == "alert") {
      buffer = alertBuffer;
    }else if(name == "complete") {
      buffer = completeBuffer;
    }

    if (buffer && audioContext != null) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      return;
    }

  }

  useEffect(() => {

    setWord("x")
    loadBuffer(audioContext);
    document.addEventListener("playSound", playSound as EventListener);
    return () => {
      document.removeEventListener("playSound", playSound as EventListener);
    };
  }, [word]);

  return <></>;
};

export default AudioComponent;
