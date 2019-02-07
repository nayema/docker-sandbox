const request = require('request')
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const accuWeatherCurrentConditionsRequestURL =
  'http://dataservice.accuweather.com/currentconditions/v1/55488?apikey='
  + process.env.ACCUWEATHER_API
  + '&details=true'

const accuWeather12HourForecastRequestURL =
  'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/55488?apikey='
  + process.env.ACCUWEATHER_API
  + '&details=true'
  + '&metric=true'


request(accuWeatherCurrentConditionsRequestURL, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    const currentConditions = JSON.parse(body)
    const realFeel = currentConditions[0]['RealFeelTemperature']['Metric']['Value']

    client.messages
      .create({
        body: `It is ${realFeel}°C outside!`,
        from: process.env.TWILIO_NUMBER,
        to: process.argv[2]
      })
      .then(message => console.log(message.sid))
      .done();
  }
})

request(accuWeather12HourForecastRequestURL, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    const conditions = JSON.parse(body)

    let forecastedConditions = []
    conditions.map(condition => {
        const hourlyRealFeel = condition['RealFeelTemperature']['Value']
        const hourlyIconPhrase = condition['IconPhrase']
        const hourlyForecast = `${hourlyIconPhrase} ${hourlyRealFeel}°C`

        forecastedConditions.push(hourlyForecast)
      }
    )

    client.messages
      .create({
        body: `Weather conditions for the next 12 hours: ${forecastedConditions.join('\n')}`,
        from: process.env.TWILIO_NUMBER,
        to: process.argv[2]
      })
      .then(message => console.log(message.sid))
      .done();
  }
})
