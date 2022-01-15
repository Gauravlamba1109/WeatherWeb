const request = require('request')
const { inflateRaw } = require('zlib')


const geocode = ( address, callback ) => {
    //use encodeURI to handle all type of characters 
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
        + encodeURIComponent(address)
        +'.json?access_token=pk.eyJ1IjoiZ2F1cmF2bGFtYmEiLCJhIjoiY2t5N2Y5enAxMHBpZjJ3cGZ4ZHl3dXRzMyJ9.3PKYZcmHc952k0myiKn0sg&limit=1'
    
    request({ url, json: true}, (error , { body }) => {
        if(error){ //giving it to callback 
            callback('Unable to connect to location services', undefined)
        } else if (body.features.length ===0 ){
            callback('Unable to find location. Try to search again. ', undefined)
        } else {
            callback(undefined , {
                latitude :body.features[0].center[1], 
                longitude : body.features[0].center[0],
                location : body.features[0].place_name
            })
        }
    })
}


const forecast = (data , callback) =>{
    const url = 'http://api.weatherstack.com/current?access_key=5a30a5aca46e5d38caa743ca5e4da2f8&query=' 
    + data.latitude + ',' 
    + data.longitude

    request({ url , json: true} , (error, { body }) => {
        if(error){
            callback('Unable to connect to Server', undefined)
        } else if (body.error){
            callback('Unable to find location', undefined)
        } 
        else {
            callback(undefined , body.current.weather_descriptions[0] + ". It is currently " + body.current.temperature 
            + ' degrees Celsius out. \nFeels like ' + body.current.feelslike 
            + ' degrees Celsius out.')
        }
    })
}


module.exports = {
    geocode,
    forecast
}