'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Wrapper from '@/layouts/wrapper';
import FooterFour from '@/layouts/footers/footer-four';

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

export default function AdminPageClient() {
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
        setBookings(data.bookings || []);
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
        setMessages(data.messages || []);
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
        return 'admin-badge admin-badge-warning';
      case 'confirmed':
      case 'read':
        return 'admin-badge admin-badge-info';
      case 'completed':
      case 'replied':
        return 'admin-badge admin-badge-success';
      case 'cancelled':
      case 'archived':
        return 'admin-badge admin-badge-muted';
      default:
        return 'admin-badge admin-badge-muted';
    }
  };

  if (adminKey === null) {
    return (
      <Wrapper>
        <div className="admin-login-wrap">
          <div className="admin-login-box">
            <h2 className="admin-login-title">Admin access</h2>
            <p className="admin-login-desc">Enter the admin API key to continue.</p>
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
              className="admin-login-form"
            >
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Admin API key"
                className="admin-login-input"
                autoComplete="off"
              />
              {keyError && <p className="admin-login-error">{keyError}</p>}
              <button type="submit" className="admin-login-btn">
                Continue
              </button>
            </form>
          </div>
        </div>
        <style jsx>{`
          .admin-login-wrap {
            min-height: 100vh;
            background: #111;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }
          .admin-login-box {
            background: #1a1a1a;
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .admin-login-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 0.5rem;
          }
          .admin-login-desc {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
          }
          .admin-login-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .admin-login-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            background: #252525;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
            font-size: 1rem;
          }
          .admin-login-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }
          .admin-login-error {
            color: #f87171;
            font-size: 0.875rem;
          }
          .admin-login-btn {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            background: #fff;
            color: #111;
            font-weight: 600;
            border: none;
            cursor: pointer;
          }
          .admin-login-btn:hover {
            background: rgba(255, 255, 255, 0.9);
          }
        `}</style>
      </Wrapper>
    );
  }

  if (loading) {
    return (
      <Wrapper>
        <div className="admin-loading">
          <span className="text-white">Loading...</span>
        </div>
        <style jsx>{`
          .admin-loading {
            min-height: 100vh;
            background: #111;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="inner-bg admin-dashboard-bg">
            <main>
              <div className="tp-hero-3-area tp-hero-3-ptb border-bottom">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="tp-hero-3-content-box text-center p-relative">
                        <h4 className="tp-hero-3-title text-white">Admin Dashboard</h4>
                        <span className="tp-hero-3-category text-white-50">Manage bookings and contact messages</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container py-5 pb-80">
                <div className="admin-tabs mb-5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className={activeTab === 'dashboard' ? 'admin-tab active' : 'admin-tab'}
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className={activeTab === 'bookings' ? 'admin-tab active' : 'admin-tab'}
                  >
                    Bookings ({bookings.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('messages')}
                    className={activeTab === 'messages' ? 'admin-tab active' : 'admin-tab'}
                  >
                    Messages ({messages.length})
                  </button>
                </div>

                {activeTab === 'dashboard' && dashboardData && (
                  <div className="admin-dashboard-grid">
                    <div className="admin-stat-cards">
                      <div className="admin-stat-card">
                        <h3 className="admin-stat-label">Total Bookings</h3>
                        <p className="admin-stat-value">{dashboardData.bookings.total}</p>
                      </div>
                      <div className="admin-stat-card">
                        <h3 className="admin-stat-label">Pending Bookings</h3>
                        <p className="admin-stat-value admin-stat-warning">{dashboardData.bookings.pending}</p>
                      </div>
                      <div className="admin-stat-card">
                        <h3 className="admin-stat-label">Total Messages</h3>
                        <p className="admin-stat-value">{dashboardData.messages.total}</p>
                      </div>
                      <div className="admin-stat-card">
                        <h3 className="admin-stat-label">Unread Messages</h3>
                        <p className="admin-stat-value admin-stat-warning">{dashboardData.messages.unread}</p>
                      </div>
                    </div>
                    <div className="admin-recent-grid">
                      <div className="admin-panel">
                        <h3 className="admin-panel-title">Recent Bookings</h3>
                        <div className="admin-list">
                          {(dashboardData.recentBookings || []).map((booking: Booking) => (
                            <div key={booking.id} className="admin-list-item">
                              <div>
                                <p className="admin-list-name">{booking.name}</p>
                                <p className="admin-list-meta">{booking.service_type}</p>
                                <p className="admin-list-date">{formatDate(booking.created_at)}</p>
                              </div>
                              <span className={getStatusColor(booking.status)}>{booking.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="admin-panel">
                        <h3 className="admin-panel-title">Recent Messages</h3>
                        <div className="admin-list">
                          {(dashboardData.recentMessages || []).map((msg: ContactMessage) => (
                            <div key={msg.id} className="admin-list-item">
                              <div>
                                <p className="admin-list-name">{msg.name}</p>
                                <p className="admin-list-meta">{msg.subject}</p>
                                <p className="admin-list-date">{formatDate(msg.created_at)}</p>
                              </div>
                              <span className={getStatusColor(msg.status)}>{msg.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div className="admin-table-wrap">
                    <div className="admin-panel">
                      <div className="admin-panel-header">
                        <h3 className="admin-panel-title mb-0">All Bookings</h3>
                      </div>
                      <div className="admin-table-scroll">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Service</th>
                              <th>Tier</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((booking) => (
                              <tr key={booking.id}>
                                <td className="text-white">{booking.name}</td>
                                <td className="text-white-50">{booking.email}</td>
                                <td className="text-white-50">{booking.service_type}</td>
                                <td className="text-white-50">{booking.service_tier || '—'}</td>
                                <td>
                                  <span className={getStatusColor(booking.status)}>{booking.status}</span>
                                </td>
                                <td className="text-white-50 admin-date-cell">{formatDate(booking.created_at)}</td>
                                <td>
                                  <select
                                    value={booking.status}
                                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                    className="admin-select"
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
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="admin-table-wrap">
                    <div className="admin-panel">
                      <div className="admin-panel-header">
                        <h3 className="admin-panel-title mb-0">All Messages</h3>
                      </div>
                      <div className="admin-table-scroll">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Subject</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {messages.map((message) => (
                              <tr key={message.id}>
                                <td className="text-white">{message.name}</td>
                                <td className="text-white-50">{message.email}</td>
                                <td className="text-white-50">{message.subject}</td>
                                <td>
                                  <span className={getStatusColor(message.status)}>{message.status}</span>
                                </td>
                                <td className="text-white-50 admin-date-cell">{formatDate(message.created_at)}</td>
                                <td>
                                  <select
                                    value={message.status}
                                    onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                                    className="admin-select"
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
                  </div>
                )}

                <div className="mt-5">
                  <Link href="/" className="tp-btn-black-2">
                    Back to Home
                  </Link>
                </div>
              </div>
            </main>
            <FooterFour />
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard-bg {
          background: #111;
        }
        .admin-tabs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          background: #1a1a1a;
          padding: 4px;
          border-radius: 8px;
          width: fit-content;
        }
        .admin-tab {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          border: none;
          background: transparent;
          color: #fff;
          cursor: pointer;
        }
        .admin-tab:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .admin-tab.active {
          background: #fff;
          color: #111;
        }
        .admin-dashboard-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .admin-stat-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .admin-stat-card {
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 8px;
        }
        .admin-stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .admin-stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: #fff;
        }
        .admin-stat-warning {
          color: #facc15;
        }
        .admin-recent-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 991px) {
          .admin-recent-grid {
            grid-template-columns: 1fr;
          }
        }
        .admin-panel {
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .admin-panel-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .admin-panel-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
        }
        .admin-list {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .admin-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #252525;
          border-radius: 8px;
        }
        .admin-list-name {
          color: #fff;
          font-weight: 500;
          margin: 0 0 4px 0;
        }
        .admin-list-meta {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin: 0 0 2px 0;
        }
        .admin-list-date {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
          margin: 0;
        }
        .admin-badge {
          padding: 4px 8px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .admin-badge-warning {
          background: rgba(250, 204, 21, 0.2);
          color: #facc15;
        }
        .admin-badge-info {
          background: rgba(96, 165, 250, 0.2);
          color: #60a5fa;
        }
        .admin-badge-success {
          background: rgba(74, 222, 128, 0.2);
          color: #4ade80;
        }
        .admin-badge-muted {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
        }
        .admin-table-wrap {
          margin-bottom: 2rem;
        }
        .admin-table-scroll {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table thead {
          background: #252525;
        }
        .admin-table th {
          padding: 0.75rem 1.5rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .admin-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .admin-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        .admin-date-cell {
          white-space: nowrap;
          font-size: 0.875rem;
        }
        .admin-select {
          background: #252525;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 0.875rem;
          cursor: pointer;
        }
      `}</style>
    </Wrapper>
  );
}
