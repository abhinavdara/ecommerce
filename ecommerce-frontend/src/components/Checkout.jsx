import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Loader } from './Loader';

export function Checkout() {
  const [form, setForm] = useState({
    paymentMethod: 'COD',
    shippingAddress: '',
    phoneNumber: '',
    cardNumber: '',
    cvv: '',
    expiry: '',
    upiId: ''
  });
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingCart(true);
    ApiService.cart()
      .then(setCartItems)
      .catch(() => {
        toast.error('Failed to load cart items');
      })
      .finally(() => {
        setLoadingCart(false);
      });
  }, [toast]);

  const validate = () => {
    const tempErrors = {};
    if (form.shippingAddress.trim().length < 10) {
      tempErrors.shippingAddress = 'Address must be at least 10 characters long';
    }
    if (!/^\d{10}$/.test(form.phoneNumber)) {
      tempErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }
    if (form.paymentMethod === 'CARD') {
      if (!/^\d{16}$/.test(form.cardNumber)) {
        tempErrors.cardNumber = 'Card number must be exactly 16 digits';
      }
      if (!/^\d{3}$/.test(form.cvv)) {
        tempErrors.cvv = 'CVV must be exactly 3 digits';
      }
      
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(form.expiry)) {
        tempErrors.expiry = 'Expiry date must be in MM/YY format';
      } else {
        const [, expMonth, expYear] = form.expiry.match(expiryRegex);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        const year = parseInt(expYear, 10);
        const month = parseInt(expMonth, 10);
        
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          tempErrors.expiry = 'Expiry date must be in the future';
        }
      }
    }
    if (form.paymentMethod === 'UPI' && !/^[\w.-]+@[\w.-]+$/.test(form.upiId)) {
      tempErrors.upiId = 'UPI ID format is invalid (e.g. user@bank)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const placeOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // map simulated CARD / UPI values into request
    const payload = {
      paymentMethod: form.paymentMethod,
      shippingAddress: form.shippingAddress,
      phoneNumber: form.phoneNumber,
      cardNumber: form.paymentMethod === 'CARD' ? form.cardNumber : (form.paymentMethod === 'UPI' ? form.upiId : '')
    };

    ApiService.checkout(payload)
      .then(() => {
        toast.success('Order placed successfully');
        navigate('/orders');
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Checkout failed');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const getActivePrice = (product) => (product.deal && product.dealPrice) ? product.dealPrice : product.price;

  const subtotal = cartItems.reduce((sum, item) => sum + getActivePrice(item.product) * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST simulation
  const shipping = subtotal > 999 ? 0 : (cartItems.length > 0 ? 49 : 0);
  const grandTotal = subtotal + tax + shipping;

  if (loadingCart) {
    return <Loader message="Loading checkout details..." />;
  }

  return (
    <div className="form-card" style={{ maxWidth: '640px' }}>
      <form onSubmit={placeOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <h1>Checkout</h1>

        {cartItems.length > 0 && (
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            {cartItems.map(item => {
              const activePrice = getActivePrice(item.product);
              return (
                <div key={item.id} className="order-summary-row" style={{ fontSize: '0.85rem' }}>
                  <span>{item.product.name} (x{item.quantity})</span>
                  <strong>₹{(activePrice * item.quantity).toLocaleString('en-IN')}</strong>
                </div>
              );
            })}
            <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />
            <div className="order-summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="order-summary-row">
              <span>GST (18%):</span>
              <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="order-summary-row">
              <span>Shipping Charges:</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="order-summary-row" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              <span>Grand Total:</span>
              <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}

        <div className="field-group">
          <label htmlFor="shippingAddress">Delivery Address</label>
          <textarea 
            id="shippingAddress"
            name="shippingAddress" 
            placeholder="Enter your complete delivery address" 
            required 
            value={form.shippingAddress}
            className={errors.shippingAddress ? 'input-invalid' : form.shippingAddress.length >= 10 ? 'input-valid' : ''}
            onChange={handleChange}
          />
          {errors.shippingAddress && <span className="field-error">{errors.shippingAddress}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="phoneNumber">Contact Phone Number</label>
          <input 
            id="phoneNumber"
            name="phoneNumber" 
            placeholder="10-digit mobile number" 
            required 
            value={form.phoneNumber}
            className={errors.phoneNumber ? 'input-invalid' : /^\d{10}$/.test(form.phoneNumber) ? 'input-valid' : ''}
            onChange={handleChange}
          />
          {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select 
            id="paymentMethod"
            name="paymentMethod" 
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="COD">Cash on delivery (COD)</option>
            <option value="CARD">Credit/Debit Card Simulation</option>
            <option value="UPI">UPI Simulation</option>
          </select>
        </div>
        
        {form.paymentMethod === 'CARD' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="field-group">
              <label htmlFor="cardNumber">16-Digit Card Number</label>
              <input 
                id="cardNumber"
                name="cardNumber" 
                placeholder="1234567812345678" 
                required
                value={form.cardNumber}
                className={errors.cardNumber ? 'input-invalid' : /^\d{16}$/.test(form.cardNumber) ? 'input-valid' : ''}
                onChange={handleChange}
              />
              {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="field-group" style={{ flex: 1 }}>
                <label htmlFor="expiry">Expiry Date (MM/YY)</label>
                <input 
                  id="expiry"
                  name="expiry" 
                  placeholder="12/26" 
                  required
                  value={form.expiry}
                  className={errors.expiry ? 'input-invalid' : form.expiry ? 'input-valid' : ''}
                  onChange={handleChange}
                />
                {errors.expiry && <span className="field-error">{errors.expiry}</span>}
              </div>
              
              <div className="field-group" style={{ flex: 1 }}>
                <label htmlFor="cvv">CVV</label>
                <input 
                  id="cvv"
                  name="cvv" 
                  type="password"
                  placeholder="123" 
                  maxLength={3}
                  required
                  value={form.cvv}
                  className={errors.cvv ? 'input-invalid' : /^\d{3}$/.test(form.cvv) ? 'input-valid' : ''}
                  onChange={handleChange}
                />
                {errors.cvv && <span className="field-error">{errors.cvv}</span>}
              </div>
            </div>
          </div>
        )}

        {form.paymentMethod === 'UPI' && (
          <div className="field-group">
            <label htmlFor="upiId">Virtual Payment Address (UPI ID)</label>
            <input 
              id="upiId"
              name="upiId" 
              placeholder="username@bank" 
              required
              value={form.upiId}
              className={errors.upiId ? 'input-invalid' : /^[\w.-]+@[\w.-]+$/.test(form.upiId) ? 'input-valid' : ''}
              onChange={handleChange}
            />
            {errors.upiId && <span className="field-error">{errors.upiId}</span>}
          </div>
        )}
        
        <button type="submit" className="primary" disabled={isSubmitting || cartItems.length === 0}>
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
