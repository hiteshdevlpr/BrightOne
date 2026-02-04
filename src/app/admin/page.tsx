'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface Booking {
  id: string;
  name: string;
  email: string;
  service_type: string;
  status: string;
  created_at: string;
  property_address: string;
  service_tier: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  created_at: string;
  message: string;
}

interface DashboardData {
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    recent: number;
  };
  messages: {
    total: number;
    unread: number;
    read: number;
    recent: number;
  };
  recentBookings: Booking[];
  recentMessages: ContactMessage[];
  serviceBreakdown: Array<{ service_type: string; count: string }>;
}

const ADMIN_KEY_STORAGE = 'brightone_admin_key';

function getAdminHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const key = sessionStorage.getItem(ADMIN_KEY_STORAGE);
  if (!key) return {};
  return { Authorization: `Bearer ${key}` };
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'messages'>('dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAdminKey(sessionStorage.getItem(ADMIN_KEY_STORAGE));
    }
  }, []);

  useEffect(() => {
    if (adminKey !== null) {
      fetchDashboardData();
      fetchBookings();
      fetchMessages();
    } else {
      setLoading(false);
    }
  }, [adminKey]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', { headers: getAdminHeaders() });
      if (response.status === 401 || response.status === 503) {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        setAdminKey(null);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.dashboard);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings', { headers: getAdminHeaders() });
      if (response.status === 401 || response.status === 503) {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        setAdminKey(null);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact', { headers: getAdminHeaders() });
      if (response.status === 401 || response.status === 503) {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        setAdminKey(null);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        fetchBookings();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        fetchMessages();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'unread':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (adminKey === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-2 font-heading">Admin access</h2>
          <p className="text-white/80 text-sm mb-4 font-montserrat">Enter the admin API key to continue.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const key = keyInput.trim();
              if (!key) {
                setKeyError('Please enter the key');
                return;
              }
              setKeyError('');
              sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
              setAdminKey(key);
              setKeyInput('');
              setLoading(true);
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Admin API key"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-white focus:outline-none"
              autoComplete="off"
            />
            {keyError && <p className="text-red-400 text-sm">{keyError}</p>}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 font-heading">Admin Dashboard</h1>
            <p className="text-white/80 font-montserrat">Manage bookings and contact messages</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              Messages ({messages.length})
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && dashboardData && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-white/60 text-sm font-medium mb-2">Total Bookings</h3>
                  <p className="text-3xl font-bold text-white">{dashboardData.bookings.total}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-white/60 text-sm font-medium mb-2">Pending Bookings</h3>
                  <p className="text-3xl font-bold text-yellow-400">{dashboardData.bookings.pending}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-white/60 text-sm font-medium mb-2">Total Messages</h3>
                  <p className="text-3xl font-bold text-white">{dashboardData.messages.total}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-white/60 text-sm font-medium mb-2">Unread Messages</h3>
                  <p className="text-3xl font-bold text-yellow-400">{dashboardData.messages.unread}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Bookings</h3>
                  <div className="space-y-4">
                    {dashboardData.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{booking.name}</p>
                          <p className="text-white/60 text-sm">{booking.service_type}</p>
                          <p className="text-white/40 text-xs">{formatDate(booking.created_at)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Messages</h3>
                  <div className="space-y-4">
                    {dashboardData.recentMessages.map((message) => (
                      <div key={message.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{message.name}</p>
                          <p className="text-white/60 text-sm">{message.subject}</p>
                          <p className="text-white/40 text-xs">{formatDate(message.created_at)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">All Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Tier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-white">{booking.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/80">{booking.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/80">{booking.service_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/80">{booking.service_tier}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/60 text-sm">{formatDate(booking.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">All Messages</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {messages.map((message) => (
                      <tr key={message.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-white">{message.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/80">{message.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/80">{message.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/60 text-sm">{formatDate(message.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={message.status}
                            onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
