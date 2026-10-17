import React, { useState } from 'react'
import './Browse.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import cards_data from '../../assets/cards/Cards_data'
import { Link, useParams } from 'react-router-dom'
import play_icon from '../../assets/play_icon.png'

const Browse = () => {
  const { category } = useParams()
  const [filter, setFilter] = useState('all')

  // Filter cards based on URL category
  let pageTitle = "Browse Titles"
  let pageDescription = "Explore the full collection of movies, series, and exclusives."
  let filteredList = [...cards_data]

  if (category === 'tv-shows' || category === 'tv') {
    pageTitle = "TV Shows & Series"
    pageDescription = "Binge-worthy drama, suspense, comedy, and thrilling web series."
    filteredList = cards_data.filter(c => c.mediaType === 'tv')
  } else if (category === 'movies') {
    pageTitle = "Blockbuster Movies"
    pageDescription = "Cinematic stories, thrilling adventures, and award-winning motion pictures."
    filteredList = cards_data.filter(c => c.mediaType === 'movie')
  } else if (category === 'popular' || category === 'new-popular') {
    pageTitle = "New & Popular"
    pageDescription = "Trending content that viewers across the world are watching right now."
    filteredList = cards_data.filter(c => c.isPopular)
  } else if (category === 'my-list') {
    pageTitle = "My List"
    pageDescription = "Your personal watchlist saved for later viewing."
    filteredList = [cards_data[0], cards_data[1], cards_data[3], cards_data[5], cards_data[8]]
  }

  // Secondary tab filter
  if (filter === 'top') {
    filteredList = [...filteredList].sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
  } else if (filter === 'newest') {
    filteredList = [...filteredList].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return (
    <div className='browse-page'>
      <Navbar />

      <div className="browse-header">
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>

        <div className="browse-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Titles ({filteredList.length})
          </button>
          <button
            className={`filter-btn ${filter === 'top' ? 'active' : ''}`}
            onClick={() => setFilter('top')}
          >
            ⭐ Top Rated
          </button>
          <button
            className={`filter-btn ${filter === 'newest' ? 'active' : ''}`}
            onClick={() => setFilter('newest')}
          >
            🔥 Latest Releases
          </button>
        </div>
      </div>

      <div className="browse-grid-container">
        <div className="browse-grid">
          {filteredList.map((movie, idx) => (
            <Link
              to={`/player/${movie.id}`}
              state={{ movie }}
              className="browse-card"
              key={movie.id || idx}
            >
              <div className="card-thumb-wrapper">
                <img src={movie.image} alt={movie.name} className='browse-card-img' />
                <div className="card-overlay">
                  <div className="play-circle">
                    <img src={play_icon} alt="Play" />
                  </div>
                  <span className="play-label">Play Trailer</span>
                </div>
              </div>

              <div className="browse-card-details">
                <span className="card-badge">{movie.mediaType === 'tv' ? 'TV SHOW' : 'MOVIE'}</span>
                <span className="card-rating">★ {movie.rating || '8.0'}</span>
              </div>
              <h3 className="browse-card-title">{movie.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Browse

