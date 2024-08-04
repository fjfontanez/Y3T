import {NextResponse} from "next/server";
import ytdl from "@distube/ytdl-core";
import OpenAI from "openai";

export async function GET(request) {
  console.log("Downloading video...");
  const url = request.nextUrl.searchParams.get("v");
  const videoId = request.nextUrl.searchParams.get("id");
  // console.log("Get video info...");
  // const info = await ytdl.getInfo(url);
  // const videoId = info.videoDetails.videoId;
  // const videoId = url.split("?v=")[1];

  const downloadVideo = new Promise((resolve, reject) => {
    /*setTimeout(() => {
      resolve(NextResponse.json({"status": "success"}));
    }, 300);*/
    ytdl(url, {filter: 'audioonly'})
            .pipe(require("fs")
                    .createWriteStream(`${videoId}.mp3`))
            .on('close', () => {
              console.log('done')
              const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
              const openai = new OpenAI({apiKey: OPENAI_API_KEY});
              openai.audio.transcriptions.create({
                file: require("fs").createReadStream(`${videoId}.mp3`),
                model: "whisper-1",
                response_format: "verbose_json"
              }).then((response) => {
                require("fs")
                        .unlink(`${videoId}.mp3`, (err) => {
                          if (err) throw err;
                          console.log(`${videoId}.mp3 file was deleted`);
                        })
                const srtOutput = convertToSRT(response);
                resolve(NextResponse.json({"srt": srtOutput}));
              });

            })
            .on('error', (err) => {
              console.error(err)
              reject(NextResponse.json({"status": "error"}));
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

    return `${index + 1} \n${startTime} --> ${endTime} \n${segment.text.trim()} \n\n`;
    /*return index === 0 ? `\t\t\t${index + 1} \n\t\t\t${startTime} --> ${endTime} \n\t\t\t${segment.text.trim()} \n`
            : `\t\t\t${index + 1} \n\t\t\t${startTime} --> ${endTime} \n\t\t\t${segment.text.trim()} \n`;*/
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
