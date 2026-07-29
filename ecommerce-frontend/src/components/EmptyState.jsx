import React from 'react';
import { Link } from 'react-router-dom';

export function EmptyState({ 
  icon = "bi-inbox", 
  title = "No Data Found", 
  message = "There is nothing to show here right now.",
  actionText = null,
  actionLink = "/",
  onAction = null
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      
      {actionText && (
        onAction ? (
          <button className="primary" onClick={onAction}>{actionText}</button>
        ) : (
          <Link to={actionLink} className="primary link-button">{actionText}</Link>
        )
      )}
    </div>
  );
}
