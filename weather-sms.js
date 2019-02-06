const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const request = require('request')
const accuWeatherRequestURL =
  'http://dataservice.accuweather.com/currentconditions/v1/55488?apikey='
  + process.env.ACCUWEATHER_API
  + '&details=true'

console.log(process.argv)

request(accuWeatherRequestURL, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    const currentConditions = JSON.parse(body)
    const realFeel = currentConditions[0]['RealFeelTemperature']['Metric']['Value']

    client.messages
      .create({
        body: `It is ${realFeel} outside!`,
        from: process.env.TWILIO_NUMBER,
        to: process.argv[2]
      })
      .then(message => console.log(message.sid))
      .done();
  }
})
