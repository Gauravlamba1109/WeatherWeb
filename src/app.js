const path = require('path')
const express = require('express')
const hbs = require('hbs')
const utils = require('./utils/geocode')

const app = express()
const port= process.env.PORT || 3000

//define paths for express config 
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath= path.join(__dirname, '../templates/views')
const partialsPath= path.join(__dirname, '../templates/partials')

//setup handlebars engine an view location 
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup directory to serve
app.use(express.static(publicDirectoryPath))

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }
    
    utils.geocode(req.query.address , (error,geodata) => {
        if(error) return res.send({error});
            
        utils.forecast(geodata, (error,forecastdata) => {
            if(error) return res.send({error});
            
            res.send([{
                forecast : forecastdata,
                location : geodata.location ,
                address : req.query.address
            }])
        }) 
    })

    
})

app.get('/products', (req,res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        products : []
    })
})

app.get('' , (req,res) => {
    res.render('index', {
        title: 'Weather App',
        name : 'Gaurav'
    })
})

app.get('/about' , (req,res) => {
    res.render('about', {
        title: 'About me',
        name : 'Gaurav Lamba'
    })
})

app.get('/help' , (req,res) => {
    res.render('help', {
        title: 'Help',
        helpText : 'this is helpful' ,
        name : 'Gaurav Lamba'
    })
})

app.get('/help/*' , (req,res) => {
    res.render('404' ,{
        title: 'Help',
        name : 'Gaurav Lamba',
        errorMessage : 'Help page not found , ask a bro 💁'
    })
})

app.get('*' , (req,res) => {
    res.render('404' ,{
        title: 'Help',
        name : 'Gaurav Lamba',
        errorMessage : 'Page not found , typo maybe 🥲?'
    })
})

app.listen(port, () => {
    console.log('server is up on port '+ port)
})

