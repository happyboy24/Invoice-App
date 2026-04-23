import { Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

function MobileNavbar() {
  const { toggleTheme } = useTheme();

  return (
    <header className="flex h-18 items-center justify-between bg-[#373B53] lg:hidden">
      <div className="relative flex h-full w-18 items-center justify-center overflow-hidden rounded-r-[20px] bg-[#7C5DFA]">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-tl-[20px] bg-[#9277FF]" />

        <div className="relative h-7 w-7 rounded-full bg-white">
          <div className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#7C5DFA]" />
        </div>
      </div>

      <div className="flex h-full items-center">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-full items-center justify-center px-6 text-[#7E88C3] transition hover:text-white"
        >
          <Moon size={20} fill="currentColor" strokeWidth={0} />
        </button>

        <div className="flex h-full items-center justify-center border-l border-[#494E6E] px-6">
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="User avatar"
            className="h-8 w-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}

export default MobileNavbar;
