async function getResourceAsync(url, params = {}) {
  const urlObj = new URL(url);

  for (let key in params) {
    const value = params[key];

    if (value) {
      urlObj.searchParams.append(key, value);
    }
  }

  const response = await fetch(urlObj);
  return await response.json();
}

export default getResourceAsync;
