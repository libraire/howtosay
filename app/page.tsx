"use client"

import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#101010]">
      <Navbar check={false} />
      <section className="flex w-full flex-1 items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-medium tracking-tight text-white">Home</h1>
          <p className="mt-3 text-sm text-white/55">
            This page is intentionally blank for the next homepage redesign.
          </p>
        </div>
      </section>
    </main>
  );
}
