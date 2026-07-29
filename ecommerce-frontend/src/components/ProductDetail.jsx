import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Loader } from './Loader';
import { StarRating } from './StarRating';

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  
  const { isCustomer, isAdmin, isLoggedIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    ApiService.product(id)
      .then(setProduct)
      .catch(() => {
        toast.error('Failed to load product details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, toast]);

  const add = () => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    if (product) {
      ApiService.addToCart(product.id, qty).then(() => {
        toast.success(`Added ${qty} item(s) to cart`);
        navigate('/cart');
      });
    }
  };

  const wish = () => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    if (product) {
      ApiService.addWishlist(product.id).then(() => {
        toast.success('Added to wishlist');
        navigate('/wishlist');
      });
    }
  };

  if (loading) {
    return <Loader message="Loading details..." fullPage />;
  }

  if (!product) {
    return (
      <section className="panel">
        <h1>Product Not Found</h1>
        <Link to="/" className="primary link-button">Back to Home</Link>
      </section>
    );
  }

  return (
    <section className="detail">
      <img src={product.imageUrl} alt={product.name} />
      <div>
        <span className="tag">{product.category.name}</span>
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <span>{product.category.name}</span> &gt; <span className="current">{product.name}</span>
        </div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({product.rating} out of 5)</span>
        </div>

        {product.deal && product.dealPrice ? (
          <div className="deal-price-block" style={{ margin: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span className="deal-percent-off" style={{ fontSize: '1.1rem', padding: '4px 12px' }}>{Math.round(((product.price - product.dealPrice) / product.price) * 100)}% off</span>
              <span className="deal-current-price" style={{ fontSize: '2rem' }}>₹{product.dealPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ marginTop: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>M.R.P.: </span>
              <span className="deal-original-price" style={{ fontSize: '0.95rem' }}>₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        ) : (
          <h2 style={{ margin: '16px 0' }}>₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
          <p style={{ margin: 0 }}>
            {product.stockQuantity > 0 ? (
              <span style={{ color: 'var(--success-color)', fontWeight: '600' }}>In Stock</span>
            ) : (
              <span style={{ color: 'var(--danger-color)', fontWeight: '600' }}>Out of stock</span>
            )}
          </p>
          {product.stockQuantity > 0 && product.stockQuantity < 5 && (
            <span className="stock-urgency">Hurry! Only {product.stockQuantity} left in stock.</span>
          )}
        </div>
        
        {isCustomer() && (
          <div className="actions detail-actions" style={{ flexWrap: 'wrap' }}>
            {product.stockQuantity > 0 && (
              <div className="quantity-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Qty:</label>
                <select 
                  value={qty} 
                  onChange={e => setQty(Number(e.target.value))}
                  style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                >
                  {[...Array(Math.min(10, product.stockQuantity)).keys()].map(n => (
                    <option key={n+1} value={n+1}>{n+1}</option>
                  ))}
                </select>
              </div>
            )}
            <button className="primary" onClick={add} disabled={product.stockQuantity === 0}>
              <i className="bi bi-cart-plus" style={{ marginRight: '8px' }}></i>
              Add to cart
            </button>
            <button className="ghost" onClick={wish}>
              <i className="bi bi-heart" style={{ marginRight: '8px' }}></i>
              Wishlist
            </button>
          </div>
        )}
        {isAdmin() && (
          <Link className="primary link-button" to={`/admin?editId=${product.id}`}>Manage in admin</Link>
        )}
      </div>
    </section>
  );
}
