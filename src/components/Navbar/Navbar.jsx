import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import cards_data from '../../assets/cards/Cards_data'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const notifications = [
  {
    id: 'squid-game',
    title: 'New Season Announcement',
    desc: 'Squid Game Season 2 is coming soon! Watch the official trailer.',
    time: '2 hours ago',
    image: cards_data[1]?.image
  },
  {
    id: 'jawan',
    title: 'Trending #1 in Movies',
    desc: 'Jawan is breaking records worldwide.',
    time: '1 day ago',
    image: cards_data[3]?.image
  },
  {
    id: 'all-of-us-are-dead',
    title: 'Top Pick for You',
    desc: 'Because you like horror & thriller series.',
    time: '3 days ago',
    image: cards_data[13]?.image
  }
]

const Navbar = () => {
  const navRef = useRef()
  const searchInputRef = useRef()
  const navigate = useNavigate()
  const location = useLocation()

  // State management
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChildrenMode, setIsChildrenMode] = useState(false)

  // Scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current?.classList.add('nav-dark')
      } else {
        navRef.current?.classList.remove('nav-dark')
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsNotificationsOpen(false)
    setIsSearchOpen(false)
    setSearchQuery('')
  }, [location.pathname])

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.trim().length > 0) {
      const results = cards_data.filter(movie =>
        movie.name.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  // Toggle Search Input
  const toggleSearch = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true)
      setTimeout(() => searchInputRef.current?.focus(), 150)
    } else if (searchQuery.trim() === '') {
      setIsSearchOpen(false)
      setSearchResults([])
    }
  }

  // Clear or close search
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearchOpen(false)
  }

  // Handle notification toggle
  const toggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev)
    if (!isNotificationsOpen) {
      setUnreadCount(0)
    }
  }

  return (
    <>
      <div ref={navRef} className='navbar'>
        {/* Navbar Left */}
        <div className="nav-left">
          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>

          <Link to='/' className="logo-link">
            <img src={logo} alt="Netflix Logo" className="logo" />
          </Link>

          <ul className="nav-links">
            <li>
              <Link to='/' className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to='/browse/tv-shows' className={`nav-link ${location.pathname === '/browse/tv-shows' ? 'active' : ''}`}>
                TV Shows
              </Link>
            </li>
            <li>
              <Link to='/browse/movies' className={`nav-link ${location.pathname === '/browse/movies' ? 'active' : ''}`}>
                Movies
              </Link>
            </li>
            <li>
              <Link to='/browse/new-popular' className={`nav-link ${location.pathname === '/browse/new-popular' ? 'active' : ''}`}>
                New & Popular
              </Link>
            </li>
            <li>
              <Link to='/browse/my-list' className={`nav-link ${location.pathname === '/browse/my-list' ? 'active' : ''}`}>
                My List
              </Link>
            </li>
          </ul>
        </div>

        {/* Navbar Right */}
        <div className="nav-right">
          {/* Interactive Search Box */}
          <div className={`search-container ${isSearchOpen ? 'active' : ''}`}>
            <img
              src={search_icon}
              alt="Search"
              className='search-icon-btn'
              onClick={toggleSearch}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Titles, people, genres..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {isSearchOpen && (
              <button className="search-close-btn" onClick={clearSearch}>✕</button>
            )}

            {/* Live Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim() !== '' && (
              <div className="search-results-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="search-result-item"
                      onClick={() => {
                        navigate(`/player/${item.id}`, { state: { movie: item } })
                        clearSearch()
                      }}
                    >
                      <img src={item.image} alt={item.name} className="search-result-thumb" />
                      <div className="search-result-info">
                        <p className="search-result-name">{item.name}</p>
                        <span className="search-result-tag">
                          {item.mediaType === 'tv' ? 'TV Show' : 'Movie'} • ★ {item.rating || '8.0'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">
                    <p>No matches found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Children Mode Pill */}
          <div
            className={`children-badge ${isChildrenMode ? 'kids-active' : ''}`}
            onClick={() => setIsChildrenMode(prev => !prev)}
            title="Click to toggle Kids mode"
          >
            {isChildrenMode ? '👶 Kids Mode' : 'Children'}
          </div>

          {/* Notification Bell with Badge & Dropdown */}
          <div className="notification-wrapper">
            <div className="bell-container" onClick={toggleNotifications}>
              <img src={bell_icon} alt="Notifications" className='icons bell-icon' />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>

            {isNotificationsOpen && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <span onClick={() => setIsNotificationsOpen(false)}>✕</span>
                </div>
                <div className="notifications-list">
                  {notifications.map((notif, index) => (
                    <div
                      key={index}
                      className="notification-item"
                      onClick={() => {
                        navigate(`/player/${notif.id}`)
                        setIsNotificationsOpen(false)
                      }}
                    >
                      <img src={notif.image} alt={notif.title} className="notif-thumb" />
                      <div className="notif-text">
                        <p className="notif-title">{notif.title}</p>
                        <p className="notif-desc">{notif.desc}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile & Dropdown */}
          <div className="navbarProfile">
            <img src={profile_img} alt="Profile" className='profileIcon' />
            <img src={caret_icon} alt="Dropdown" className="caret-icon" />

            <div className="dropdown">
              <div className="dropdown-user-header">
                <img src={profile_img} alt="" className="dropdown-user-avatar" />
                <span>Umar</span>
              </div>
              <hr className="dropdown-divider" />
              <Link to='/browse/my-list' className='dropdown-link'>Manage Profiles</Link>
              <Link to='/browse/my-list' className='dropdown-link'>Account & Settings</Link>
              <Link to='/login' className='dropdown-link signout-link'>Sign Out of Netflix</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu & Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <img src={logo} alt="Netflix Logo" className="mobile-drawer-logo" />
              <button
                className="mobile-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mobile-drawer-user">
              <img src={profile_img} alt="User" />
              <div>
                <h4>Umar</h4>
                <p>Switch Profiles</p>
              </div>
            </div>

            <ul className="mobile-drawer-links">
              <li>
                <Link to='/' onClick={() => setIsMobileMenuOpen(false)}>
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to='/browse/tv-shows' onClick={() => setIsMobileMenuOpen(false)}>
                  📺 TV Shows
                </Link>
              </li>
              <li>
                <Link to='/browse/movies' onClick={() => setIsMobileMenuOpen(false)}>
                  🎬 Movies
                </Link>
              </li>
              <li>
                <Link to='/browse/new-popular' onClick={() => setIsMobileMenuOpen(false)}>
                  🔥 New & Popular
                </Link>
              </li>
              <li>
                <Link to='/browse/my-list' onClick={() => setIsMobileMenuOpen(false)}>
                  ⭐ My List
                </Link>
              </li>
              <li>
                <div
                  className="mobile-kids-toggle"
                  onClick={() => setIsChildrenMode(prev => !prev)}
                >
                  👶 {isChildrenMode ? 'Disable Kids Mode' : 'Enable Kids Mode'}
                </div>
              </li>
            </ul>

            <div className="mobile-drawer-footer">
              <Link to='/login' className="mobile-signout" onClick={() => setIsMobileMenuOpen(false)}>
                Sign Out of Netflix
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
