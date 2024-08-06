'use client';

import {useState} from "react";
import SubtitleTranslator from "@/app/components/SubtitleTranslator";
import {v4 as uuidv4} from "uuid";
import CopyableTextarea from "@/app/components/CopyableTextarea";


export default function TranscribeYouTube() {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  async function transcribeVideo() {
    setError('');
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }
    if (!isValidYouTubeUrl(videoUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    try {
      const videoId = uuidv4();
      const response = await fetch(`/api/ytdl?v=${videoUrl}&id=${videoId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }
      const data = await response.json();
      setTranscript(data.srt);
    } catch (err) {
      setError('An error occurred while transcribing the video, try with a shorter video');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }


  return (
          <div className="w-full max-w-3xl space-y-6">
            <div className="space-y-4 text-center">
              <label htmlFor="youtubeUrl" className="block text-2xl text-white font-bold">
                Enter the YouTube Video Url
              </label>
              <input id="youtubeUrl"
                     className="w-full h-12 px-4 border-4 border-purple-900 rounded-lg shadow-lg"
                     onChange={(e) => setVideoUrl(e.target.value)}
                     type="text"
                     placeholder="https://www.youtube.com/watch?v=MuSfw8PL3jw"
              />
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-center">
                <button
                        className="w-64 bg-purple-900 text-white text-xl font-bold py-3 px-6 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                        disabled={isLoading}
                        onClick={transcribeVideo}>
                  {isLoading ?
                          (<>
                            <div
                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    ></div>
                            <span>Transcribing...</span>
                          </>) :
                          (<span>Transcribe</span>)}
                </button>
              </div>
              <CopyableTextarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
              />
              <SubtitleTranslator transcription={transcript}/>
            </div>
          </div>);
}
