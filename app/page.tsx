import { ClipMenu } from "./components/menu";
import InkMouse from "./components/mouseeffect/ink";
import CalendarLink from "./components/calendarLink";

export default function Page() {
  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <InkMouse />
      <div className="mx-auto max-w-5xl px-6">
        
        <ClipMenu />
        
      </div>
      <CalendarLink />
    </main>
  );
}