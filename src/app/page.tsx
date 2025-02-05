import { SidebarProvider } from "@/components/ui/sidebar";
import Root from "./components/root";

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
      <SidebarProvider defaultOpen={false}>
        <Root />
      </SidebarProvider>
    </div>
  );
}
