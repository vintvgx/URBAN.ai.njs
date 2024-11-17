import COMMUNITE_MainContent from "./components/Chat/COMMUNITE_MainContent";
import MainComponent from "./components/MainComponent";

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
      <COMMUNITE_MainContent />
      <MainComponent />
    </div>
  );
}
