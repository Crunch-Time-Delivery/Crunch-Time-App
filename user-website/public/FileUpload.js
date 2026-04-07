// src/FileUpload.js
import React, { useState } from 'react';
import { s3 } from './aws-config';

function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const params = {
      Bucket: 'your-bucket-name', // Replace with your bucket name
      Key: file.name,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read', // or 'private'
    };

    s3.upload(params, (err, data) => {
      if (err) {
        alert('Error uploading file:', err.message);
      } else {
        alert('File uploaded successfully: ' + data.Location);
      }
    });
  };

  return (
    <div>
      <h2>Upload File to S3</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;