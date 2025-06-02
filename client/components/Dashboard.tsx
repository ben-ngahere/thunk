import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

const Dashboard = () => {
  // Animation Phase Control: Updated states for concurrent animation
  const [animationPhase, setAnimationPhase] = useState('initial');

  // Subtitle Typing Animation
  const fullSubtitle = "I thunk, I thunk, I thunk";
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);

  // Title Text: Starts as 'Welcome' changes to 'Dashboard'
  const [titleText, setTitleText] = useState('Welcome');

  const mainTitleRef = useRef(null);

  // Combined animation start
  useEffect(() => {
    // This effect runs once after the initial render to start the main animation sequence
    setAnimationPhase('scrambleAndType'); // NEW PHASE: Both scramble and typing begin
  }, []); // Empty dependency array means it runs only once on mount

  // Animation Start
  // "Welcome" ScrambleIn (GSAP)
  // MODIFIED: Now triggers on 'scrambleAndType' phase
  useEffect(() => {
    if (animationPhase === 'scrambleAndType' && mainTitleRef.current) { // MODIFIED: Condition
      // Starts invisible before scrambling
      gsap.set(mainTitleRef.current, { opacity: 0 });

      // Timeline for the "Welcome" scramble
      const scrambleTimeline = gsap.timeline({
        delay: 0.3,
        // REMOVED: onComplete no longer sets animationPhase, subtitle useEffect will handle it
      });

      // "Welcome" ScrambleText (GSAP)
      scrambleTimeline.to(mainTitleRef.current, {
        opacity: 1, // Fade in during the scramble
        scrambleText: {
          text: "Welcome", // The target text for the scramble
          chars: "lowerCase",
          speed: 0.5, // Speed of the scramble effect
          newClass: "scramble-active"
        },
        duration: 3
      });

      // Clean up function for GSAP
      return () => {
        scrambleTimeline.kill();
      };
    }
  }, [animationPhase]);

  // "Subtitle" Animation (Framer Motion)
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
          // Animation delay after complete
          setTimeout(() => {
            setAnimationPhase('transitioning');
            setShowSubtitle(false);
            
            const changeTextTimeout = setTimeout(() => {
                // Only change if it's still 'Welcome'
                if (titleText === 'Welcome') {
                    setTitleText('Dashboard');
                }
            }, 320);

            return () => clearTimeout(changeTextTimeout);
          }, 500);
        }
      }, 100); // Typing speed

      // Clean up function for the typing interval
      return () => clearInterval(typingInterval);
    }
    if (animationPhase !== 'scrambleAndType') {
      setTypedSubtitle('');
    }
  }, [animationPhase, fullSubtitle, titleText]);

  // Framer Motion Variants for "Welcome" to "Dashboard" animation
  const titleMoveScrambleVariants = {
    initial: {
      y: '0vh', // Starting position (centered vertically)
      opacity: 1,
      scale: 1,
    },
    animate: {
      y: '-40vh',
      scale: 0.9,
      opacity: [1, 0, 0, 1],
      transition: {
        y: { duration: 1.2, ease: "easeOut" },
        scale: { duration: 1.2, ease: "easeOut" },
        opacity: {
          times: [0, 0.4, 0.6, 1],
          duration: 0.8,
          ease: "linear"
        }
      }
    },
    final: {
      y: '-40vh', // Final position of title 'Dashboard'
      opacity: 1,
      scale: 0.9
    }
  };

  // Framer Motion Variants for subtitle fade animation
  const subtitleFadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="hero is-fullheight is-info">
      <div className="hero-body">
        <div className="container has-text-centered">

          {/* Title: Uses ref for GSAP, and motion.h1 for Framer Motion */}
          <motion.h1
            ref={mainTitleRef}
            key={titleText === 'Welcome' ? 'welcome-h1' : 'dashboard-h1'}
            className="title is-1 has-text-white"
            style={{ fontSize: '6rem' }}
            variants={titleMoveScrambleVariants}
            // Control Framer Motion animations based on the current phase
            initial={animationPhase === 'initial' ? 'initial' : (animationPhase === 'final' ? "animate" : false)}
            animate={animationPhase === 'transitioning' ? "animate" : (animationPhase === 'final' ? "animate" : false)}
           
            // End of Animations
            onAnimationComplete={() => {
              if (animationPhase === 'transitioning') {
                setAnimationPhase('final');
              }
            }}
          >
            {titleText}
          </motion.h1>

          {/* Subtitle: Uses AnimatePresence for mounting/unmounting */}
          <AnimatePresence>
            {/* Show subtitle during typing and transition animations */}
            {showSubtitle && (animationPhase === 'scrambleAndType' || animationPhase === 'transitioning') && (
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
        </div>
      </div>
    </section>
  );
};

export default Dashboard;