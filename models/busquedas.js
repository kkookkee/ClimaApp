const fs = require('fs')
const axios = require('axios');
class Busquedas {
    historial = [];
    dbPath = './db/database.json'
    constructor(){
        this.cargarHistorial()
    }
    async ciudades (lugar='') {
        //peticion http
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: {
                    'access_token': process.env.MAPBOX_KEY,
                    'limit': 5,
                    'language': 'es'
                }
            })
            const resp = await instance.get();
            return resp.data.features.map(lugar=>({
                id:lugar.id,
                nombre:lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }))
        } catch (error) {
            return [];
        }
    }
    async temperatura(lat,lng) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'appid': process.env.WEATHER_KEY,
                    'lat': lat,
                    'lon': lng,
                    'lang': 'es',
                    'units': 'metric'
                }
            })
            const resp = await instance.get();
            const desc = resp.data.weather[0].description;
            const temp = resp.data.main.temp;
            const tempMin = resp.data.main.temp_min;
            const tempMax = resp.data.main.temp_max;

            return ({
                desc: desc,
                temp: temp,
                tempMin: tempMin,
                tempMax: tempMax
            })
            
        } catch (error) {
            return [];
        }
    }

    agregarHistorial(lugar=''){
        if(this.historial.includes(lugar.toLocaleLowerCase)){
            return;
        }
        this.historial.push(lugar)
        this.guardarDB()
    }

    guardarDB() {
        fs.writeFileSync(this.dbPath,JSON.stringify(this.historial))
    }

    cargarHistorial() {
        if( !fs.existsSync( this.dbPath ) ) return;
        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );
        data.forEach(e => {
            this.historial.push(e)
        });
    }
}

module.exports = Busquedas;