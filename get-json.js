const { URL } = require('url')

const getJson = (url, options = {}) => new Promise((resolve, reject) => {
  const urlParsed = new URL(url)
  const lib = urlParsed.protocol === 'http' ? require('http') : require('https')
  let optionsWithUrl = {
    path: urlParsed.pathname + urlParsed.search,
    host: urlParsed.hostname,
    ...options
  }
  const request = lib.get(optionsWithUrl, response => {
    if (response.statusCode < 200 || response.statusCode > 299) {
      reject(new Error('Request failed with status code: ' + response.statusCode))
    }
    const body = []
    response.on('data', chunk => body.push(chunk))
    response.on('error', err => reject(err))
    response.on('end', function () {
      const parsedBody = JSON.parse(body.join(''))
      return resolve(parsedBody)
    })
  })
  request.on('error', err => reject(err))
})

module.exports = getJson
