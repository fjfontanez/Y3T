import {useRef, useState} from "react";
import {Clipboard, Download} from "lucide-react";

export default function CopyableTextarea({value, onChange}) {
  const textareaRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (textareaRef.current) {
      navigator.clipboard.writeText(textareaRef.current.value)
              .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              })
              .catch(err => console.log('Failed to copy text: ', err));
    }
  };

  const downloadSRT = () => {
    const element = document.createElement("a");
    const file = new Blob([value], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "subtitles.srt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
          <div className="relative">
      <textarea
              ref={textareaRef}
              disabled={value === ''}
              value={value}
              onChange={onChange}
              className="w-full h-48 p-4 pr-12 border-4 border-purple-950 rounded-lg resize-none"
      />
            <button
                    onClick={copyToClipboard}
                    disabled={value === ''}
                    className="absolute top-2 right-6 p-2 bg-purple-900 text-white rounded-md transition-colors disabled:opacity-50 enabled:hover:bg-purple-700"
                    title="Copy to clipboard"
            >
              <Clipboard size={20}/>
            </button>
            <button
                    onClick={downloadSRT}
                    disabled={value === ''}
                    className="absolute top-2 right-16 p-2 bg-purple-900 text-white rounded-md transition-colors disabled:opacity-50 enabled:hover:bg-purple-700"
                    title="Download SRT file"
            >
              <Download size={20}/>
            </button>
            {isCopied && (
                    <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                      Copied!
                    </div>
            )}
          </div>
  );
}
