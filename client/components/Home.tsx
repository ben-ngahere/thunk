import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import LoginModal from './LoginModal'

gsap.registerPlugin(ScrambleTextPlugin)

const Home = () => {
  const titleRef = useRef(null)
  const boxRef = useRef(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

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
          yPercent: -350,
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

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  return (
    <section className="hero is-fullheight is-warning">
      <div className="hero-body">
        <div className="container has-text-centered">

          {/* App Heading */}
          <h1 className="title is-1 has-text-white mb-6" ref={titleRef}>thunk</h1>

          {/* Login/Register Box */}
          <div className="box py-5 px-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', maxWidth: '400px', margin: 'auto' }} ref={boxRef}>
            <div className="field">
              <button className="button is-danger is-fullwidth mb-3" onClick={openLoginModal}>Login</button>
            </div>
            <div className="field">
              <button className="button is-primary is-fullwidth">Register</button>
            </div>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </section>
  )
}

export default Home