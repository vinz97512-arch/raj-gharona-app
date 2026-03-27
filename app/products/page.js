"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);

  // ⚠️ CHANGE THIS TO YOUR RAJ GHARONA WHATSAPP NUMBER (Start with 91)
  const ADMIN_WHATSAPP_NUMBER = "917683975998"; 

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setUserProfile(profile);
    }
    const { data: productsData } = await supabase.from('products').select('*');
    setProducts(productsData);
    setLoading(false);
  };

  const getCustomerPrice = (product) => {
    if (!userProfile || !userProfile.is_approved) return product.base_price;
    if (userProfile.pricing_tier === 'L1') return product.l1_price;
    if (userProfile.pricing_tier === 'L2') return product.l2_price;
    if (userProfile.pricing_tier === 'L3') return product.l3_price;
    return product.base_price;
  };

  const addToCart = (product) => {
    const price = getCustomerPrice(product);
    setCart([...cart, { product_id: product.id, name: product.name, price: price, quantity: 1 }]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const availableCredit = userProfile ? (userProfile.credit_limit - userProfile.credit_used) : 0;

  const placeOrder = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (cartTotal > availableCredit) return alert("Order blocked! Exceeds credit limit.");

    setIsOrdering(true);
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Save to Database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: user.id, total_amount: cartTotal, status: 'Pending' }])
      .select().single();

    if (orderError) {
      alert("Order failed.");
      setIsOrdering(false);
      return;
    }

    const orderItems = cart.map((item) => ({
      order_id: orderData.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
    await supabase.from('order_items').insert(orderItems);
    await supabase.from('profiles').update({ credit_used: userProfile.credit_used + cartTotal }).eq('id', userProfile.id);

    // 2. THE WHATSAPP MAGIC
    // We format a nice message for the customer to send you
    let message = `*New Order Alert!* 🚀\n\n`;
    message += `*Business:* ${userProfile.business_name}\n`;
    message += `*Order ID:* #${orderData.id.slice(0, 8)}\n\n`;
    message += `*Items:*\n`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (₹${item.price})\n`;
    });
    
    message += `\n*Total Bill:* ₹${cartTotal}\n`;
    message += `Please process this order ASAP!`;

    // Encode the text so the internet browser can read it
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    alert(`Success! Order placed safely. Opening WhatsApp...`);
    
    // Open WhatsApp in a new tab!
    window.open(whatsappUrl, '_blank');

    setCart([]); 
    checkUserAndFetchData();
    setIsOrdering(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDE: PRODUCTS */}
        <div className="md:w-3/4">
          <div className="flex justify-between items-end mb-8 border-b pb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Product Catalog</h1>
            </div>
            {userProfile && (
              <div className="text-right flex flex-col items-end gap-2">
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold border border-green-300">
                  {userProfile.pricing_tier} Partner
                </span>
                <div className="bg-white px-3 py-2 rounded shadow-sm border text-sm">
                  <p className="text-gray-500 mb-1">Available Credit</p>
                  <p className={`text-xl font-bold ${availableCredit < 5000 ? 'text-red-600' : 'text-blue-700'}`}>
                    ₹{availableCredit}
                  </p>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
                  <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                  <p className="text-gray-500 mb-4">{product.unit}</p>
                  
                  <div className="bg-blue-50 p-4 rounded-md flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Your Price</p>
                      <p className="text-2xl font-bold text-blue-700">₹{getCustomerPrice(product)}</p>
                    </div>
                    <button onClick={() => addToCart(product)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: CART */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-gray-800">Your Cart</h2>
            
            {cart.length === 0 ? (
              <p className="text-gray-500">Cart is empty.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm border-b pb-2">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-blue-700 font-bold">₹{item.price}</span>
                  </div>
                ))}
                
                <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t-2 text-gray-800">
                  <span>Total:</span>
                  <span className={cartTotal > availableCredit ? 'text-red-600' : 'text-blue-700'}>₹{cartTotal}</span>
                </div>

                {cartTotal > availableCredit && (
                  <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded text-center mt-2">
                    Cart exceeds available credit!
                  </p>
                )}

                <button 
                  onClick={placeOrder}
                  disabled={isOrdering || cartTotal > availableCredit}
                  className={`w-full mt-4 font-bold py-3 rounded transition ${cartTotal > availableCredit ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {isOrdering ? "Placing Order..." : "Place Order & Send WhatsApp"}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* FLOATING WHATSAPP CHAT BUTTON */}
      <a 
        href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=Hi%20Raj%20Gharona%20Support,%20I%20have%20a%20question.`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg font-bold hover:bg-green-600 transition flex items-center gap-2 z-50"
      >
        <span className="text-2xl">💬</span> Chat with Support
      </a>

    </div>
  );
}