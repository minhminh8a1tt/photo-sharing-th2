/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
async function fetchModel(url) {
  const response = await fetch(`http://localhost:8081/api${url}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Khong the lay du lieu");
  } else {
    return response.json();
  }
}

export default fetchModel;
