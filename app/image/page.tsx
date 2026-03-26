"use client"
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import Navbar from "@/app/components/Navbar";
import type { Word } from "@/app/components/types";
import { fetchImageWords, fetchNextWords } from "@/app/lib/dict-api";

const imageSelectItems = [
  { label: "Fruit", value: "fruit" },
  { label: "Food", value: "food" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Body", value: "body" },
  { label: "Room", value: "room" },
  { label: "Animal", value: "animal" },
  { label: "Emoji-Activity", value: "emoji-1" },
  { label: "Emoji-Animal&Nature", value: "emoji-2" },
  { label: "Emoji-Food&Drink", value: "emoji-3" },
  { label: "Emoji-Object", value: "emoji-4" },
  { label: "Emoji-Travel&Place", value: "emoji-5" },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  bg-[#101010]">
      <Navbar check={false}/>
      <AudioComponent str={"xxxx"}/>
      <PractiseComponent
        mode="image-mode"
        onClose={undefined}
        selectItems={imageSelectItems}
        initialSelection={imageSelectItems[0].value}
        refillOnEnd={true}
        showExample={false}
        loadWords={async (selection) => {
          if (selection.includes("emoji")) {
            return (await fetchNextWords(selection)) as Word[]
          }

          return (await fetchImageWords(selection)) as Word[]
        }}
      />
    </main>
  );
}
