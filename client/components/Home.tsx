// import { useState } from 'react' 
// import { getGreeting } from '../apiClient.ts'
// import { useQuery } from '@tanstack/react-query' 

const Home = () => {

  return (
  
    <section className="hero is-fullheight is-warning">
      <div className="hero-body">
        <div className="container has-text-centered">
          
          {/* App Heading */}
          <h1 className="title is-1 has-text-white mb-6">thunk</h1>
          <div className="box has-background-white-ter py-5 px-6" style={{ opacity: 0.85, maxWidth: '400px', margin: 'auto' }}>
            <h2 className="title is-5 has-text-grey-dark">welcome</h2>

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