import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Power3 } from 'gsap';

interface LoginTransitionProps {
  onComplete: () => void;
}

const LoginTransition: React.FC<LoginTransitionProps> = ({ onComplete }) => {
  const overlayRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current || !textRef.current) return;

    const tl = gsap.timeline({
      onComplete: onComplete,
      defaults: { ease: Power3.easeOut }
    });

    // Fade in the overlay
    tl.fromTo(overlayRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8 }
    )
    // Animate the text
    .fromTo(textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }, "<"
    )
    
    .to(textRef.current,
      { scale: 1.05, repeat: 1, yoyo: true, duration: 0.4 }, "+=0.5"
    )
    // Fade out the overlay and text
    .to(overlayRef.current,
      { opacity: 0, scale: 1.2, duration: 0.8, ease: Power3.easeIn }, "+=0.5"
    )
    .to(textRef.current,
      { opacity: 0, y: -20, duration: 0.6, ease: Power3.easeIn }, "<"
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, 
        opacity: 0,
        transform: 'scale(0.8)'
      }}
    >
      <h2
        ref={textRef}
        className="title is-1 has-text-white"
        style={{ opacity: 0 }}
      >
        Loading Thunk...
      </h2>
    </div>
  );
};

export default LoginTransition;