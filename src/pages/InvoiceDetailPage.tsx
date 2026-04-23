import { ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useTheme } from "../hooks/useTheme";
import { formatCurrency } from "../utils/formatCurrency";
import { useInvoices } from "../hooks/useInvoices";
import { useEffect, useRef, useState } from "react";
import InvoiceFormDrawer from "../components/InvoiceFormDrawer";
import { useFocusTrap } from "../hooks/useFocusTrap";

function InvoiceDetailPage() {
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { invoices, deleteInvoice, markAsPaid } = useInvoices();

  const invoice = invoices.find((item) => item.id === id);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const deleteModalRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(showDeleteModal, deleteModalRef);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowDeleteModal(false);
      }
    }

    if (showDeleteModal) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showDeleteModal]);

  if (!invoice) {
    return (
      <section className="mx-auto w-full max-w-182.5 pb-24 md:pb-0">
        <Link
          to="/"
          className={`inline-flex items-center gap-4 text-[15px] font-bold ${
            isDark ? "text-white" : "text-[#0C0E16]"
          }`}
        >
          <ChevronLeft size={18} className="text-[#7C5DFA]" strokeWidth={3} />
          Go back
        </Link>

        <div
          className={`mt-8 rounded-lg p-8 text-center ${
            isDark ? "bg-[#1E2139] text-white" : "bg-white text-[#0C0E16]"
          }`}
        >
          Invoice not found.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-182.5">
      <Link
        to="/"
        className={`inline-flex items-center gap-4 text-[15px] font-bold ${
          isDark ? "text-white" : "text-[#0C0E16]"
        }`}
      >
        <ChevronLeft size={18} className="text-[#7C5DFA]" strokeWidth={3} />
        Go back
      </Link>

      <div
        className={`mt-8 flex flex-col gap-6 rounded-lg px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 ${
          isDark ? "bg-[#1E2139]" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-4">
          <span
            className={`text-[13px] font-medium ${
              isDark ? "text-[#DFE3FA]" : "text-[#858BB2]"
            }`}
          >
            Status
          </span>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="hidden md:flex md:flex-wrap md:gap-3">
          <button
            type="button"
            onClick={() => setIsEditDrawerOpen(true)}
            className={`rounded-full px-6 py-4 text-[15px] font-bold transition ${
              isDark
                ? "bg-[#252945] text-[#DFE3FA] hover:bg-white hover:text-[#7E88C3]"
                : "bg-[#F9FAFE] text-[#7E88C3] hover:bg-[#DFE3FA]"
            }`}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="rounded-full bg-[#EC5757] px-6 py-4 text-[15px] font-bold text-white transition hover:bg-[#FF9797]"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={() => markAsPaid(invoice.id)}
            className="rounded-full bg-[#7C5DFA] px-6 py-4 text-[15px] font-bold text-white transition hover:bg-[#9277FF]"
          >
            Mark as Paid
          </button>
        </div>
      </div>

      <div
        className={`mt-6 rounded-lg px-6 py-8 md:px-8 md:py-10 ${
          isDark ? "bg-[#1E2139]" : "bg-white"
        }`}
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h1
              className={`text-[15px] font-bold ${
                isDark ? "text-white" : "text-[#0C0E16]"
              }`}
            >
              <span className="text-[#7E88C3]">#</span>
              {invoice.id}
            </h1>

            <p
              className={`mt-2 text-[13px] font-medium ${
                isDark ? "text-[#DFE3FA]" : "text-[#888EB0]"
              }`}
            >
              {invoice.description}
            </p>
          </div>

          <div
            className={`text-[13px] font-medium md:text-right ${
              isDark ? "text-[#DFE3FA]" : "text-[#888EB0]"
            }`}
          >
            <p>{invoice.senderAddress.street}</p>
            <p className="mt-1">{invoice.senderAddress.city}</p>
            <p className="mt-1">{invoice.senderAddress.postCode}</p>
            <p className="mt-1">{invoice.senderAddress.country}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="space-y-8">
            <div>
              <p className="text-[13px] font-medium text-[#7E88C3]">
                Invoice Date
              </p>
              <p
                className={`mt-3 text-2xl font-bold tracking-[-0.5px] ${
                  isDark ? "text-white" : "text-[#0C0E16]"
                }`}
              >
                {invoice.createdAt}
              </p>
            </div>

            <div>
              <p className="text-[13px] font-medium text-[#7E88C3]">
                Payment Due
              </p>
              <p
                className={`mt-3 text-2xl font-bold tracking-[-0.5px] ${
                  isDark ? "text-white" : "text-[#0C0E16]"
                }`}
              >
                {invoice.paymentDue}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[13px] font-medium text-[#7E88C3]">Bill To</p>
            <p
              className={`mt-3 text-[15px] font-bold ${
                isDark ? "text-white" : "text-[#0C0E16]"
              }`}
            >
              {invoice.clientName}
            </p>

            <div
              className={`mt-2 text-[13px] font-medium ${
                isDark ? "text-[#DFE3FA]" : "text-[#888EB0]"
              }`}
            >
              <p>{invoice.clientAddress.street}</p>
              <p className="mt-1">{invoice.clientAddress.city}</p>
              <p className="mt-1">{invoice.clientAddress.postCode}</p>
              <p className="mt-1">{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div>
            <p className="text-[13px] font-medium text-[#7E88C3]">Sent to</p>
            <p
              className={`mt-3 text-[15px] font-bold wrap-break-words ${
                isDark ? "text-white" : "text-[#0C0E16]"
              }`}
            >
              {invoice.clientEmail}
            </p>
          </div>
        </div>

        <div
          className={`mt-10 overflow-hidden rounded-lg ${
            isDark ? "bg-[#252945]" : "bg-[#F9FAFE]"
          }`}
        >
          <div className="hidden grid-cols-[1fr_80px_120px_120px] gap-4 px-8 py-8 md:grid">
            <p className="text-[13px] font-medium text-[#7E88C3]">Item Name</p>
            <p className="text-center text-[13px] font-medium text-[#7E88C3]">
              QTY.
            </p>
            <p className="text-right text-[13px] font-medium text-[#7E88C3]">
              Price
            </p>
            <p className="text-right text-[13px] font-medium text-[#7E88C3]">
              Total
            </p>
          </div>

          <div className="space-y-6 px-8 pb-8 md:space-y-0 md:px-8 md:pb-0">
            {invoice.items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="md:grid md:grid-cols-[1fr_80px_120px_120px] md:gap-4 md:py-4"
              >
                <div>
                  <p
                    className={`text-[15px] font-bold ${
                      isDark ? "text-white" : "text-[#0C0E16]"
                    }`}
                  >
                    {item.name}
                  </p>

                  <p className="mt-2 text-[13px] font-bold text-[#7E88C3] md:hidden">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>

                <p className="hidden text-center text-[15px] font-bold text-[#7E88C3] md:block">
                  {item.quantity}
                </p>

                <p className="hidden text-right text-[15px] font-bold text-[#7E88C3] md:block">
                  {formatCurrency(item.price)}
                </p>

                <p
                  className={`mt-2 text-right text-[15px] font-bold md:mt-0 ${
                    isDark ? "text-white" : "text-[#0C0E16]"
                  }`}
                >
                  {formatCurrency(item.total)}
                </p>
              </div>
            ))}
          </div>

          <div
            className={`mt-8 flex items-center justify-between px-8 py-8 ${
              isDark ? "bg-[#0C0E16]" : "bg-[#373B53]"
            }`}
          >
            <p className="text-[13px] font-medium text-white">Amount Due</p>
            <p className="text-2xl font-bold tracking-[-0.5px] text-white md:text-[32px]">
              {formatCurrency(invoice.total)}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`mt-14 flex items-center justify-center gap-2 rounded-t-lg px-6 py-6 md:hidden ${
          isDark ? "bg-[#1E2139]" : "bg-white"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsEditDrawerOpen(true)}
          className={`rounded-full px-6 py-4 text-[15px] font-bold transition ${
            isDark
              ? "bg-[#252945] text-[#DFE3FA] hover:bg-white hover:text-[#7E88C3]"
              : "bg-[#F9FAFE] text-[#7E88C3] hover:bg-[#DFE3FA]"
          }`}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="rounded-full bg-[#EC5757] px-6 py-4 text-[15px] font-bold text-white transition hover:bg-[#FF9797]"
        >
          Delete
        </button>

        <button
          type="button"
          onClick={() => markAsPaid(invoice.id)}
          className="rounded-full bg-[#7C5DFA] px-6 py-4 text-[15px] font-bold text-white transition hover:bg-[#9277FF]"
        >
          Mark as Paid
        </button>
      </div>

      {showDeleteModal && invoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
            aria-hidden="true"
          />

          <div
            ref={deleteModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className={`relative z-10 w-full max-w-md rounded-lg p-8 ${
              isDark ? "bg-[#1E2139]" : "bg-white"
            }`}
          >
            <h2
              id="delete-modal-title"
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-[#0C0E16]"
              }`}
            >
              Confirm Deletion
            </h2>

            <p
              className={`mt-4 text-[13px] leading-6 ${
                isDark ? "text-[#DFE3FA]" : "text-[#888EB0]"
              }`}
            >
              Are you sure you want to delete invoice #{invoice.id}? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className={`rounded-full px-6 py-4 text-[15px] font-bold transition ${
                  isDark
                    ? "bg-[#252945] text-[#DFE3FA] hover:bg-white hover:text-[#7E88C3]"
                    : "bg-[#F9FAFE] text-[#7E88C3] hover:bg-[#DFE3FA]"
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteInvoice(invoice.id);
                  setShowDeleteModal(false);
                  navigate("/");
                }}
                className="rounded-full bg-[#EC5757] px-6 py-4 text-[15px] font-bold text-white transition hover:bg-[#FF9797]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <InvoiceFormDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        mode="edit"
        invoiceToEdit={invoice}
      />
    </section>
  );
}

export default InvoiceDetailPage;
