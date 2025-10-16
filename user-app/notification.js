// notification.js

// Function to show notification with sound
function showNotification(message, soundFile='notification.mp3') {
  const audio = new Audio(soundFile);
  audio.play();

  const container = document.getElementById('notificationContainer');
  if (container) {
    container.innerHTML = `<p>${message}</p>`;
    // Add a red notification button below the message
    let notifButton = document.getElementById('notificationButton');
    if (!notifButton) {
      notifButton = document.createElement('button');
      notifButton.id='notificationButton';
      notifButton.innerText='🔴'; // Red dot icon
      notifButton.style.position='absolute';
      notifButton.style.top='10px';
      notifButton.style.right='10px';
      notifButton.style.background='red';
      notifButton.style.border='none';
      notifButton.style.borderRadius='50%';
      notifButton.style.width='30px';
      notifButton.style.height='30px';
      notifButton.style.cursor='pointer';
      notifButton.onclick=()=>{ alert('Notification clicked!'); };
      container.appendChild(notifButton);
    }
  }
}