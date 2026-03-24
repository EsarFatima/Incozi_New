import React from 'react';
import { Link } from 'react-router-dom';

function Checkout() {
  const [cartItems, setCartItems] = React.useState([]);

  React.useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <section className="bg-dark-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              {cartItems.length === 0 ? (
                <div className="card text-center">
                  <p className="text-dark-600 mb-4">Your cart is empty</p>
                  <Link to="/services" className="btn-primary">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="card">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-dark-600 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="card h-fit sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-dark-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total</span>
                <span>${(total * 1.1).toFixed(2)}</span>
              </div>
              <button
                disabled={cartItems.length === 0}
                className="btn-primary w-full disabled:opacity-50"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;
