"use client"
import AudioComponent from "./components/AudioComponent";
import BoardComponent from "./components/BoardComponent"
import Navbar from "./components/Navbar";


export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center  bg-gray-900">

    <Navbar></Navbar>
    <AudioComponent str={"xxxx"}/>
    <BoardComponent />

    </main>
  );
}
