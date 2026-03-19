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
    setInfoBoxes(infoBoxes.filter(b => b.id !== id));
  };

  return (
    <>
      {infoBoxes.map((box) => (
        <div key={box.id} className="info-box" style={{ display: 'flex', backgroundColor: '#fff', padding: 15, borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: 10 }}>
          <div className="icon-section" style={{ flexShrink: 0 }}>
            <div className="icon" style={{ fontSize: 24 }}>{box.icon}</div>
          </div>
          <div className="details" style={{ flex: 1, paddingLeft: 10 }}>
            <div contentEditable style={{ fontWeight: 'bold' }}>{box.name}</div>
            <a href={box.link} target="_blank" rel="noopener noreferrer" style={{ color: 'red', textDecoration: 'underline' }}>Link</a>
            <div className="links" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button className="edit-btn" onClick={() => alert('Edit')}>✏️</button>
              <button className="remove-btn" onClick={() => handleRemoveBox(box.id)}>🗑️</button>
            </div>
          </div>
        </div>
      ))}
      <button id="add-btn" style={{ marginTop: 20, padding: '12px 20px', background: 'red', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }} onClick={handleAddBox}>Add Restaurant Info</button>
    </>
  );
}