import React from 'react';

export function InfoBoxes({ infoBoxes, setInfoBoxes }) {
  const handleAddBox = () => {
    const newBox = {
      id: Date.now(),
      name: 'New Restaurant',
      link: '#',
      icon: '🏢',
    };
    setInfoBoxes([...infoBoxes, newBox]);
  };

  const handleRemoveBox = (id) => {
    setInfoBoxes(infoBoxes.filter(box => box.id !== id));
  };

  return (
    <>
      {infoBoxes.map((box, index) => (
        <div key={box.id} className="info-box">
          <div className="icon-section">
            <div className="icon">{box.icon}</div>
          </div>
          <div className="details">
            <div
              className="field"
              contentEditable
              suppressContentEditableWarning
            >
              {box.name}
            </div>
            <a href={box.link} className="hyperlink-red" target="_blank" rel="noopener noreferrer">
              {box.link}
            </a>
            <div className="links">
              <button className="edit-btn" onClick={() => alert('Edit functionality')}>✏️</button>
              <button className="remove-btn" onClick={() => handleRemoveBox(box.id)}>🗑️</button>
            </div>
          </div>
        </div>
      ))}
      <button id="add-btn" onClick={handleAddBox}>Add Restaurant Info</button>
    </>
  );
}