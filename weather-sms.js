const request = require('request')
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const currentConditionsRequestURL =
  'http://dataservice.accuweather.com/currentconditions/v1/55488?apikey='
  + process.env.ACCUWEATHER_API
  + '&details=true'

const dailyForecastRequestURL =
  'http://dataservice.accuweather.com/forecasts/v1/daily/1day/55488?apikey='
  + process.env.ACCUWEATHER_API
  + '&details=true'
  + '&metric=true'

let message = ''
request(currentConditionsRequestURL, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    const conditions = JSON.parse(body)
    const realFeel = conditions[0]['RealFeelTemperature']['Metric']['Value']
    const weatherText = conditions[0]['WeatherText']

    message += `It is ${realFeel}°C and ${weatherText} outside!`

    request(dailyForecastRequestURL, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const conditions = JSON.parse(body)

        const minTemp = conditions['DailyForecasts'][0]['RealFeelTemperature']['Minimum']['Value']
        const maxTemp = conditions['DailyForecasts'][0]['RealFeelTemperature']['Maximum']['Value']

        const dayPhrase = conditions['DailyForecasts'][0]['Day']['LongPhrase']
        const daySnowProbability = conditions['DailyForecasts'][0]['Day']['SnowProbability']
        const dayRainProbability = conditions['DailyForecasts'][0]['Day']['RainProbability']

        const nightPhrase = conditions['DailyForecasts'][0]['Night']['LongPhrase']
        const nightSnowProbability = conditions['DailyForecasts'][0]['Night']['SnowProbability']
        const nightRainProbability = conditions['DailyForecasts'][0]['Night']['RainProbability']

        message += `
            \nToday's forecast:
            \nhighest: ${maxTemp}°C
            \nlowest: ${minTemp}°C
            \n${dayPhrase} with snow probability of ${daySnowProbability}% and rain probability of ${dayRainProbability}%.
            \n${nightPhrase} with snow probability of ${nightSnowProbability}% and rain probability of ${nightRainProbability}%.
             `

        console.log(message)

        client.messages
          .create({
            body: message,
            from: process.env.TWILIO_NUMBER,
            to: process.argv[2]
          })
          .then(message => console.log(message.sid))
          .done()
      }
    })
  }
})
