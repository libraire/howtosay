"use client"
import AudioComponent from "@/app/components/AudioComponent";
import PractiseComponent from "@/app/components/PractiseComponent"
import Navbar from "@/app/components/Navbar";
import { fetchNextWords } from "@/app/lib/dict-api";

const gradeSelectItems = [
  { value: '21', label: 'Oxford3000' },
  { value: '16', label: 'Scene' },
  { value: '15', label: 'IELT' },
  { value: '14', label: 'TOEFL' },
  { value: '13', label: 'SAT' },
  { value: '12', label: '12th' },
  { value: '11', label: '11th' },
  { value: '10', label: '10th' },
  { value: '9', label: '9th' },
  { value: '8', label: '8th' },
  { value: '7', label: '7th' },
  { value: '6', label: '6th' },
  { value: '5', label: '5th' },
  { value: '4', label: '4th' },
  { value: '3', label: '3th' },
  { value: '2', label: '2th' },
  { value: '1', label: '1th' },
  { value: '0', label: 'Kindergarten' },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  bg-[#101010]">
      <Navbar check={false}/>
      <AudioComponent str={"xxxx"}/>
      <PractiseComponent
        mode="grade-mode"
        onClose={undefined}
        selectItems={gradeSelectItems}
        initialSelection={gradeSelectItems[0].value}
        refillOnEnd={true}
        showExample={true}
        loadWords={(selection) => fetchNextWords(selection)}
      />
    </main>
  );
}
