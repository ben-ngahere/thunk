import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import request from 'superagent';
import { PlusSquare, RefreshCw, LogOut } from 'lucide-react'

// TYPE: Thunk Entry (server/db.ts ln7)
export interface Thunk {
  id: number;
  user_id: string;
  title: string;
  text: string;
  created_at: string;
}

const Log = () => {
  const navigate = useNavigate();

  const [thunks, setThunks] = useState<Thunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const MOCK_USER_ID = 'mock_user_ben'; // Still needed, gets used in the back-end. Auth0 on it's way soon

  // GET: Saved Thunks for a User
  const getThunks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request.get('/api/thunks');
      setThunks(response.body);
      console.log('Fetched thunks:', response.body);
    } catch (error) {
      console.error('Error getting thunks:', error);
      setError('Error getting thunks');
    } finally {
      setLoading(false);
    }
  };

  // GET: Thunks when Log.tsx loads
  useEffect(() => {
    getThunks();
  }, []);

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
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '90%',
              maxWidth: '800px',
              height: '80%',
              maxHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto',
              overflowY: 'auto', // Lot of entries = enable scroll
              position: 'relative'
            }}
          >
            <h1 className="title is-3 has-text-grey-dark has-text-centered mb-4">Your Thunk Log</h1>

            {loading && <p className="has-text-info has-text-centered">Loading thunks...</p>}
            {error && <p className="has-text-danger has-text-centered">{error}</p>}
            {!loading && !error && thunks.length === 0 && (
              <p className="has-text-grey has-text-centered">No Thunks Saved. Add one!</p>
            )}

            {/* Display Thunks */}
            {!loading && !error && thunks.length > 0 && (
              <div className="thunks-list" style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '20px' }}>
                {thunks.map((thunk) => (
                  <div key={thunk.id} className="box mb-3 p-4 has-background-white-bis">
                    <p className="title is-5 mb-1">{thunk.title}</p>
                    <p className="subtitle is-6 has-text-grey mb-2">{new Date(thunk.created_at).toLocaleString()}</p>
                    <p className="content">{thunk.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Refresh Button */}
            <div className="field mt-4" style={{ textAlign: 'left', alignSelf: 'flex-start' }}>
              <div className="control">
                <button className="button is-small is-warning" onClick={getThunks} disabled={loading}>
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
