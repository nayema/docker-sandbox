(async function () {
  const getJson = require('./get-json')

  const currentConditionsRequestURL =
    'http://dataservice.accuweather.com/currentconditions/v1/55488?apikey='
    + process.env.ACCUWEATHER_API
    + '&details=true'

  const eveningForecastRequestURL =
    'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/55488?apikey='
    + process.env.ACCUWEATHER_API
    + '&details=true'
    + '&metric=true'

  const dailyForecastRequestURL =
    'http://dataservice.accuweather.com/forecasts/v1/daily/1day/55488?apikey='
    + process.env.ACCUWEATHER_API
    + '&details=true'
    + '&metric=true'

  const currentConditions = await getJson(currentConditionsRequestURL)
  const dailyForecast = await getJson(dailyForecastRequestURL)
  const eveningForecast = await getJson(eveningForecastRequestURL)
  const message = _printForecastMessage(currentConditions, dailyForecast, eveningForecast)

  _sendTextMessage(message)
})()

const _printForecastMessage = (currentConditions, dailyForecast, eveningForecast) => {
  const realFeel = currentConditions[0]['RealFeelTemperature']['Metric']['Value']
  const weatherText = currentConditions[0]['WeatherText']

  const dayRainProbability = dailyForecast['DailyForecasts'][0]['Day']['RainProbability']
  const nightRainProbability = dailyForecast['DailyForecasts'][0]['Night']['RainProbability']

  const realFeelIn9Hours = eveningForecast[8]['RealFeelTemperature']['Value']
  const weatherTextIn9Hours = eveningForecast[8]['IconPhrase']

  return `
    \n---
    \nIt is ${realFeel}°C and ${weatherText} right now.
    \nIt will be ${realFeelIn9Hours}°C and ${weatherTextIn9Hours} on your way home this evening.
    \nThere is a rain probability of ${(dayRainProbability + nightRainProbability) / 2}% today.
    `
}

const _sendTextMessage = (message) => {
  const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_NUMBER,
      to: process.argv[2]
    })
    .then(message => console.log(message.sid))
    .done()
}
