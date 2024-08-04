'use client';

import {useState} from "react";
import SubtitleTranslator from "@/app/components/SubtitleTranslator";
import {v4 as uuidv4} from "uuid";

export default function TranscribeYouTube() {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function transcribeVideo() {
    setIsLoading(true);
    // const videoIdResponse = await fetch(`/api/ytdl/info?v=${videoUrl}`);
    // const videoIdJson = await videoIdResponse.json();
    const videoId = uuidv4();
    const response = await fetch(`/api/ytdl?v=${videoUrl}&id=${videoId}`);
    const data = await response.json();
    console.log(data);
    setTranscript(data.srt);
    setIsLoading(false);
  }


  return (
          <div className="w-full max-w-3xl space-y-6">
            <div className="space-y-4 text-center">
              <label htmlFor="youtubeUrl" className="block text-2xl text-white font-bold">
                Enter the YouTube Video Url
              </label>
              <input id="youtubeUrl" className="w-full h-12 px-4 border-4 border-purple-900 rounded-lg shadow-lg"
                     onChange={(e) => setVideoUrl(e.target.value)} type="text"
                     placeholder="https://www.youtube.com/watch?v=MuSfw8PL3jw"/>
              <div className="flex justify-center">
                <button
                        className="w-64 bg-purple-900 text-white text-xl font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                        disabled={isLoading}
                        onClick={transcribeVideo}>
                  {isLoading ?
                          (<>
                            <div
                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"></div>
                            <span>Transcribing...</span>
                          </>) :
                          (<span>Transcribe</span>)}
                </button>
              </div>
              <textarea defaultValue={transcript}
                        className="w-full h-48 p-4 border-4 border-purple-950 rounded-lg"></textarea>
              <SubtitleTranslator transcription={transcript}/>
            </div>
          </div>);
}
