/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // If the modal is not open, no render
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal is-active"> {/* 'is-active' makes the modal visible */}
      <div className="modal-background" onClick={onClose}></div> {/* click outside to close */}
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Login</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Email or Username</label>
            <div className="control has-icons-left">
              <input className="input" type="text" placeholder="e.g. alex@example.com" />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className="control has-icons-left">
              <input className="input" type="password" placeholder="********" />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>

        </section>
        <footer className="modal-card-foot">
          <button className="button is-primary">Login</button>
          <button className="button" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export default LoginModal;