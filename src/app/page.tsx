import Link from "next/link";

/**
 * Home page
 *
 * Displays the landing screen for URBAN.AI. Includes auth options, chat view, sidebar with sidebar menu options.
 *
 * @returns
 */

export default function Home() {
  return (
    <div>
      <h1>URBAN AI</h1>
      <Link href="/chat">Chat</Link>
    </div>
  );
}
