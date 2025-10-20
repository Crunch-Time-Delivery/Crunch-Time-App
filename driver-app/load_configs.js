async function fetchConfig(url) {
  const response = await fetch(url);
  return response.json();
}