import {NextResponse} from "next/server";
import {generateText} from "ai";
import {openai} from "@ai-sdk/openai";

export async function POST(request) {
  try {
    const {transcription, selectedLanguage} = await request.json();
    const {text} = await generateText({
      model: openai("gpt-4o"),
      system: 'You are a helpful translator assistant and your job is to receive SRT formatted text in one language and translate to the desired language. Always making sure to translate as accurate as possible and to keep the same formatting on the response.',
      prompt: `Translate the following SRT formatted text into ${selectedLanguage} and keep the format, only reply with the translated SRT, don't include anything special like "\`\`\`": ${transcription}`,
      temperature: 0.2
    })
    return NextResponse.json({translatedText: text});
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({error: err.message}, {status: 500});
  }
}
