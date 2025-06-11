//import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import request from 'superagent'
import { List, LogOut, Save } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react';

const NewEntry = () => {
  const navigate = useNavigate();
  const { logout, getAccessTokenSilently, user } = useAuth0();
  
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  // const MOCK_USER_ID = 'mock_user_ben';

  // Save Button
  const handleSaveClick = async () => {
    setMessage('')

    if (!title.trim() || !text.trim()){
      setMessage('title and text cannot be empty')
      return
    }

    try{
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
        audience: 'https://thunk/api'
        }
      })
      console.log('Access Token:', accessToken)

      const response = await request
      .post('/api/thunks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ user_id: user?.sub, title, text })

      console.log('Thunk Saved!', response.body.thunk)
      setMessage('Thunk Saved!')
      setTitle('')
      setText('')
      navigate('/log')
    }catch (error){
      console.error('Error Saving!', error)
      setMessage('Error Saving!')
    }

    // console.log('Save button clicked!');
  };

  // View Log Button
  const handleLogClick = () => {
    //console.log('Log button clicked!');
    navigate('/log')
  };

  // Sign Out Button
  const handleSignOutClick = () => {
    logout({ logoutParams: { returnTo: window.location.origin }})
    //console.log('Log Out button clicked!');
    //navigate('/');
  };

  return (
    <div className="new-entry-page-wrapper">
      {/* Nav Bar */}
      <nav className="navbar is-info is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="navbar-item is-size-3 has-text-white has-text-weight-bold">
            thunk.
          </div>
        </div>
        <div id="navbarBasicExample" className="navbar-menu is-active">
          <div className="navbar-end">

            {/* View Log Button */}
            <div className="navbar-item">
              <div className="buttons">
                <button className="button is-small is-link" onClick={handleLogClick}>
                   {/* Lucide List Icon */}
                  <span className="icon is-small">
                    <List size={16} />
                  </span>
                  <span>View Log</span>
                </button>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="navbar-item">
              <div className="buttons">
                <button className="button is-small is-danger" onClick={handleSignOutClick}>
                  {/* Lucide LogOut Icon */}
                  <span className="icon is-small">
                    <LogOut size={16} />
                  </span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Input */}
      <section
        className="hero is-fullheight"
        style={{
          background: 'linear-gradient(to bottom right, #2c3e50, #4a6a8a)',
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
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            width: '90%',
            maxWidth: '800px',
            height: '80%',
            maxHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            margin: 'auto'
          }}
        >
          {/* Title Input */}
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input className="input is-medium" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
          </div>

          {/* Text Input */}
          <div className="field" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <label className="label">Text</label>
            <div className="control" style={{ flexGrow: 1 }}>
              <textarea
                className="textarea"
                placeholder="Write here..."
                style={{ minHeight: '150px', height: '100%', resize: 'vertical' }}
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <p className={`help ${message.includes('successfully') ? 'has-text-success' : 'has-text-danger'} mb-3`}>
              {message}
            </p>
          )}

          {/* Save Button */}
          <div className="field mt-4" style={{ textAlign: 'left' }}>
            <div className="control">
              <button className="button is-small is-primary" onClick={handleSaveClick}>
                {/* Lucide Save Icon */}
                <span className="icon is-small">
                  <Save size={16} />
                </span>
                <span><strong>Save</strong></span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewEntry;