import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import cards_data from '../../assets/cards/Cards_data'

const trailerMap = {
  'kung-fu-panda': { key: '_InqQJRqGW4', name: 'Kung Fu Panda', type: 'Official Trailer', date: '2008-06-06' },
  'squid-game': { key: 'oqxAJKy0ii4', name: 'Squid Game', type: 'Official Trailer', date: '2021-09-17' },
  'squid-challenge': { key: 'p5gX7P4ZzC0', name: 'Squid Game: The Challenge', type: 'Official Teaser', date: '2023-11-22' },
  'squid-challange': { key: 'p5gX7P4ZzC0', name: 'Squid Game: The Challenge', type: 'Official Teaser', date: '2023-11-22' },
  'jawan': { key: 'COv52Qyctws', name: 'Jawan', type: 'Official Trailer', date: '2023-08-31' },
  'the-ghost': { key: 'Vf8C3r0a0a8', name: 'The Ghost', type: 'Official Trailer', date: '2022-10-05' },
  'lucifer': { key: 'ueMwVGBwqRo', name: 'Lucifer', type: 'Official Trailer', date: '2016-01-25' },
  'the-railway-men': { key: 'd9N2j6fIflI', name: 'The Railway MEN', type: 'Official Trailer', date: '2023-11-18' },
  'young-sheldon': { key: 'f2kS8tQx_rU', name: 'Young Sheldon', type: 'Official Trailer', date: '2017-09-25' },
  'sacred-games': { key: '28j8h0RRnq4', name: 'Sacred Games', type: 'Official Trailer', date: '2018-07-06' },
  'adipurush': { key: 'e2Y_cQ3b7yA', name: 'Adipurush', type: 'Official Trailer', date: '2023-06-16' },
  'sukhee': { key: 'z7Q9V4v1z-4', name: 'Sukhee', type: 'Official Trailer', date: '2023-09-22' },
  'mission-ganj': { key: 'sZ_8b3hN2z8', name: 'Mission Ganj', type: 'Official Trailer', date: '2023-10-06' },
  'leo': { key: 'Po3jStA673E', name: 'Leo', type: 'Official Trailer', date: '2023-10-19' },
  'all-of-us-are-dead': { key: 'IN5TD4VRcIU', name: 'All of Us Are Dead', type: 'Official Trailer', date: '2022-01-28' },
  'the-protector': { key: '6X-ZYZz5o_M', name: 'The Protector', type: 'Official Trailer', date: '2018-12-14' },
}

const Player = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  })

  useEffect(() => {
    // 1. Check if passed in router state
    const passedMovie = location.state?.movie
    if (passedMovie && passedMovie.videoId) {
      setApiData({
        name: passedMovie.name || passedMovie.title,
        key: passedMovie.videoId,
        published_at: passedMovie.date || "2023-01-01",
        type: passedMovie.type || "Trailer"
      })
      return
    }

    // 2. Check in local trailerMap
    const cleanId = String(id).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    if (trailerMap[cleanId]) {
      const info = trailerMap[cleanId]
      setApiData({
        name: info.name,
        key: info.key,
        published_at: info.date,
        type: info.type
      })
      return
    }

    // Check by index in cards_data if id is a small number
    const numId = parseInt(id, 10)
    if (!isNaN(numId) && numId < cards_data.length && cards_data[numId]) {
      const c = cards_data[numId]
      setApiData({
        name: c.name,
        key: c.videoId,
        published_at: c.date,
        type: c.type
      })
      return
    }

    // 3. If TMDB API token/key is available, try fetching TMDB movie video
    const token = import.meta.env.VITE_TMDB_TOKEN
    const apiKey = import.meta.env.VITE_TMDB_API_KEY

    if (token || apiKey) {
      const url = token
        ? `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
        : `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`

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
            const trailer = res.results.find(v => v.type === "Trailer") || res.results[0]
            setApiData(trailer)
          } else {
            fallbackDefault()
          }
        })
        .catch(() => {
          fallbackDefault()
        })
    } else {
      fallbackDefault()
    }

    function fallbackDefault() {
      // Default to Kung Fu Panda or Squid Game trailer
      const fallback = trailerMap['kung-fu-panda']
      setApiData({
        name: fallback.name,
        key: fallback.key,
        published_at: fallback.date,
        type: fallback.type
      })
    }
  }, [id, location.state])

  return (
    <div className='player'>
      <img
        src={back_arrow_icon}
        alt="Back"
        onClick={() => navigate(-1)}
        className='back-arrow'
      />
      {apiData.key ? (
        <iframe
          width='90%'
          height='80%'
          src={`https://www.youtube.com/embed/${apiData.key}?autoplay=1`}
          title='trailer'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        ></iframe>
      ) : (
        <p className="loading-text">Loading Video Player...</p>
      )}

      <div className="player-info">
        <p>{apiData.published_at ? apiData.published_at.slice(0, 10) : ''}</p>
        <p className='movie-title'>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  )
}

export default Player
