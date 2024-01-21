"use client"
import AudioComponent from "./components/AudioComponent";
import BoardComponent from "./components/BoardComponent"


export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">

    <AudioComponent str={"xxxx"}/>
    <BoardComponent/>

    </main>
  );
}
