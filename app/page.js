import TranscribeYouTube from "@/app/components/TranscribeYouTube";
import Image from "next/image";

export default function Home() {
  return (
          <main className="w-full min-h-screen p-8">
            <div className="flex flex-col items-center space-y-8 mb-12">
              <div className="flex items-center space-x-4">
                <Image className="w-24 h-24" src={"/Y3TLogo.png"} alt="Logo" width={100} height={100}/>
                <h1 className="text-4xl text-white font-extrabold">YouTube Transcriber & Translator</h1>
              </div>
              <TranscribeYouTube/>
            </div>
          </main>
  );
}
