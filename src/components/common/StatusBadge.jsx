import React from 'react';
import './StatusBadge.module.css';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    paid: {
      label: 'Paid',
      className: 'status-badge paid'
    },
    pending: {
      label: 'Pending',
      className: 'status-badge pending'
    },
    draft: {
      label: 'Draft',
      className: 'status-badge draft'
    },
    overdue: {
      label: 'Overdue',
      className: 'status-badge overdue'
    }
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;

  return (
    <div className={config.className}>
      <span className="status-dot"></span>
      {config.label}
    </div>
  );
};

export default StatusBadge;