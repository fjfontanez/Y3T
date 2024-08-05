import {useState} from "react";
import CopyableTextarea from "@/app/components/CopyableTextarea"; // Vercel AI SDK ***

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

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [translatedSubtitles, setTranslatedSubtitles] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function translate() {
    setError('');
    if (selectedLanguage === null) {
      setError('Please select a language to translate to');
      return;
    }

    if (transcription === '') {
      setError('Please generate a transcription first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/translate',
              {method: 'POST', body: JSON.stringify({transcription, selectedLanguage})});
      if (!response.ok) {
        throw new Error('Failed to fetch translation');
      }
      const data = await response.json();
      setTranslatedSubtitles(data.translatedText);
    } catch (err) {
      setError('An error occurred while translating the transcript of the video');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
          <>
            <div className="flex justify-between items-center space-x-4">
              <select defaultValue={selectedLanguage}
                      disabled={transcription === ''}
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
                      disabled={isLoading || (transcription === '')}
                      className="w-1/2 bg-purple-900 text-white text-xl font-bold py-3 px-6 rounded-lg transition-colors shadow-lg flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
              >
                {isLoading ? (
                        <>
                          <div
                                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                          <span>Translating...</span>
                        </>
                ) : (
                        <span>Translate</span>
                )}
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <CopyableTextarea
                    value={translatedSubtitles}
                    onChange={(e) => setTranslatedSubtitles(e.target.value)} />
            {/*<textarea defaultValue={translatedSubtitles}
                      disabled={translatedSubtitles === ''}
                      className="w-full h-48 border-4 border-purple-950 rounded-lg"></textarea>*/}
          </>
  );
}
