import { useTheme } from "../hooks/useTheme";
import type { InvoiceStatus } from "../types/invoice";

interface StatusBadgeProps {
  status: InvoiceStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const statusStyles: Record<InvoiceStatus, string> = {
    paid: "bg-[rgba(51,214,159,0.06)] text-[#33D69F]",
    pending: "bg-[rgba(255,143,0,0.06)] text-[#FF8F00]",
    draft: isDark
      ? "bg-[rgba(223,227,250,0.06)] text-[#DFE3FA]"
      : "bg-[rgba(55,59,83,0.06)] text-[#373B53]",
  };

  return (
    <div
      className={`inline-flex h-10 min-w-26 items-center justify-center gap-2 rounded-md px-4 text-[15px] font-bold capitalize tracking-[-0.25px] ${statusStyles[status]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      <span>{status}</span>
    </div>
  );
}

export default StatusBadge;
