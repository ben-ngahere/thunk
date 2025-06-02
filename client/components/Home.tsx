 import { useState, useEffect } from 'react' 
// import { getGreeting } from '../apiClient.ts'
// import { useQuery } from '@tanstack/react-query' 

const Home = () => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Time delay for animation
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero is-fullheight is-warning">
      <div className="hero-body">
       <div className={`container has-text-centered ${animate ? 'animate-active' : ''}`}>
        
          {/* App Heading */}
          <h1 className="title is-1 has-text-white mb-6">thunk</h1>
            <div className="box py-5 px-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', maxWidth: '400px', margin: 'auto' }}>
              
            {/* Login/Register Buttons */}
            <div className="field">
              <button className="button is-danger is-fullwidth mb-3">Login</button>
            </div>
            <div className="field">
              <button className="button is-primary is-fullwidth">Register</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home