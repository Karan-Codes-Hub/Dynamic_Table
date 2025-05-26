import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <img
        src="https://media.giphy.com/media/UoeaPqYrimha6rdTFV/giphy.gif"
        alt="Page not found"
        style={{ maxWidth: '100%', height: 'auto', marginBottom: '2rem' }}
      />
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Oops! Page not found</h2>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
        }}
      >
        Back to Homepage
      </button>
    </div>
  );
};

export default NotFound;
