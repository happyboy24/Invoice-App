import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/constants';

const InvoiceContext = createContext();

const invoiceReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload };
    case 'ADD_INVOICE':
      return { ...state, invoices: [action.payload, ...state.invoices] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === action.payload.id ? action.payload : invoice
        ),
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter((invoice) => invoice.id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useLocalStorage('invoices', []);
  const [filters, setFilters] = useLocalStorage('invoiceFilters', { status: 'all' });
  const [searchTerm, setSearchTerm] = useLocalStorage('invoiceSearchTerm', '');

  const [state, dispatch] = useReducer(invoiceReducer, {
    invoices,
    filters,
    searchTerm,
  });

  useEffect(() => {
    setInvoices(state.invoices);
  }, [state.invoices, setInvoices]);

  useEffect(() => {
    setFilters(state.filters);
  }, [state.filters, setFilters]);

  useEffect(() => {
    setSearchTerm(state.searchTerm);
  }, [state.searchTerm, setSearchTerm]);

  const addInvoice = (invoiceData) => {
    dispatch({
      type: 'ADD_INVOICE',
      payload: { ...invoiceData, id: generateId(), createdAt: new Date().toISOString() },
    });
  };

  const updateInvoice = (invoiceData) => {
    dispatch({ type: 'UPDATE_INVOICE', payload: invoiceData });
  };

  const deleteInvoice = (id) => {
    dispatch({ type: 'DELETE_INVOICE', payload: id });
  };

  const setFiltersValue = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSearchTermValue = (term) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  const filteredInvoices = React.useMemo(() => {
    let filtered = state.invoices;

    if (state.filters.status !== 'all') {
      filtered = filtered.filter((invoice) => invoice.status === state.filters.status);
    }

    if (state.searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.clientName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          invoice.invoiceNumber.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [state.invoices, state.filters, state.searchTerm]);

  return (
    <InvoiceContext.Provider
      value={{
        invoices: filteredInvoices,
        allInvoices: state.invoices,
        filters: state.filters,
        searchTerm: state.searchTerm,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        setFilters: setFiltersValue,
        setSearchTerm: setSearchTermValue,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};
