import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'
import { Link } from 'react-router-dom'

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([])
  const cardsRef = useRef()

  const setFallbackData = () => {
    let data = [...cards_data]
    if (category === 'top_rated') {
      data = [...cards_data].reverse()
    } else if (category === 'popular') {
      data = [...cards_data].slice(4).concat(cards_data.slice(0, 4))
    } else if (category === 'upcoming') {
      data = [...cards_data].slice(8).concat(cards_data.slice(0, 8))
    }
    setApiData(data)
  }

  const handleWheel = (event) => {
    event.preventDefault()
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY
    }
  }

  useEffect(() => {
    const token = import.meta.env.VITE_TMDB_TOKEN
    const apiKey = import.meta.env.VITE_TMDB_API_KEY

    if (token || apiKey) {
      const url = token
        ? `https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`
        : `https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?api_key=${apiKey}&language=en-US&page=1`

      const options = token
        ? {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        : {}

      fetch(url, options)
        .then(res => res.json())
        .then(res => {
          if (res.results && res.results.length > 0) {
            setApiData(res.results)
          } else {
            setFallbackData()
          }
        })
        .catch(err => {
          console.error("TMDB fetch error:", err)
          setFallbackData()
        })
    } else {
      setFallbackData()
    }

    const currentCardsRef = cardsRef.current
    if (currentCardsRef) {
      currentCardsRef.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (currentCardsRef) {
        currentCardsRef.removeEventListener('wheel', handleWheel)
      }
    }
  }, [category])

  return (
    <div className='titlecards'>
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          const cardId = card.id || card.videoId || card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const cardImage = card.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${card.backdrop_path}`
            : card.image
          const cardTitle = card.original_title || card.title || card.name

          return (
            <Link
              to={`/player/${cardId}`}
              state={{ movie: card }}
              className="card"
              key={index}
            >
              <img src={cardImage} alt={cardTitle} />
              <p>{cardTitle}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TitleCards
