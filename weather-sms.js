(async function () {
  const getJson = require('./get-json')

  const currentConditionsRequestURL =
    'http://dataservice.accuweather.com/currentconditions/v1/55488?apikey='
    + process.env.ACCUWEATHER_API
    + '&details=true'

  const dailyForecastRequestURL =
    'http://dataservice.accuweather.com/forecasts/v1/daily/1day/55488?apikey='
    + process.env.ACCUWEATHER_API
    + '&details=true'
    + '&metric=true'

  const currentConditions = await getJson(currentConditionsRequestURL)
  const dailyForecast = await getJson(dailyForecastRequestURL)
  const message = _printForecastMessage(currentConditions, dailyForecast)

  _sendTextMessage(message)
})()

const _printForecastMessage = (currentConditions, dailyForecast) => {
  const realFeel = currentConditions[0]['RealFeelTemperature']['Metric']['Value']
  const weatherText = currentConditions[0]['WeatherText']

  const minTemp = dailyForecast['DailyForecasts'][0]['RealFeelTemperature']['Minimum']['Value']
  const maxTemp = dailyForecast['DailyForecasts'][0]['RealFeelTemperature']['Maximum']['Value']
  const dayPhrase = dailyForecast['DailyForecasts'][0]['Day']['LongPhrase']
  const daySnowProbability = dailyForecast['DailyForecasts'][0]['Day']['SnowProbability']
  const dayRainProbability = dailyForecast['DailyForecasts'][0]['Day']['RainProbability']
  const nightPhrase = dailyForecast['DailyForecasts'][0]['Night']['LongPhrase']
  const nightSnowProbability = dailyForecast['DailyForecasts'][0]['Night']['SnowProbability']
  const nightRainProbability = dailyForecast['DailyForecasts'][0]['Night']['RainProbability']

  return `
    \n It is ${realFeel}°C and ${weatherText} outside!
    \nToday's forecast:
    \nhighest: ${maxTemp}°C
    \nlowest: ${minTemp}°C
    \n${dayPhrase} with snow probability of ${daySnowProbability}% and rain probability of ${dayRainProbability}%.
    \n${nightPhrase} with snow probability of ${nightSnowProbability}% and rain probability of ${nightRainProbability}%.
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
