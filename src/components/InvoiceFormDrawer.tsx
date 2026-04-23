import { useTheme } from "../hooks/useTheme";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInvoices } from "../hooks/useInvoices";
import { Trash2 } from "lucide-react";
import type { Invoice } from "../types/invoice";
import { useFocusTrap } from "../hooks/useFocusTrap";
interface InvoiceFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  invoiceToEdit?: Invoice | null;
}

type FormItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

const initialFormData = {
  senderStreet: "",
  senderCity: "",
  senderPostCode: "",
  senderCountry: "",
  clientName: "",
  clientEmail: "",
  clientStreet: "",
  clientCity: "",
  clientPostCode: "",
  clientCountry: "",
  invoiceDate: "",
  paymentTerms: "30",
  projectDescription: "",
};

const createEmptyItem = (): FormItem => ({
  id: crypto.randomUUID(),
  name: "",
  quantity: 1,
  price: 0,
});

function InvoiceFormDrawer({
  isOpen,
  onClose,
  mode = "create",
  invoiceToEdit = null,
}: InvoiceFormDrawerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { createInvoice, updateInvoice } = useInvoices();

  const [formData, setFormData] = useState(initialFormData);
  const [itemList, setItemList] = useState<FormItem[]>([createEmptyItem()]);

  const drawerRef = useRef<HTMLElement | null>(null);
  useFocusTrap(isOpen, drawerRef);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && invoiceToEdit) {
      setFormData({
        senderStreet: invoiceToEdit.senderAddress.street,
        senderCity: invoiceToEdit.senderAddress.city,
        senderPostCode: invoiceToEdit.senderAddress.postCode,
        senderCountry: invoiceToEdit.senderAddress.country,
        clientName: invoiceToEdit.clientName,
        clientEmail: invoiceToEdit.clientEmail,
        clientStreet: invoiceToEdit.clientAddress.street,
        clientCity: invoiceToEdit.clientAddress.city,
        clientPostCode: invoiceToEdit.clientAddress.postCode,
        clientCountry: invoiceToEdit.clientAddress.country,
        invoiceDate: invoiceToEdit.createdAt,
        paymentTerms: String(invoiceToEdit.paymentTerms),
        projectDescription: invoiceToEdit.description,
      });

      setItemList(
        invoiceToEdit.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      );

      setErrors({});
    }

    if (mode === "create") {
      resetForm();
    }
  }, [isOpen, mode, invoiceToEdit]);

  const grandTotal = useMemo(() => {
    return itemList.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
  }, [itemList]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  function buildInvoice(status: "draft" | "pending") {
    const invoiceDate = new Date(formData.invoiceDate);
    const paymentTerms = Number(formData.paymentTerms);

    const paymentDue = new Date(invoiceDate);
    paymentDue.setDate(paymentDue.getDate() + paymentTerms);

    const normalizedItems = itemList.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    return {
      createdAt: formData.invoiceDate,
      paymentDue: paymentDue.toISOString().split("T")[0],
      description: formData.projectDescription,
      paymentTerms,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      status,
      senderAddress: {
        street: formData.senderStreet,
        city: formData.senderCity,
        postCode: formData.senderPostCode,
        country: formData.senderCountry,
      },
      clientAddress: {
        street: formData.clientStreet,
        city: formData.clientCity,
        postCode: formData.clientPostCode,
        country: formData.clientCountry,
      },
      items: normalizedItems,
      total: grandTotal,
    };
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    // clear the error for a specific field so the message goes away
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  }

  function handleItemChange(
    itemId: string,
    field: "name" | "quantity" | "price",
    value: string,
  ) {
    setItemList((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "price"
                  ? Number(value)
                  : value,
            }
          : item,
      ),
    );

    setErrors((currentErrors) => ({
      ...currentErrors,
      items: "",
    }));
  }

  function handleAddNewItem() {
    setItemList((currentItems) => [...currentItems, createEmptyItem()]);
  }

  function handleRemoveItem(itemId: string) {
    setItemList((currentItems) => {
      if (currentItems.length === 1) {
        return [createEmptyItem()];
      }

      return currentItems.filter((item) => item.id !== itemId);
    });
  }

  function handleDiscard() {
    resetForm();
    onClose();
  }

  function resetForm() {
    setFormData(initialFormData);
    setItemList([createEmptyItem()]);
    setErrors({});
  }

  function handleSaveAsDraft() {
    const isFormValid = validateForm();

    if (!isFormValid) return;

    const newInvoice = buildInvoice("draft");

    if (mode === "edit" && invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, newInvoice);
    } else {
      createInvoice(newInvoice);
    }

    resetForm();
    onClose();
  }

  function handleSaveAndSend() {
    const isFormValid = validateForm();

    if (!isFormValid) return;

    const newInvoice = buildInvoice("pending");

    if (mode === "edit" && invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, newInvoice);
    } else {
      createInvoice(newInvoice);
    }

    resetForm();
    onClose();
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!formData.senderStreet.trim()) {
      newErrors.senderStreet = "Street address is required";
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client's name is required";
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Client's email is required";
    } else if (!isValidEmail(formData.clientEmail)) {
      newErrors.clientEmail = "Please enter a valid email";
    }

    if (!formData.clientStreet.trim()) {
      newErrors.clientStreet = "Street address is required";
    }

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = "Invoice date is required";
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = "Project description is required";
    }

    const hasInvalidItem = itemList.some(
      (item) => !item.name.trim() || item.quantity <= 0 || item.price <= 0,
    );

    if (hasInvalidItem) {
      newErrors.items = "Each item must have a name, quantity, and price";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-drawer-title"
        className={`absolute left-0 top-0 h-full w-full overflow-y-auto overflow-x-hidden px-6 py-8 transition md:max-w-155 md:px-14 ${
          isDark ? "bg-[#141625]" : "bg-white"
        } custom-scrollbar`}
      >
        <h2
          id="invoice-drawer-title"
          className={`text-2xl font-bold tracking-[-0.5px] ${
            isDark ? "text-white" : "text-[#0C0E16]"
          }`}
        >
          {mode === "edit" && invoiceToEdit
            ? `Edit #${invoiceToEdit.id}`
            : "New Invoice"}
        </h2>

        <div className="mt-10 space-y-10">
          <div className="space-y-6">
            <h3 className="text-[15px] font-bold text-[#7C5DFA]">Bill From</h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="senderStreet"
                  className={`mb-2 block text-[13px] font-medium ${
                    isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                  }`}
                >
                  Street Address
                </label>
                <input
                  id="senderStreet"
                  name="senderStreet"
                  type="text"
                  value={formData.senderStreet}
                  onChange={handleInputChange}
                  className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                    errors.senderStreet
                      ? "border-[#EC5757]"
                      : isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                  }`}
                />
                {errors.senderStreet && (
                  <p className="mt-2 text-[13px] font-medium text-[#EC5757]">
                    {errors.senderStreet}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="senderCity"
                    className={`mb-2 block text-[13px] font-medium ${
                      isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                    }`}
                  >
                    City
                  </label>
                  <input
                    id="senderCity"
                    name="senderCity"
                    type="text"
                    value={formData.senderCity}
                    onChange={handleInputChange}
                    className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                      isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="senderPostCode"
                    className={`mb-2 block text-[13px] font-medium ${
                      isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                    }`}
                  >
                    Post Code
                  </label>
                  <input
                    id="senderPostCode"
                    name="senderPostCode"
                    type="text"
                    value={formData.senderPostCode}
                    onChange={handleInputChange}
                    className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                      isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="senderCountry"
                    className={`mb-2 block text-[13px] font-medium ${
                      isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                    }`}
                  >
                    Country
                  </label>
                  <input
                    id="senderCountry"
                    name="senderCountry"
                    type="text"
                    value={formData.senderCountry}
                    onChange={handleInputChange}
                    className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                      isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[15px] font-bold text-[#7C5DFA]">Bill To</h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="clientName"
                  className={`mb-2 block text-[13px] font-medium ${
                    isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                  }`}
                >
                  Client's Name
                </label>
                <input
                  id="clientName"
                  name="clientName"
                  type="text"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                    errors.clientName
                      ? "border-[#EC5757]"
                      : isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                  }`}
                />
                {errors.clientName && (
                  <p className="mt-2 text-[13px] font-medium text-[#EC5757]">
                    {errors.clientName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="clientEmail"
                  className={`mb-2 block text-[13px] font-medium ${
                    isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                  }`}
                >
                  Client's Email
                </label>
                <input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                    errors.clientEmail
                      ? "border-[#EC5757]"
                      : isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                  }`}
                />
                {errors.clientEmail && (
                  <p className="mt-2 text-[13px] font-medium text-[#EC5757]">
                    {errors.clientEmail}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="clientStreet"
                  className={`mb-2 block text-[13px] font-medium ${
                    isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                  }`}
                >
                  Street Address
                </label>
                <input
                  id="clientStreet"
                  name="clientStreet"
                  type="text"
                  value={formData.clientStreet}
                  onChange={handleInputChange}
                  className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                    errors.clientStreet
                      ? "border-[#EC5757]"
                      : isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                  }`}
                />
                {errors.clientStreet && (
                  <p className="mt-2 text-[13px] font-medium text-[#EC5757]">
                    {errors.clientStreet}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="clientCity"
                    className={`mb-2 block text-[13px] font-medium ${
                      isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                    }`}
                  >
                    City
                  </label>
                  <input
                    id="clientCity"
                    name="clientCity"
                    type="text"
                    value={formData.clientCity}
                    onChange={handleInputChange}
                    className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                      isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="clientPostCode"
                    className={`mb-2 block text-[13px] font-medium ${
                      isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                    }`}
                  >
                    Post Code
                  </label>
                  <input
                    id="clientPostCode"
                    name="clientPostCode"
                    type="text"
                    value={formData.clientPostCode}
                    onChange={handleInputChange}
                    className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                      isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="clientCountry"
                    className={`mb-2 block text-[13px] font-medium ${
                      isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                    }`}
                  >
                    Country
                  </label>
                  <input
                    id="clientCountry"
                    name="clientCountry"
                    type="text"
                    value={formData.clientCountry}
                    onChange={handleInputChange}
                    className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                      isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="invoiceDate"
                  className={`mb-2 block text-[13px] font-medium ${
                    isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                  }`}
                >
                  Invoice Date
                </label>
                <input
                  id="invoiceDate"
                  name="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={handleInputChange}
                  className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                    errors.invoiceDate
                      ? "border-[#EC5757]"
                      : isDark
                        ? "border-[#252945] bg-[#1E2139] text-white"
                        : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                  }`}
                />
                {errors.invoiceDate && (
                  <p className="mt-2 text-[13px] font-medium text-[#EC5757]">
                    {errors.invoiceDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="paymentTerms"
                  className={`mb-2 block text-[13px] font-medium ${
                    isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                  }`}
                >
                  Payment Terms
                </label>
                <select
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                    isDark
                      ? "border-[#252945] bg-[#1E2139] text-white"
                      : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                  }`}
                >
                  <option value="1">Net 1 Day</option>
                  <option value="7">Net 7 Days</option>
                  <option value="14">Net 14 Days</option>
                  <option value="30">Net 30 Days</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="projectDescription"
                className={`mb-2 block text-[13px] font-medium ${
                  isDark ? "text-[#DFE3FA]" : "text-[#7E88C3]"
                }`}
              >
                Project Description
              </label>
              <input
                id="projectDescription"
                name="projectDescription"
                type="text"
                value={formData.projectDescription}
                onChange={handleInputChange}
                className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                  errors.projectDescription
                    ? "border-[#EC5757]"
                    : isDark
                      ? "border-[#252945] bg-[#1E2139] text-white"
                      : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                }`}
              />
              {errors.projectDescription && (
                <p className="mt-2 text-[13px] font-medium text-[#EC5757]">
                  {errors.projectDescription}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#777F98]">Item List</h3>

            <div className="hidden grid-cols-[minmax(0,1fr)_64px_100px_100px_24px] items-center gap-4 md:grid">
              <p className="text-[13px] font-medium text-[#7E88C3]">
                Item Name
              </p>
              <p className="text-[13px] font-medium text-[#7E88C3]">Qty.</p>
              <p className="text-[13px] font-medium text-[#7E88C3]">Price</p>
              <p className="text-[13px] font-medium text-[#7E88C3]">Total</p>
            </div>

            <div className="space-y-4">
              {itemList.map((item) => {
                const rowTotal = item.quantity * item.price;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_64px_100px_100px_24px] md:items-center"
                  >
                    <input
                      name="name"
                      type="text"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(event) =>
                        handleItemChange(item.id, "name", event.target.value)
                      }
                      className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                        isDark
                          ? "border-[#252945] bg-[#1E2139] text-white"
                          : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                      }`}
                    />

                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          event.target.value,
                        )
                      }
                      className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                        isDark
                          ? "border-[#252945] bg-[#1E2139] text-white"
                          : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                      }`}
                    />

                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(event) =>
                        handleItemChange(item.id, "price", event.target.value)
                      }
                      className={`h-12 w-full rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                        isDark
                          ? "border-[#252945] bg-[#1E2139] text-white"
                          : "border-[#DFE3FA] bg-white text-[#0C0E16]"
                      }`}
                    />

                    <input
                      type="text"
                      value={rowTotal.toFixed(2)}
                      readOnly
                      className={`h-12 rounded-md border px-5 text-[15px] font-bold outline-none transition ${
                        isDark
                          ? "border-[#252945] bg-[#1E2139] text-[#888EB0]"
                          : "border-[#DFE3FA] bg-white text-[#888EB0]"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="flex h-12 w-full items-center justify-center text-[#888EB0] transition hover:text-[#EC5757] md:h-6 md:w-6"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}

              {errors.items && (
                <p className="text-[13px] font-medium text-[#EC5757]">
                  {errors.items}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddNewItem}
              className={`w-full rounded-full px-6 py-4 text-[15px] font-bold transition ${
                isDark
                  ? "bg-[#252945] text-[#DFE3FA] hover:bg-white hover:text-[#7E88C3]"
                  : "bg-[#F9FAFE] text-[#7E88C3] hover:bg-[#DFE3FA]"
              }`}
            >
              + Add New Item
            </button>
          </div>
        </div>

        <div
          className={`sticky bottom-0 mt-12 flex items-center justify-between border-t pt-6 ${
            isDark ? "border-[#252945]" : "border-[#DFE3FA]"
          }`}
        >
          <button
            type="button"
            onClick={handleDiscard}
            className={`rounded-full px-6 py-4 text-[15px] font-bold transition ${
              isDark
                ? "bg-[#252945] text-[#DFE3FA] hover:bg-white hover:text-[#7E88C3]"
                : "bg-[#F9FAFE] text-[#7E88C3] hover:bg-[#DFE3FA]"
            }`}
          >
            Discard
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="rounded-full bg-[#373B53] px-6 py-4 text-[15px] font-bold text-[#888EB0] transition hover:bg-[#0C0E16]"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={handleSaveAndSend}
              className="rounded-full bg-[#7C5DFA] px-6 py-4 text-[15px] font-bold text-white transition hover:bg-[#9277FF]"
            >
              {mode === "edit" ? "Save Changes" : "Save & Send"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default InvoiceFormDrawer;
