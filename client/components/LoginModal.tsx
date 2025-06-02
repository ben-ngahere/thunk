/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoginModalProps {
  isOpen: boolean; 
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const modalCardRef = useRef(null);
  const modalBackgroundRef = useRef(null);

  // State to track if an exit animation is currently playing
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Ref to store the GSAP timeline
  const animationTimeline = useRef<gsap.core.Timeline | null>(null);

  // This useEffect focuses on initializing the timeline and reacting to 'isOpen' prop for playing forward
  useEffect(() => {
    if (!modalCardRef.current || !modalBackgroundRef.current) {
      return;
    }

    // Initialize timeline only once when the component first mounts
    if (!animationTimeline.current) {
      animationTimeline.current = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" }
      });

      // Add entrance animation
      animationTimeline.current
        .fromTo(
          modalCardRef.current,
          { scale: 0.9, opacity: 0, y: -20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
        )
        .fromTo(
          modalBackgroundRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          "<"
        );

      animationTimeline.current.eventCallback('onReverseComplete', () => {
        setIsAnimatingOut(false); // Reset internal animation state
        onClose(); // Notify parent to set its isOpen state to false, triggering unmount
      });
    }

    // Control timeline play/reverse based on `isOpen` prop
    if (isOpen) {
      animationTimeline.current.seek(0); // Timeline is at the beginning before playing forward
      animationTimeline.current.play(); // Play the entrance animation
      setIsAnimatingOut(false);
    } else {
      if (animationTimeline.current.progress() > 0) { // If the timeline is not at its beginning
        setIsAnimatingOut(true); // Indicate that we are animating out
        animationTimeline.current.reverse(); // Play the exit animation
      }
    }

    // Cleanup function
    return () => {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
        animationTimeline.current = null;
      }
    };
  }, [isOpen, onClose]);

  // handleCloseAnimation: Triggered by user interaction (clicks on close or cancel button and background)
  const handleCloseAnimation = () => {
    if (animationTimeline.current && animationTimeline.current.progress() > 0 && !isAnimatingOut) {
      setIsAnimatingOut(true); // Set state to indicate exit animation is playing
      animationTimeline.current.reverse(); // Play the exit animation
    }
  };

  if (!isOpen && !isAnimatingOut) {
    return null;
  }

  // Determine CSS class for the modal container (Bulma's `is-active` for display:flex)
  const modalClass = `modal ${isOpen || isAnimatingOut ? 'is-active' : ''}`;

  return (
    <div className={modalClass}>
      <div className="modal-background" onClick={handleCloseAnimation} ref={modalBackgroundRef}></div>
      <div className="modal-card" ref={modalCardRef}>
        <header className="modal-card-head">
          <p className="modal-card-title">Login</p>
          <button className="delete" aria-label="close" onClick={handleCloseAnimation}></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Username</label>
            <div className="control has-icons-left">
              <input className="input" type="text" placeholder="" />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className="control has-icons-left">
              <input className="input" type="password" placeholder="" />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>

        </section>
        <footer className="modal-card-foot">
          <button className="button is-danger">Login</button>
          <button className="button" onClick={handleCloseAnimation}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export default LoginModal;