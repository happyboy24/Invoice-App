import { createContext, useMemo, useState, type ReactNode } from "react";
import rawInvoices from "../data/data.json";
import type { Invoice } from "../types/invoice";

type CreateInvoiceInput = Omit<Invoice, "id">;

type InvoiceContextType = {
  invoices: Invoice[];
  createInvoice: (invoice: CreateInvoiceInput) => void;
  updateInvoice: (id: string, updatedInvoice: CreateInvoiceInput) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const STORAGE_KEY = "invoice-app-invoices";

// function getInitialInvoices(): Invoice[] {
//   const savedInvoices = localStorage.getItem(STORAGE_KEY);

//   if (savedInvoices) {
//     return JSON.parse(savedInvoices) as Invoice[];
//   }

//   return rawInvoices as Invoice[];
// }

function getInitialInvoices(): Invoice[] {
  const savedInvoices = localStorage.getItem(STORAGE_KEY);

  if (!savedInvoices) {
    return rawInvoices as Invoice[];
  }

  try {
    const parsedInvoices = JSON.parse(savedInvoices) as Invoice[];

    if (Array.isArray(parsedInvoices) && parsedInvoices.length > 0) {
      return parsedInvoices;
    }

    return rawInvoices as Invoice[];
  } catch {
    return rawInvoices as Invoice[];
  }
}

type InvoiceProviderProps = {
  children: ReactNode;
};

export function InvoiceProvider({ children }: InvoiceProviderProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(getInitialInvoices);

  function createInvoice(invoice: CreateInvoiceInput) {
    const newInvoice: Invoice = {
      ...invoice,
      id: `RT${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setInvoices((currentInvoices) => {
      const updatedInvoices = [newInvoice, ...currentInvoices];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
      return updatedInvoices;
    });
  }

  function updateInvoice(id: string, updatedInvoice: CreateInvoiceInput) {
    setInvoices((currentInvoices) =>
      currentInvoices.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              ...updatedInvoice,
            }
          : invoice,
      ),
    );
  }

  function deleteInvoice(id: string) {
    setInvoices((currentInvoices) => {
      const updatedInvoices = currentInvoices.filter(
        (invoice) => invoice.id !== id,
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
      return updatedInvoices;
    });
  }

  function markAsPaid(id: string) {
    setInvoices((currentInvoices) => {
      const updatedInvoices = currentInvoices.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              status: "paid" as const,
            }
          : invoice,
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
      return updatedInvoices;
    });
  }

  const value = useMemo(
    () => ({
      invoices,
      createInvoice,
      deleteInvoice,
      updateInvoice,
      markAsPaid,
    }),
    [invoices],
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

export { InvoiceContext };
