function performAPICall(url, params = {}, method = 'GET', body, setResponse) {
  setResponse({
    pages: null,
    data: null,
    error: null,
    isInProgress: true,
    isDone: false,
  });

  const headers = {};

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const urlObj = new URL(url);

  for (const key in params) {
    const value = params[key];

    if (value) {
      urlObj.searchParams.append(key, value);
    }
  }

  fetch(urlObj, {
    method,
    body,
    headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error response. Status: ${response.status}, status text: ${response.statusText}`,
        );
      }

      setResponse((prev) => ({
        ...prev,
        pages: parseLinkHeader(response.headers.get('Link')),
      }));

      return response.json();
    })
    .then((json) =>
      setResponse((prev) => ({
        ...prev,
        data: json,
        error: null,
        isDone: true,
        isInProgress: false,
      })),
    )
    .catch((error) =>
      setResponse({
        data: null,
        error: error,
        isDone: true,
        isInProgress: false,
      }),
    );
}

function parseLinkHeader(link) {
  if (!link) {
    return null;
  }

  const res = {};

  link.split(', ').forEach((part) => {
    const linkToRel = part.split('; rel=');
    const match = linkToRel[0].match(/_page=(\d+)/);

    const page = match[1];
    const rel = linkToRel[1].replaceAll('"', '');

    res[rel] = +page;
  });

  return res;
}

export default performAPICall;
