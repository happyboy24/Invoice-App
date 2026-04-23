import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import InvoiceFormPage from './pages/InvoiceFormPage';

function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="/invoices/new" element={<InvoiceFormPage />} />
              <Route path="/invoices/:id/edit" element={<InvoiceFormPage />} />
            </Routes>
          </Layout>
        </Router>
      </InvoiceProvider>
    </ThemeProvider>
  );
}

export default App;
