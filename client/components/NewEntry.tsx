//import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import request from 'superagent'
import { List, LogOut, Save, Trash2 } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react';
import { Thunk } from './Log'

const NewEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams<{id: string }>()
  const { logout, getAccessTokenSilently, user } = useAuth0();
  
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const isEditMode = !!id // If ID is in URL switch to Edit Mode

  // const MOCK_USER_ID = 'mock_user_ben';

  // GET: Saved Thunk (If in Edit Mode)
  useEffect(() => {
    const fetchThunk = async () => {
      if (!isEditMode) return;

      setIsLoading(true);
      setMessage('');
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://thunk/api',
          },
        });

        const response = await request
          .get(`/api/thunks/${id}`)
          .set('Authorization', `Bearer ${accessToken}`);

        const fetchedThunk: Thunk = response.body;
        setTitle(fetchedThunk.title);
        setText(fetchedThunk.text);
        //setMessage('Thunk loaded for editing');
      } catch (error) {
        console.error('Error getting thunk for editing:', error);
        setMessage('Failed to load thunk for editing');
      } finally {
        setIsLoading(false);
      }
    };

    // Makes sure user is logged in before fetching
    if (user) {
      fetchThunk();
    }
  }, [id, isEditMode, getAccessTokenSilently, navigate, user]);

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

      // If in Edit mode - send PUT request
      let response;
      if (isEditMode && id) {
        response = await request
          .put(`/api/thunks/${id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ title, text });
        console.log('Thunk Updated', response.body);
        setMessage('Thunk updated successfully');
      } else { // Carry on as NewEntry
    
      const response = await request
      .post('/api/thunks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ user_id: user?.sub, title, text })

      console.log('Thunk Saved', response.body.thunk)
      setMessage('Thunk Saved')
      }

      setTitle('')
      setText('')
      navigate('/log')
    }catch (error){
      console.error('Error Saving', error)
      setMessage('Error Saving')
    }
  };

  // Handle Delete Click
  const handleDeleteClick = () => {
    setMessage(''); // Clear any previous messages
    setShowDelete(true); // Show the confirmation dialog
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!id) return;

    setShowDelete(false);
    setMessage('Deleting thunk...');
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://thunk/api',
        },
      });

      await request
        .delete(`/api/thunks/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      setMessage('Thunk deleted successfully');
      navigate('/log');
    } catch (error) {
      console.error('Error deleting thunk:', error);
      setMessage('Failed to delete thunk');
    }
  };

  // Cancel Delete
  const cancelDelete = () => {
    setShowDelete(false); // Hide confirmation dialog
    setMessage('Deletion cancelled.');
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
          {/* Edit (should change with mode) */}
          <h1 className="title is-3 has-text-grey-dark has-text-centered mb-4">
            {isEditMode ? 'Edit Thunk' : 'New Entry'}
          </h1>
          {/* Loading Edit */}
          {isLoading && <p className="has-text-info has-text-centered">Loading thunk...</p>}

          {/* Title Input */}
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input className="input is-medium" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading}  />
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
                disabled={isLoading}
              ></textarea>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <p className={`help ${message.includes('successfully') ? 'has-text-success' : 'has-text-danger'} mb-3`}>
              {message}
            </p>
          )}

          {/* Delete Confirmation */}
          {showDelete && (
            <div className="modal is-active">
              <div className="modal-background" onClick={cancelDelete}></div>
              <div className="modal-content" style={{ maxWidth: '400px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', textAlign: 'center' }}>
                <p className="subtitle is-5 has-text-grey-dark mb-4">Are you sure you want to delete this thunk?</p>
                <div className="buttons is-centered">
                  <button className="button is-danger" onClick={confirmDelete}>Delete</button>
                  <button className="button" onClick={cancelDelete}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Save/Update & Delete Buttons */}
          <div className="field mt-4" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="control">
              <button
                className="button is-small is-primary"
                onClick={handleSaveClick}
                disabled={isLoading}
              >
                <span className="icon is-small">
                  <Save size={16} />
                </span>
                <span><strong>{isEditMode ? 'Update' : 'Save'}</strong></span> {/* Update will show in Edit Mode */}
              </button>
            </div>

            {isEditMode && ( // Delete button appears in Edit Mode only
              <div className="control">
                <button
                  className="button is-small is-danger is-outlined"
                  onClick={handleDeleteClick}
                  disabled={isLoading}
                >
                  <span className="icon is-small">
                    <Trash2 size={16} />
                  </span>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewEntry;