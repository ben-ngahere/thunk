import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed: import request from 'superagent'; // No longer needed as we use apiClient.ts
import { PlusSquare, RefreshCw, LogOut, CircleUser } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/ThunkLog.css'

// Import the getThunks function from your apiClient.ts
import { getThunks as fetchThunksFromApi } from '../apiClient'; // Aliased to avoid naming conflict with local function if it still existed.

// TYPE: Thunk Entry (server/db.ts ln7)
export interface Thunk {
  id: number;
  user_id: string;
  title: string;
  text: string;
  created_at: string;
}

const Log = () => {
  // User Authenticated?
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();
  const navigate = useNavigate();

  const [thunks, setThunks] = useState<Thunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or still loading user
  useEffect(() => {
    if (!isLoading && !isAuthenticated){
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading){
    return <div>Loading...</div>;
  }

  if (!isAuthenticated){
    return null; // Or a message indicating user is not authenticated
  }

  // Unified function to fetch thunks, handling loading and errors
  const fetchAndSetThunks = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://thunk/api'
        }
      });
      console.log('Access Token (Log):', accessToken);

      const fetchedThunks = await fetchThunksFromApi(accessToken); // Call the imported API function
      setThunks(fetchedThunks);
      console.log('Fetched thunks:', fetchedThunks);
    } catch (err) {
      console.error('Error fetching thunks:', err);
      setError('Error getting thunks');
    } finally {
      setLoading(false);
    }
  };

  // GET: Thunks when Log.tsx loads and on authentication status changes
  useEffect(() => {
    // Only fetch if authenticated and not already loading
    if (isAuthenticated && !isLoading) {
      fetchAndSetThunks();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]); // Added getAccessTokenSilently to dependencies

  // New Entry Button
  const handleNewEntryClick = () => {
    navigate('/newentry');
  };

  // Handle Thunk Click (Edit)
  const handleThunkClick = (thunkId: number) => {
    navigate(`/newentry/${thunkId}`);
  };

  // Sign Out Button
  const handleSignOutClick = () => {
    logout ({ logoutParams: { returnTo: window.location.origin }});
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
                 {/* Lucide PlusSquare Icon */}
                  <span className="icon is-small">
                    <PlusSquare size={16} />
                  </span>
                  <span>New Entry</span>
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

      {/* Main Entries Area */}
      <section className="hero is-fullheight">
        <div
          className="hero-body"
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
              boxShadow: '0 18px 16px rgba(0, 0, 0, 0.2)',
              width: '90%',
              maxWidth: '800px',
              height: 'auto',
              maxHeight: 'calc(100vh - 100px)',
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto',
              position: 'relative',
              paddingTop: '2rem',
              paddingBottom: '1rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem'
            }}
          >
            {/* Username Display */}
            {isAuthenticated && user && (
              <div className="navbar-item has-text-black has-text-weight-semibold is-size-7">
                <span className="icon-is-small">
                  <CircleUser size={20} />
                </span>
                {user.name || user.nickname || user.email}
              </div>
            )}

            <h1 className="title is-3 has-text-grey-dark has-text-centered mb-4">Thunk Log</h1>

            {loading && <p className="has-text-info has-text-centered">Loading thunks...</p>}
            {error && <p className="has-text-danger has-text-centered">{error}</p>}
            {!loading && !error && thunks.length === 0 && (
              <p className="has-text-grey has-text-centered">No Thunks Saved</p>
            )}

            {/* Display Thunks */}
            {!loading && !error && thunks.length > 0 && (
              <div className="thunks-list" style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '20px', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                {thunks.map((thunk) => (
                  <div key={thunk.id} className="box mb-3 p-4 thunk-entry " onClick={()=>handleThunkClick(thunk.id)}>
                    <p className="subtitle is-6 mb-2 has-text-grey-dark">{new Date(thunk.created_at).toLocaleDateString('en-GB')}</p>
                    <p className="title is-5 mb-1 has-text-dark">{thunk.title}</p>
                    {/*<p className="content has-text-dark">{thunk.text}</p>*/}
                  </div>
                ))}
              </div>
            )}

            {/* Refresh Button */}
            <div className="field mt-4" style={{ textAlign: 'left', alignSelf: 'flex-start' }}>
              <div className="control">
                <button className="button is-small is-warning" onClick={fetchAndSetThunks} disabled={loading}>
                  {/* Lucide RefreshCw Icon */}
                <span className="icon is-small">
                  <RefreshCw size={16} />
                </span>
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Log;