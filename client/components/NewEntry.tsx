//import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import request from 'superagent'

const NewEntry = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const MOCK_USER_ID = 'mock_user_ben';

  // Save Button
  const handleSaveClick = async () => {
    setMessage('')

    if (!title.trim() || !text.trim()){
      setMessage('title and text cannot be empty')
    }

    try{
      const response = await request
      .post('/api/thunks')
      .send({ user_id: MOCK_USER_ID, title, text })

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
    console.log('Log button clicked!');
    navigate('/log')
  };

  // Sign Out Button
  const handleSignOutClick = () => {
    console.log('Log Out button clicked!');
    navigate('/');
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
                  View Log
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

      {/* Main Input */}
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
              justifyContent: 'space-between',
              margin: 'auto'
            }}
          >
            {/* Title Input */}
            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input className="input is-medium" type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>

            {/* Text Input */}
            <div className="field" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <label className="label">Text</label>
              <div className="control" style={{ flexGrow: 1 }}>
                <textarea
                  className="textarea"
                  placeholder="text"
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
                  <strong>Save</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewEntry;
