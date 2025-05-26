// pages/Build.js
import '../../styles/Build.css'; // We'll create this CSS file next
import { useNavigate } from 'react-router-dom';
const Build = () => {

  const navigate = useNavigate();

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1>Coming Soon</h1>
        <p className="coming-soon-text">
          We're working hard to bring you an amazing build experience. 
          This feature will be available in our next update!
        </p>
        {/* <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '65%' }}></div>
          </div>
          <span className="progress-text">65% complete</span>
        </div> */}
        <div className="coming-soon-actions">
          <button className="notify-button">
            Notify Me When Ready
          </button>
          <button className="back-button"
          onClick={() => navigate('/')}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Build;