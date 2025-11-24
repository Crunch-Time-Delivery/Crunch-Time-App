import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Admin Dashboard', () => {
  beforeEach(() => {
    // Set up the DOM with your HTML code
    document.body.innerHTML = `
      <div id="root"></div>
      
      <!-- Insert your full HTML code here or assume the DOM is already set up -->
    `;
  });

  test('uploads a profile image', () => {
    // Find the profile image element and the file input
    const profileImage = document.getElementById('profileImage');
    const fileInput = document.getElementById('profileImageInput');

    // Prepare a mock file
    const file = new File(['dummy image content'], 'test.png', { type: 'image/png' });

    // Simulate selecting a file
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Since the updateProfileImage function reads the file and sets src, check if src updated
    expect(profileImage.src).toContain('test.png');
  });
});