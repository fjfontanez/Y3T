import {generateText} from 'ai' // Vercel AI SDK ***
import {openai} from '@ai-sdk/openai'
import {useState} from "react"; // Vercel AI SDK ***

export default function SubtitleTranslator({transcription}) {

  const languages = [
    {code: null, name: 'Select a Language', flag: '🏳️'},
    {code: 'en', name: 'English', flag: '🇬🇧'},
    {code: 'es', name: 'Spanish', flag: '🇪🇸'},
    {code: 'fr', name: 'French', flag: '🇫🇷'},
    {code: 'de', name: 'German', flag: '🇩🇪'},
    {code: 'it', name: 'Italian', flag: '🇮🇹'},
    {code: 'pt', name: 'Portuguese', flag: '🇵🇹'},
    {code: 'ru', name: 'Russian', flag: '🇷🇺'},
    {code: 'tr', name: 'Turkish', flag: '🇹🇷'},
    {code: 'ja', name: 'Japanese', flag: '🇯🇵'},
  ];

  async function translate() {
    setIsLoading(true);
    const response = await fetch('/api/translate',
            {method: 'POST', body: JSON.stringify({transcription, selectedLanguage})});
    const data = await response.json();
    console.log(data);
    setTranslatedSubtitles(data.translatedText);
    setIsLoading(false);
  }

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [translatedSubtitles, setTranslatedSubtitles] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
          <>
            <div className="flex justify-between items-center space-x-4">
              <select defaultValue={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-1/2 h-12 px-4 border-4 border-purple-950 rounded-lg bg-white text-center"
              >
                {languages.map((lang) => (
                        <option key={lang.code} value={lang.code} className="">
                          {lang.flag} {lang.name}
                        </option>
                ))}
              </select>
              <button
                      onClick={translate}
                      disabled={isLoading}
                      className="w-1/2 bg-purple-900 text-white text-xl font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors shadow-lg flex justify-center items-center space-x-2"
              >
                {isLoading ? (
                        <>
                          <div
                                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                  role="status"
                          ></div>
                          <span>Translating...</span>
                        </>
                ) : (
                        <span>Translate</span>
                )}
              </button>
            </div>
            <textarea defaultValue={translatedSubtitles}
                      className="w-full h-48 border-4 border-purple-950 rounded-lg"></textarea>
          </>
  );
}
