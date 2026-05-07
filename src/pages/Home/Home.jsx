import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import heroBanner from '../../assets/hero_banner.jpg'
import heroTitle from '../../assets/hero_title.png'

const Home = () => {
  return (
    <div className='home'>
      <Navbar/>
      <div className="hero">
        <img src={heroBanner} alt=""  className='bannerImg'/>
        <div className="heroCaption">
          <img src={heroTitle} alt="" className='heroTitle'/>
          <p>Discovering his ties to secreat ancient order, a young man living in the modren Istanbul emarks on a quest to save the city from an Immortal enemy.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
