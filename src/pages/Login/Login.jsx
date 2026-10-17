import React, { useState } from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
import netflix_spinner from '../../assets/netflix_spinner.gif'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [signState, setSignState] = useState("Sign In")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const userAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate auth action
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 1000)
  }

  return (
    loading ? (
      <div className="login-spinner">
        <img src={netflix_spinner} alt="Loading..." />
      </div>
    ) : (
      <div className='login'>
        <Link to='/'>
          <img src={logo} className='login-logo' alt="Netflix" />
        </Link>
        <div className="login-form">
          <h1>{signState}</h1>
          <form onSubmit={userAuth}>
            {signState === "Sign Up" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder='Your name'
                required
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder='Email'
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder='Password'
              required
            />
            <button type='submit'>{signState}</button>
            <div className="form-help">
              <div className="remember">
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <p>Need Help?</p>
            </div>
          </form>

          <div className="form-switch">
            {signState === "Sign In" ? (
              <p>
                New to Netflix?{' '}
                <span onClick={() => setSignState("Sign Up")}>Sign Up Now</span>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <span onClick={() => setSignState("Sign In")}>Sign In Now</span>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default Login
