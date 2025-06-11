import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { useNavigate } from 'react-router-dom'

// import LoginModal from './LoginModal'
// import RegisterModal from './RegisterModal'
// import LoginTransition from './LoginTransition'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react'

gsap.registerPlugin(ScrambleTextPlugin)

const Home = () => {
  const titleRef = useRef(null)
  const boxRef = useRef(null)
  // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  // const [isLoginTransitioning, setIsLoginTransitioning] = useState(false)
  const { loginWithRedirect, isAuthenticated, isLoading} = useAuth0()

  const navigate = useNavigate()

  // Redirect to /dashboard if user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, isLoading, navigate])

  // TextScramble + Movement
  useEffect(() => {
    let masterTimeline: gsap.core.Timeline | undefined; 

    if (titleRef.current && boxRef.current) {
      masterTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Animate the Title: Scramble and initial move
      masterTimeline
        .fromTo(
          titleRef.current,
          {
            opacity: 0,
            yPercent: -50,
            xPercent: -50,
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 10
          },

          // Animation to reveal and scramble
          {
            opacity: 1,
            scrambleText: {
              text: "thunk.", // text to scramble to
              chars: "lowerCase",
              speed: 0.5,
              newClass: "scramble-active"
            },
            duration: 5
          }
        )

        // Animate Title: Move to its final position (after scramble)
        .to(titleRef.current, {
          top: '50%',
          yPercent: -200,
          xPercent: -50,
          duration: 1,
          ease: "back.out(1.7)",
          delay: 0.5
        }, "-=0.5")

        // Animate Login Box: Fade in and slide up
        .fromTo(
          boxRef.current,
          {
            opacity: 0,
            y: 100
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          },
          "-=0.3"
        )
    }

    // Clean up function for GSAP
    return () => {
      if (masterTimeline) masterTimeline.kill();
    }
  }, [])

  // NEW: Handle Login Click - initiates Auth0 redirect
  const handleLoginClick = async () => {
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: 'login', // Suggests login screen
        audience: 'https://thunk/api', // Crucial for getting the API token
        scope: 'openid profile email offline_access', // Crucial for refresh tokens
      },
    });
  };

  // NEW: Handle Register Click - initiates Auth0 redirect
  const handleRegisterClick = async () => {
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup', // Suggests signup screen
        audience: 'https://thunk/api', // Crucial for getting the API token
        scope: 'openid profile email offline_access', // Crucial for refresh tokens
      },
    });
  };

  // Login Handler
  //const openLoginModal = () => setIsLoginModalOpen(true)
  //const closeLoginModal = () => setIsLoginModalOpen(false)

  // Register Handler
  //const openRegisterModal = () => setIsRegisterModalOpen(true)
  //const closeRegisterModal = () => setIsRegisterModalOpen(false)

  // const handleLoginSuccessAndTransition = () => {
  //   setIsLoginModalOpen(false); // Close the login modal
  //   setIsLoginTransitioning(true); // Start the transition animation
  // };

  // const onLoginTransitionComplete = () => {
  //   setIsLoginTransitioning(false); // Hide the transition component
  //   navigate('/dashboard'); // Navigate to the dashboard page
  // };


  return (
    <section className="hero is-fullheight is-warning">
      <div className="hero-body">
        <div className="container has-text-centered">

          {/* App Heading */}
          <h1 className="title is-1 has-text-white mb-6" ref={titleRef} style={{ fontSize: '6rem' }}>thunk</h1>

          {/* Login/Register Box */}
          <div className="box py-5 px-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: '8px', boxShadow: '0, 8px, 16px rgba(0, 0, 0, 0.2)', maxWidth: '400px', margin: 'auto' }} ref={boxRef}>
            <div className="field">
              <button className="button is-danger is-fullwidth mb-3" onClick={()=>handleLoginClick()} disabled={isLoading}>
                {/* Lucide LogIn Icon */}
                <span className="icon is-small">
                  <LogIn size={16} />
                </span>
                <span>Login</span>
              </button>
            </div>
            <div className="field">
              <button className="button is-primary is-fullwidth" onClick={()=>handleRegisterClick()} disabled={isLoading}>
                {/* Lucide UserPlus Icon */}
                <span className="icon is-small">
                  <UserPlus size={16} />
                </span>
                <span>Register</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      {isLoginTransitioning && <LoginTransition onComplete={onLoginTransitionComplete} />} */}
    </section>
  )
}

export default Home