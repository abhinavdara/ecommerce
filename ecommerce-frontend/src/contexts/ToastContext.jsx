import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const remove = useCallback((id) => {
    // First set leaving to true
    setMessages((prev) => 
      prev.map(m => m.id === id ? { ...m, leaving: true } : m)
    );
    // Then remove after animation completes (200ms)
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 200);
  }, []);

  const add = useCallback((text, type = 'success') => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text, type, leaving: false }]);
    setTimeout(() => {
      remove(id);
    }, 5000);
  }, [remove]);

  const success = useCallback((text) => add(text, 'success'), [add]);
  const error = useCallback((text) => add(text, 'error'), [add]);
  const info = useCallback((text) => add(text, 'info'), [add]);

  return (
    <ToastContext.Provider value={{ messages, success, error, info, remove }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {messages.map((msg) => (
          <button
            key={msg.id}
            className={`toast-message ${msg.type === 'error' ? 'error' : ''} ${msg.type === 'info' ? 'info' : ''} ${msg.leaving ? 'leaving' : ''}`}
            type="button"
            onClick={() => remove(msg.id)}
          >
            {msg.text}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
