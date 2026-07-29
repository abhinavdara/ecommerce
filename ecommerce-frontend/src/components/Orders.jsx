import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Loader } from './Loader';
import { EmptyState } from './EmptyState';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ApiService.orders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader message="Loading your orders..." />;
  }

  return (
    <section className="panel">
      <h1>Order history</h1>
      {!orders.length ? (
        <EmptyState 
          icon="bi-receipt" 
          title="No orders yet" 
          message="You haven't placed any orders yet. Discover our premium catalog and order today." 
          actionText="Browse Catalog" 
          actionLink="/" 
        />
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map(order => (
            <article className="order-card" key={order.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
              <div className="row-line" style={{ width: '100%', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div>
                  <strong style={{ fontSize: '1.15rem' }}>Order ID: {order.trackingNumber}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`tag ${order.status === 'DELIVERED' ? 'success' : ''}`}>{order.status}</span>
                  <span className={`tag ${order.paymentStatus === 'PAID' ? 'success' : ''}`} style={{ marginLeft: '8px' }}>{order.paymentStatus}</span>
                </div>
              </div>
              
              <div style={{ width: '100%', fontSize: '0.95rem' }}>
                <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--primary-color)' }}>Items Purchased:</strong>
                {order.orderItems && order.orderItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #e2e8f0' }}>
                    <span>{item.product?.name} <span style={{color: 'var(--text-muted)'}}>x{item.quantity}</span></span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '60%' }}>
                  <strong>Shipping to:</strong><br/>
                  {order.shippingAddress}
                </div>
                <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                  Total: ₹{order.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
