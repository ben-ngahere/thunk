/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const modalCardRef = useRef(null);
  const modalBackgroundRef = useRef(null);

  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const animationTimeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!modalCardRef.current || !modalBackgroundRef.current) {
      return;
    }

    if (!animationTimeline.current) {
      animationTimeline.current = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" }
      });

      animationTimeline.current
        .fromTo(
          modalCardRef.current,
          { scale: 0.8, opacity: 0, y: -20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
        )
        .fromTo(
          modalBackgroundRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          "<"
        );

      animationTimeline.current.eventCallback('onReverseComplete', () => {
        setIsAnimatingOut(false);
        onClose();
        animationTimeline.current?.eventCallback('onReverseComplete', null);
      });
    }

    if (isOpen) {
      animationTimeline.current.seek(0);
      animationTimeline.current.play();
      setIsAnimatingOut(false);
    } else {
      if (animationTimeline.current.progress() > 0) {
        setIsAnimatingOut(true);
        animationTimeline.current.reverse();
      }
    }

    return () => {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
        animationTimeline.current = null;
      }
    };
  }, [isOpen, onClose]);

  const handleCloseAnimation = () => {
    if (animationTimeline.current && animationTimeline.current.progress() > 0 && !isAnimatingOut) {
      setIsAnimatingOut(true);
      animationTimeline.current.reverse();
    }
  };

  if (!isOpen && !isAnimatingOut) {
    return null;
  }

  const modalClass = `modal ${isOpen || isAnimatingOut ? 'is-active' : ''}`;

  return (
    <div className={modalClass}>
      <div className="modal-background" onClick={handleCloseAnimation} ref={modalBackgroundRef}></div>
      <div className="modal-card" ref={modalCardRef}>
        <header className="modal-card-head">
          <p className="modal-card-title">Register</p>
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

          <div className="field">
            <label className="label">Confirm Password</label>
            <div className="control has-icons-left">
              <input className="input" type="password" placeholder="" />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>

        </section>
        <footer className="modal-card-foot">
          <button className="button is-primary">Register</button>
          <button className="button" onClick={handleCloseAnimation}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export default RegisterModal;
