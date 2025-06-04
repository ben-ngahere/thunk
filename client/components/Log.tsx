//import React from 'react';
import { useNavigate } from 'react-router-dom';

const Log = () => {
  const navigate = useNavigate();

  // New Entry Button
  const handleNewEntryClick = () => {
    navigate('/newentry');
  };

  // Sign Out Button
  const handleSignOutClick = () => {
    console.log('Sign Out button clicked from Log Page!');
    navigate('/');
  };

  return (
    <div className="log-page-wrapper">
      {/* Nav Bar */}
      <nav className="navbar is-info is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="navbar-item is-size-3 has-text-white has-text-weight-bold">
            thunk.
          </div>
        </div>
        <div id="navbarBasicExample" className="navbar-menu is-active">
          <div className="navbar-end">

            {/* New Entry Button */}
            <div className="navbar-item">
              <div className="buttons">
                <button className="button is-small is-link" onClick={handleNewEntryClick}>
                  New Entry
                </button>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="navbar-item">
              <div className="buttons">
                <button className="button is-small is-danger" onClick={handleSignOutClick}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Entries Area */}
      <section className="hero is-fullheight">
        <div
          className="hero-body"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '3.25rem',
            paddingBottom: '1rem'
          }}
        >
          <div
            className="box py-5 px-6"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '90%',
              maxWidth: '800px',
              height: '80%',
              maxHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 'auto'
            }}
          >
            <h1 className="title is-3 has-text-grey-dark">Your Thunk Log</h1>
            <p className="subtitle is-5 has-text-grey-dark">Entries will appear here</p>
            {/* Log entries to render here */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Log;
