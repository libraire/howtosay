"use client"
import AudioComponent from "./components/AudioComponent";
import BoardComponent from "./components/DemoBoardComponet"
import Navbar from "./components/Navbar";
import PriceComponent from "./components/PriceComponent";
import VideoPlayer from "./components/VideoComponent";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center  bg-[#101010]">

    <Navbar check={false}/>
    <AudioComponent str={"xxxx"}/>
    <BoardComponent />

    <VideoPlayer src="https://audio.howtosay.one/howtosayone.mp4"></VideoPlayer>
    <PriceComponent></PriceComponent>

    </main>
  );
}
