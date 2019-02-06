const request = require('request')

const accuWeatherApiKey = process.env.ACCUWEATHER_API
const accuWeatherRequestURL =
  'http://dataservice.accuweather.com/currentconditions/v1/55488?apikey='
  + accuWeatherApiKey
  + '&details=true'

request(accuWeatherRequestURL, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    const currentConditions = JSON.parse(body)
    const realFeel = currentConditions[0]['RealFeelTemperature']['Metric']['Value']

    console.log(realFeel)
  }
})
