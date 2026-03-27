"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedCustomers, setApprovedCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
    fetchApprovedCustomers();
    fetchOrders();
  }, []);

  const fetchPendingUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('is_approved', false);
    if (data) setPendingUsers(data);
  };

  // NEW: Fetch active customers to manage their ledger
  const fetchApprovedCustomers = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('is_approved', true);
    if (data) setApprovedCustomers(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const approveUser = async (id, name) => {
    const confirmApproval = window.confirm(`Approve ${name}?`);
    if (!confirmApproval) return;

    await supabase.from('profiles').update({ is_approved: true }).eq('id', id);
    alert(`${name} has been approved!`);
    fetchPendingUsers(); 
    fetchApprovedCustomers(); // Update the ledger list too
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) alert("Error updating order: " + error.message);
    else fetchOrders(); 
  };

  // NEW: Record a payment to clear their Udhaar!
  const recordPayment = async (id, name, currentUsed) => {
    if (currentUsed <= 0) {
      return alert(`${name} has no pending dues!`);
    }

    const amountStr = window.prompt(`How much did ${name} pay?\nPending Dues: ₹${currentUsed}`);
    if (!amountStr) return; // They clicked cancel

    const paymentAmount = parseFloat(amountStr);
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return alert("Please enter a valid number.");
    }
    if (paymentAmount > currentUsed) {
      return alert(`Cannot accept ₹${paymentAmount}. They only owe ₹${currentUsed}.`);
    }

    const newUsedCredit = currentUsed - paymentAmount;

    const { error } = await supabase
      .from('profiles')
      .update({ credit_used: newUsedCredit })
      .eq('id', id);

    if (error) {
      alert("Error recording payment: " + error.message);
    } else {
      alert(`Success! ₹${paymentAmount} payment recorded for ${name}.`);
      fetchApprovedCustomers(); // Refresh the ledger
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 border-b pb-4">Admin Command Center</h1>
        
        {loading ? (
          <p className="text-xl text-gray-500">Loading your business data...</p>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* TOP ROW: Approvals and Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT: CUSTOMER APPROVALS */}
              <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Pending Partners</h2>
                {pendingUsers.length === 0 ? (
                  <p className="text-green-600 font-medium bg-green-50 p-3 rounded">No pending approvals!</p>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <div key={user.id} className="border p-4 rounded bg-gray-50 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-lg">{user.business_name}</p>
                          <p className="text-sm text-gray-500">{user.full_name}</p>
                        </div>
                        <button onClick={() => approveUser(user.id, user.full_name)} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition">
                          Approve
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: RECENT ORDERS */}
              <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-500 bg-gray-50 p-3 rounded">No orders yet.</p>
                ) : (
                  <div className="space-y-4 h-64 overflow-y-auto pr-2">
                    {orders.map((order) => (
                      <div key={order.id} className="border p-4 rounded bg-gray-50 flex flex-col gap-2">
                        <div className="flex justify-between items-center border-b pb-2">
                          <p className="font-bold text-gray-700">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xl font-bold text-green-700">₹{order.total_amount}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {order.status}
                          </span>
                          <div className="space-x-2">
                            {order.status === 'Pending' && <button onClick={() => updateOrderStatus(order.id, 'Approved')} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-bold">Approve</button>}
                            {order.status === 'Approved' && <button onClick={() => updateOrderStatus(order.id, 'Processed')} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-bold">Process</button>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM ROW: CUSTOMER LEDGER */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Credit Ledger</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700">
                      <th className="p-3 border-b">Business Name</th>
                      <th className="p-3 border-b">Tag</th>
                      <th className="p-3 border-b">Limit</th>
                      <th className="p-3 border-b text-red-600">Used (Dues)</th>
                      <th className="p-3 border-b text-green-600">Available</th>
                      <th className="p-3 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b font-bold">{customer.business_name}</td>
                        <td className="p-3 border-b">
                          <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">{customer.pricing_tier}</span>
                        </td>
                        <td className="p-3 border-b">₹{customer.credit_limit}</td>
                        <td className="p-3 border-b font-bold text-red-600">₹{customer.credit_used}</td>
                        <td className="p-3 border-b font-bold text-green-600">₹{customer.credit_limit - customer.credit_used}</td>
                        <td className="p-3 border-b">
                          <button 
                            onClick={() => recordPayment(customer.id, customer.business_name, customer.credit_used)}
                            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition text-sm font-bold"
                          >
                            Receive Payment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}