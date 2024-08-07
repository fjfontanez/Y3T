import {NextResponse} from "next/server";
import ytdl from "@distube/ytdl-core";
import OpenAI, {toFile} from "openai";
import {put, del} from '@vercel/blob';

export async function GET(request) {
  console.log("Downloading video...");
  const url = request.nextUrl.searchParams.get("v");
  const videoId = request.nextUrl.searchParams.get("id");

  const downloadVideo = new Promise((resolve, reject) => {
    const AGENT_COOKIES = JSON.parse(process.env.YOUTUBE_AGENT_COOKIES);
    const agent = ytdl.createAgent(AGENT_COOKIES);
    const stream = ytdl(url, {filter: 'audioonly', agent});
    let chunks = [];

    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', async () => {
      let buffer = Buffer.concat(chunks);
      try {
        // Upload to Vercel Blob
        const {url} = await put(`${videoId}.mp3`, buffer, {access: 'public'});

        console.log('File uploaded to Vercel Blob');

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        const openai = new OpenAI({apiKey: OPENAI_API_KEY});

        const response = await openai.audio.transcriptions.create({
          file: await toFile(new Blob([buffer], {type: 'audio/mpeg'}), `${videoId}.mp3`),
          model: "whisper-1",
          response_format: "verbose_json"
        });

        console.log('File transcribed');

        // Delete the file from Vercel Blob
        await del(url);
        console.log('File deleted from Vercel Blob');

        const srtOutput = convertToSRT(response);
        resolve(NextResponse.json({"srt": srtOutput}));
      } catch (err) {
        console.error('Error:', err);
        reject(new Error(err));
      }

    });

    stream.on('error', (err) => {
      console.error(err)
      reject(new Error(err));
    });
  });

  return await downloadVideo;
}

function convertToSRT(data) {
  if (!data.segments || !Array.isArray(data.segments)) {
    throw new Error('Invalid input: expected an object with a "segments" array');
  }

  return data.segments.map((segment, index) => {
    const startTime = formatTime(segment.start);
    const endTime = formatTime(segment.end);

    return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text.trim()}\n\n`;
  }).join('');
}

function formatTime(seconds) {
  const date = new Date(seconds * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const secs = date.getUTCSeconds().toString().padStart(2, '0');
  const ms = date.getUTCMilliseconds().toString().padStart(3, '0');

  return `${hours}:${minutes}:${secs},${ms}`;
}
