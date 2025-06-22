const https = require('https');

exports.handler = async (event) => {
  const query = event.queryStringParameters.query;
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: data
        });
      });
    }).on('error', (err) => {
      reject({
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching TMDb data', error: err.message })
      });
    });
  });
};
