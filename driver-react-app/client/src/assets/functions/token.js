fetch('/token')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });