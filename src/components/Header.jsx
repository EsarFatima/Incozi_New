import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser, faBriefcase, faCartShopping, faArrowRightFromBracket, faChevronDown, faCommentDots, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth.js';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! How can we help you today?", isBot: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  useEffect(() => {
    // Simulate initial messages if authenticated
    if (isAuthenticated && messages.length === 1) {
      setMessages(prev => [...prev, {
        id: 2,
        text: `Welcome back${user?.full_name ? ', ' + user.full_name : ''}! Feel free to ask about your active services or any new formations!`,
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);

    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(updatedCart.length);
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isAuthenticated, user, messages.length]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Add user message
    const newUserMsg = {
      id: Date.now(),
      text: chatMessage,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);
    setChatMessage('');

    // Simulate bot reply
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        text: "Thanks for your message! One of our experts will get back to you shortly.",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
    }, 1000);
  };

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    handleSidebarClose();
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            incozi.
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <div className="nav-item dropdown">
              <Link to="/services" className="nav-link">
                Services & Pricing <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.7rem', marginLeft: '0.3rem' }} />
              </Link>
              <div className="dropdown-menu">
                <Link to="/incorporation" className="dropdown-item">Incorporation</Link>
                <Link to="/services#tax" className="dropdown-item">Tax & Compliance</Link>
                <Link to="/services#bookkeeping" className="dropdown-item">Bookkeeping</Link>
                <Link to="/consultation" className="dropdown-item">Consultation</Link>
              </div>
            </div>
            <Link to="/blog" className="nav-link">Blog</Link>
            <Link to="/dashboard" className="nav-link">My Services</Link>
          </nav>

          {/* Right Section - Login, Cart, then Hamburger at far right */}
          <div className="header-right">
            {!isAuthenticated ? (
              <Link to="/auth" className="header-icon" title="Sign In">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            ) : (
              <Link 
                to={user?.role === 'admin' ? "/admin" : "/dashboard"} 
                className="header-icon" 
                title={user?.role === 'admin' ? "Admin Panel" : "Dashboard"}
              >
                <FontAwesomeIcon icon={faUser} style={{ color: 'var(--accent-200)' }} />
              </Link>
            )}
            <Link to="/checkout" className="header-icon cart-link" title="Cart">
              <FontAwesomeIcon icon={faCartShopping} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>

          {/* Hamburger Menu - Absolute Right */}
          <button className="menu-toggle" onClick={handleSidebarToggle} aria-label="Toggle Menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {/* Chat Toggle Bubble */}
        <button 
          className="chat-bubble"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <FontAwesomeIcon icon={faCommentDots} />
        </button>

        {/* Chat Modal */}
        {chatOpen && (
          <div className="chat-modal">
            <div className="chat-modal-header">
              <div className="chat-header-info">
                <div className="chat-status-dot"></div>
                <h3>Incozi Support</h3>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="chat-close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <div className="chat-modal-body">
              {isAuthenticated ? (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.isBot ? 'bot' : 'user'}`}>
                      <div className="message-bubble">
                        {msg.text}
                      </div>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="chat-empty-state">
                   <div className="empty-icon">
                     <FontAwesomeIcon icon={faBriefcase} />
                   </div>
                  <p>Please log in to chat with our business experts.</p>
                  <Link to="/auth" onClick={() => setChatOpen(false)} className="login-link-chat">Log In Now</Link>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="chat-modal-footer">
              <input 
                type="text" 
                placeholder={isAuthenticated ? "Type your message..." : "Login to chat"} 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                disabled={!isAuthenticated} 
              />
              <button 
                type="submit" 
                className="chat-send" 
                disabled={!isAuthenticated || !chatMessage.trim()}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={handleSidebarClose}
      />

      {/* Sidebar Menu */}
      <aside className={`sidebar-menu ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header-row">
          <span className="sidebar-title">Menu</span>
          <button 
            className="sidebar-close" 
            onClick={handleSidebarClose}
            aria-label="Close Menu"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="sidebar-content">
          <ul className="sidebar-nav-list">
            {/* Services Section */}
            <li className="sidebar-group">
              <span className="sidebar-group-title">Services & Pricing</span>
              <ul className="sidebar-sub-list">
                <li><Link to="/consultation" onClick={handleSidebarClose}>Consultation</Link></li>
                <li><Link to="/incorporation" onClick={handleSidebarClose}>Incorporation</Link></li>
                <li><Link to="/services?type=tax" onClick={handleSidebarClose}>Tax & Compliance</Link></li>
                <li><Link to="/services?type=bookkeeping" onClick={handleSidebarClose}>Bookkeeping</Link></li>
              </ul>
            </li>

            {/* About Section */}
            <li className="sidebar-group">
              <span className="sidebar-group-title">About Us</span>
              <ul className="sidebar-sub-list">
                <li><Link to="/" onClick={handleSidebarClose}>Who We Are</Link></li>
                <li><a href="#faq" onClick={handleSidebarClose}>FAQs</a></li>
                <li><a href="#contact" onClick={handleSidebarClose}>Contact Us</a></li>
              </ul>
            </li>

            {/* Blog Section */}
            <li className="sidebar-group">
              <Link to="/blog" className="sidebar-group-title" style={{ display: 'block', cursor: 'pointer' }} onClick={handleSidebarClose}>
                Blog
              </Link>
            </li>

            <li className="sidebar-divider"></li>

            {/* User Actions */}
            {!isAuthenticated ? (
              <li>
                <Link to="/auth" className="sidebar-link-item" onClick={handleSidebarClose}>
                  <FontAwesomeIcon icon={faUser} /> Sign In / Register
                </Link>
              </li>
            ) : (
              <>
                <li className="sidebar-user-info" style={{ padding: '0.85rem 1.5rem', marginBottom: '0.5rem' }}>
                   <div style={{ fontWeight: '700', color: 'var(--text-100)' }}>{user?.full_name || 'User'}</div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-200)' }}>{user?.email} ({user?.role})</div>
                </li>
                <li>
                  <Link 
                    to={user?.role === 'admin' ? "/admin" : "/dashboard"} 
                    className="sidebar-link-item" 
                    onClick={handleSidebarClose}
                  >
                    <FontAwesomeIcon icon={user?.role === 'admin' ? faUser : faBriefcase} /> {user?.role === 'admin' ? 'Admin Panel' : 'My Services'}
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/checkout" className="sidebar-link-item" onClick={handleSidebarClose}>
                <FontAwesomeIcon icon={faCartShopping} /> Cart
                {cartCount > 0 && <span className="cart-badge-sidebar">{cartCount}</span>}
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <button 
                  className="sidebar-link-item sign-out-btn" 
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
}

