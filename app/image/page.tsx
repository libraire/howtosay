"use client"
import AudioComponent from "@/app/components/AudioComponent";
import BoardComponent from "@/app/components/BoardComponent"
import Navbar from "@/app/components/Navbar";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center  bg-[#101010]">

    <Navbar check={false}/>
    <AudioComponent str={"xxxx"}/>
    <BoardComponent />
    </main>
  );
}
