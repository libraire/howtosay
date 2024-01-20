"use client"
import BoardComponent from "./components/BoardComponent"


export default function Home() {

  function showAlertOnMobile() {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // User is on a mobile device
      alert('Sorry, this app is not supported on mobile devices.');
    }
  }
  
  showAlertOnMobile()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">

    <BoardComponent/>

    </main>
  );
}
