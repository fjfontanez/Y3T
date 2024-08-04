import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Y3T",
  description: "YouTube Transcriber powered by OpenAI Whisper and ChatGPT to transcribe YouTube videos and translate the resulting subtitle to different languages.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
