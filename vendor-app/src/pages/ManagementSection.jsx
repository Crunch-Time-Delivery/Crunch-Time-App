import React from 'react';

function ManagementSection({ type }) {
  // Placeholder data / functions, you can expand
  const handleAdd = () => {
    alert(`Add new ${type}`);
  };

  return (
    <div>
      <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
      <button style={{ background: '#f60202', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '4px', marginBottom: '10px' }} onClick={handleAdd}>Add {type}</button>
      {/* You can add tables or lists here based on type */}
      <div>{`Manage ${type} here...`}</div>
    </div>
  );
}

export default ManagementSection;