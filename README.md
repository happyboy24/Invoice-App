# HNG Stage2 Invoice Management App

A responsive Invoice Management Application built with React, TypeScript, Tailwind CSS and Vite.

The application allows users to create, view, edit and delete invoices while supporting invoice statuses, filtering, dark mode and responsive layouts.



## Features

This application allows users to:

- Create invoices
- Read and view invoice details
- Edit existing invoices
- Delete invoices with confirmation modal
- Save invoices as draft
- Mark pending invoices as paid
- Filter invoices by status
- Toggle between light and dark mode
- Persist invoice and theme data using LocalStorage
- Experience a responsive layout across mobile, tablet and desktop
- See hover states on buttons, filters, invoice cards and form inputs

---

## Invoice Status Flow

Invoices can have one of the following statuses:

- Draft
- Pending
- Paid

Behavior:

- Draft invoices can be edited later
- Pending invoices can be marked as paid
- Paid invoices remain paid and cannot return to draft
- Status updates are reflected in both the invoice list and detail pages

---

## Form Validation

Form validation was included to make invalid fields show visual feedback and prevent submission until corrected. The invoice form includes validation for:

- Required fields
- Valid client email format
- At least one invoice item
- Quantity greater than 0
- Price greater than 0

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React Icons
- LocalStorage

---

## Project Structure

```txt
hng-stage-2-invoice-app
├── src/
│   ├── assets/
│   │   └── illustration-empty.png
│   ├── components/
│   │   ├── InvoiceCard.tsx
│   │   ├── InvoiceFormDrawer.tsx
│   │   ├── MobileNavbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── StatusBadge.tsx
│   ├── context/
│   │   ├── InvoiceContext.tsx
│   │   ├── theme-context.ts
│   │   └── ThemeContext.tsx
│   ├── data/
│   │   └── data.json
│   ├── hooks/
│   │   ├── useFocusTrap.ts
│   │   ├── useInvoices.ts
│   │   └── useTheme.ts
│   ├── layout/
│   │   └── AppLayout.tsx
│   ├── pages/
│   │   ├── InvoiceDetailPage.tsx
│   │   └── InvoiceListPage.tsx
│   ├── routes/
│   │   └── router.tsx
│   ├── types/
│   │   └── invoice.ts
│   └── utils/
│       └── formatCurrency.ts
├── App.css
├── App.tsx
├── index.css
├── main.tsx
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Main Components

- Invoice List Page
- Invoice Detail Page
- Invoice Form Drawer
- Status Badge Component
- Filter Dropdown
- Theme Context Provider
- Reusable Modal Components

---

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/iibrahimx/hng-stage-2-invoice-app.git
```

2. Navigate into the project folder:

```bash
cd hng-stage-2-invoice-app
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

---

## Accessibility Notes

The application includes several accessibility improvements:

- Semantic HTML elements
- Proper form labels
- Keyboard accessible buttons
- ESC key support for closing modals
- Focus trapping inside modals
- Click outside modal support
- Good contrast for both light and dark themes

---

## Responsive Design

The application is responsive across:

- Mobile devices (320px+)
- Tablet devices (768px+)
- Desktop screens (1024px+)

Layouts, forms, filters and invoice cards adapt based on screen size.

---

## Trade-Offs

- LocalStorage was used instead of a backend for simplicity and faster development
- Some mobile and desktop layouts required conditional rendering for better visual alignment
- IDs are generated locally rather than from a backend database

---

## Improvements Beyond Requirements

- Seed invoice data was added so the application feels populated immediately on first load
- Reusable hooks and utility functions were extracted to keep components cleaner and easier to maintain
- Reusable modal logic was implemented for delete confirmation and form drawers
- Filter dropdown closes automatically when clicking outside or pressing ESC
- Local invoice IDs are generated automatically for newly created invoices

---

## Deployment

The project is deployed on Vercel.

Any future push to the main branch will automatically trigger a new deployment on Vercel, so you do not need to manually redeploy each time.

---

## Author

Ibrahim Ibrahim.
# Invoice-App
