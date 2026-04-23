import { Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

function Sidebar() {
  const { toggleTheme } = useTheme();

  return (
    <aside className="hidden w-25.75 flex-col justify-between bg-[#373B53] lg:flex">
      <div className="relative flex h-25.75 items-center justify-center overflow-hidden rounded-r-[20px] bg-[#7C5DFA]">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-tl-[20px] bg-[#9277FF]" />

        <div className="relative h-12 w-12 rounded-full bg-white">
          <div className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#7C5DFA]" />
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-22 w-full items-center justify-center text-[#7E88C3] transition hover:text-white"
        >
          <Moon size={20} fill="currentColor" strokeWidth={0} />
        </button>

        <div className="flex h-22 w-full items-center justify-center border-t border-[#494E6E]">
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="User avatar"
            className="h-10 w-10 rounded-full"
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
