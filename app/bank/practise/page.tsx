"use client"
import AudioComponent from "@/app/components/AudioComponent";
import BoardComponent from "@/app/components/BoardComponent"


export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">

    <AudioComponent str={"xxxx"}/>
    <BoardComponent/>

    </main>
  );
}
