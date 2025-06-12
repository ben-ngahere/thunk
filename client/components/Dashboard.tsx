import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import gsap from 'gsap';

import NewThunkCard from './NewThunkCard';
import ThunkLogCard from './ThunkLogCard';
import { useAuth0 } from '@auth0/auth0-react';

gsap.registerPlugin(ScrambleTextPlugin);

const Dashboard = () => {
  // Animation Control
  const [animationPhase, setAnimationPhase] = useState('initial');
  const [showCards, setShowCards] = useState(false);
  const [gsapScrambleComplete, setGsapScrambleComplete] = useState(false);
  const [subtitleTypedComplete, setSubtitleTypedComplete] = useState(false);

  // Auth0 User Info
  const { user } = useAuth0();

  // Subtitle Typing Animation
  const userSubGreeting = user?.name || user?.nickname || user?.email
  const fullSubtitle = `${userSubGreeting}`
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);

  const mainTitleRef = useRef(null);

  // Trigger 'scrambleAndType'
  useEffect(() => {
    setAnimationPhase('scrambleAndType');
  }, []);

  // Initial "Welcome" ScrambleIn (GSAP)
  useEffect(() => {
    if (animationPhase === 'scrambleAndType' && mainTitleRef.current) {
      gsap.set(mainTitleRef.current, { opacity: 0, visibility: 'hidden' });
      const scrambleTimeline = gsap.timeline({
        delay: 0,
        onComplete: () => {
          setGsapScrambleComplete(true);
        }
      });

      // Welcome appears at 0vh and then scrambles
      scrambleTimeline.to(mainTitleRef.current, {
        opacity: 1, // Make it visible
        visibility: 'visible', // Make it visible for scrambling
        scrambleText: {
          text: "Welcome",
          chars: "lowerCase",
          speed: 0.5,
          newClass: "scramble-active"
        },
        duration: 3
      });

      return () => {
        scrambleTimeline.kill();
        gsap.killTweensOf(mainTitleRef.current);
      };
    }
  }, [animationPhase]);

  // "Subtitle" Typing Animation
  useEffect(() => {
    if (animationPhase === 'scrambleAndType') {
      setShowSubtitle(true);

      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < fullSubtitle.length) {
          setTypedSubtitle(fullSubtitle.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setSubtitleTypedComplete(true);
          }, 500);
        }
      }, 100);
      return () => clearInterval(typingInterval);
    }
    if (animationPhase !== 'scrambleAndType') {
      setTypedSubtitle('');
    }
  }, [animationPhase, fullSubtitle]);

  // Synchronize GSAP scramble
  useEffect(() => {
    if (gsapScrambleComplete && subtitleTypedComplete) {
      gsap.to(mainTitleRef.current, {
        scrambleText: {
          text: "thunk.board",
          chars: "lowercase",
          speed: 0.3,
          revealDelay: 0
        },
        duration: 1,
        ease: "power1",
        onComplete: () => {
          setTimeout(() => {
            setShowSubtitle(false); // Hide subtitle
            setAnimationPhase('fadeOutTitle');
          }, 0);
        }
      });
    }
  }, [gsapScrambleComplete, subtitleTypedComplete]);

  // Framer Motion Variants for title animation phases
  // const titleMoveScrambleVariants = {
  //   initial: {
  //     scale: 0.9,
  //     opacity: 0,
  //     visibility: 'hidden',
  //   },
  //   scrambleAndType: {
  //     scale: 0.9,
  //     opacity: 1,
  //     visibility: 'visible',
  //     transition: {
  //       opacity: { duration: 0.5 },
  //     },
  //   },
  //   fadeOutTitle: {
  //     scale: 1.0,
  //     opacity: 0,
  //     visibility: 'visible',
  //     transition: {
  //       opacity: { duration: 0.5, ease: "easeOut" },
  //       scale: { duration: 0.5, ease: "easeOut" },
  //     },
  //   },
  //   hideAndRepositionTitle: {
  //     scale: 0,
  //     opacity: 0,
  //     visibility: 'hidden',
  //     transition: {
  //       visibility: { delay: 0, duration: 0 },
  //     },
  //   },
  //   fadeInTitle: {
  //     scale: 1.0,
  //     opacity: 1,
  //     visibility: 'visible',
  //     transition: {
  //       opacity: { duration: 0.5, ease: "easeOut" },
  //     },
  //   },
  // };

  // Framer Motion Variants for subtitle fade
  const subtitleFadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="hero is-fullheight is-info">
      <div className="hero-body">
        <div
          className="container has-text-centered"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        >
          {/* New Thunk Card - Top */}
          <AnimatePresence>
            {showCards && <NewThunkCard isVisible={showCards} />}
          </AnimatePresence>

          {/* Title: Uses ref for GSAP, and motion.h1 for Framer Motion */}
          <motion.h1
            ref={mainTitleRef}
            className="title is-1 has-text-white"
            style={{ fontSize: '4rem', margin: '0.5rem 0' }} //vertical margin for spacing
            //variants={titleMoveScrambleVariants}
            //initial="initial"
            animate={animationPhase}
            onAnimationComplete={(definition) => {
              if (definition === 'fadeOutTitle') {
                setAnimationPhase('hideAndRepositionTitle');
              } else if (definition === 'hideAndRepositionTitle') {
                setAnimationPhase('fadeInTitle');
              } else if (definition === 'fadeInTitle') {
                setTimeout(() => {
                  setShowCards(true);
                }, 1000); // Small delay before cards appear
              }
            }}
          >
            Welcome
          </motion.h1>

          {/* Subtitle: Uses AnimatePresence */}
          <AnimatePresence>
            {showSubtitle && (animationPhase === 'scrambleAndType') && (
              <motion.p
                key="subtitle"
                className="subtitle has-text-white-ter"
                variants={subtitleFadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {typedSubtitle}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Thunk Log Card - Bottom */}
          <AnimatePresence>
            {showCards && <ThunkLogCard isVisible={showCards} />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;