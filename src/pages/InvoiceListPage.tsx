import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import InvoiceCard from "../components/InvoiceCard";
import { useTheme } from "../hooks/useTheme";
import InvoiceFormDrawer from "../components/InvoiceFormDrawer";
import { useInvoices } from "../hooks/useInvoices";
import emptyIllustration from "../assets/illustration-empty.png";

function InvoiceListPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { invoices } = useInvoices();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const filterRef = useRef<HTMLDivElement | null>(null);

  const [showNewInvoiceDrawer, setShowNewInvoiceDrawer] = useState(false);

  function toggleStatus(status: string) {
    setSelectedStatuses((currentStatuses) => {
      if (currentStatuses.includes(status)) {
        return currentStatuses.filter(
          (currentStatus) => currentStatus !== status,
        );
      }

      return [...currentStatuses, status];
    });
  }

  const filteredInvoices = useMemo(() => {
    if (selectedStatuses.length === 0) {
      return invoices;
    }

    return invoices.filter((invoice) =>
      selectedStatuses.includes(invoice.status),
    );
  }, [selectedStatuses, invoices]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-182.5">
      <div className="flex items-start justify-between gap-4 md:items-center">
        <div>
          <h1
            className={`text-3xl font-bold leading-none md:text-4xl ${
              isDark ? "text-white" : "text-[#0C0E16]"
            }`}
          >
            Invoices
          </h1>

          <p
            className={`mt-2 text-sm font-medium ${
              isDark ? "text-[#DFE3FA]" : "text-[#888EB0]"
            }`}
          >
            There are {filteredInvoices.length} total invoices
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              className={`flex items-center gap-2 text-sm font-bold transition cursor-pointer ${
                isDark ? "text-white" : "text-[#0C0E16]"
              }`}
            >
              <span>Filter by status</span>

              <ChevronDown
                size={18}
                className={`text-[#7C5DFA] transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFilters && (
              <div
                className={`absolute right-0 top-9 z-20 w-48 rounded-lg px-6 py-6 shadow-[0_10px_20px_rgba(72,84,159,0.25)] ${
                  isDark ? "bg-[#252945]" : "bg-white"
                }`}
              >
                <div className="space-y-4">
                  {["draft", "pending", "paid"].map((status) => (
                    <label
                      key={status}
                      className={`flex cursor-pointer items-center gap-3 text-[15px] font-bold capitalize ${
                        isDark ? "text-white" : "text-[#0C0E16]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => {
                          toggleStatus(status);
                        }}
                        className="h-4 w-4 accent-[#7C5DFA]"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowNewInvoiceDrawer(true)}
            className="inline-flex h-12 items-center gap-3 rounded-full bg-[#7C5DFA] pl-2 pr-4 text-sm font-bold text-white transition hover:bg-[#9277FF]"
          >
            <span className="flex h-8 w-10 md:h-8 md:w-8 items-center justify-center rounded-full bg-white">
              <Plus size={16} className="text-[#7C5DFA]" strokeWidth={3} />
            </span>
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))
        ) : (
          <div
            className={`mx-auto flex max-w-sm flex-col items-center pt-4 pb-4 text-center ${
              isDark ? "bg-none" : "bg-none"
            }`}
          >
            <img
              src={emptyIllustration}
              alt="No invoices"
              className="mx-auto w-60.25 max-w-full"
            />

            <h2
              className={`mt-16 text-2xl font-bold tracking-[-0.75px] ${
                isDark ? "text-white" : "text-[#0C0E16]"
              }`}
            >
              There is nothing here
            </h2>

            <p
              className={`mt-6 text-[13px] font-medium leading-3.75 ${
                isDark ? "text-[#888EB0]" : "text-[#888EB0]"
              }`}
            >
              Create an invoice by clicking the
              <br />
              New Invoice button and get started
            </p>
          </div>
        )}
      </div>

      <InvoiceFormDrawer
        isOpen={showNewInvoiceDrawer}
        onClose={() => setShowNewInvoiceDrawer(false)}
      />
    </section>
  );
}

export default InvoiceListPage;
