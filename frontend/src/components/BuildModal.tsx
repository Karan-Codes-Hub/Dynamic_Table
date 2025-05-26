// components/BuildModal.js
import '../../styles/BuildModal.css'; // We'll create this CSS file next

const BuildModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Build Your Project</h2>
        <div className="modal-content">
          <p>This is where your build content would go. You can add forms, options, or any other interactive elements here.</p>
          <div className="modal-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="confirm-button">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildModal;