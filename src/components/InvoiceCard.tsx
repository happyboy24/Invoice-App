import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import type { Invoice } from "../types/invoice";
import StatusBadge from "./StatusBadge";
import { formatCurrency } from "../utils/formatCurrency";

interface InvoiceCardProps {
  invoice: Invoice;
}

function InvoiceCard({ invoice }: InvoiceCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Link
      to={`/invoice/${invoice.id}`}
      className={`block rounded-lg px-6 py-6 transition hover:border-[#7C5DFA] md:px-8 md:py-4 ${
        isDark
          ? "border border-transparent bg-[#1E2139]"
          : "border border-transparent bg-white shadow-[0_10px_10px_-10px_rgba(72,84,159,0.100397)]"
      }`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-6 md:flex-1 md:flex-row md:items-center md:gap-10">
          <div className="flex items-start justify-between md:min-w-20 md:block">
            <p
              className={`text-[15px] font-bold tracking-[-0.25px] ${
                isDark ? "text-white" : "text-[#0C0E16]"
              }`}
            >
              <span className="text-[#7E88C3]">#</span>
              {invoice.id}
            </p>

            <p
              className={`text-[13px] font-medium md:hidden ${
                isDark ? "text-[#DFE3FA]" : "text-[#858BB2]"
              }`}
            >
              {invoice.clientName}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 md:flex-1 md:justify-start md:gap-10">
            <p
              className={`text-[13px] font-medium ${
                isDark ? "text-[#DFE3FA]" : "text-[#888EB0]"
              }`}
            >
              Due {invoice.paymentDue}
            </p>

            <div className="md:hidden">
              <StatusBadge status={invoice.status} />
            </div>

            <p
              className={`hidden text-[13px] font-medium md:block ${
                isDark ? "text-[#DFE3FA]" : "text-[#858BB2]"
              }`}
            >
              {invoice.clientName}
            </p>
          </div>

          <p
            className={`text-[24px] font-bold tracking-[-0.8px] md:text-[16px] ${
              isDark ? "text-white" : "text-[#0C0E16]"
            }`}
          >
            {formatCurrency(invoice.total)}
          </p>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <StatusBadge status={invoice.status} />

          <ChevronRight
            size={18}
            className="text-[#7C5DFA]"
            strokeWidth={2.5}
          />
        </div>
      </div>
    </Link>
  );
}

export default InvoiceCard;
