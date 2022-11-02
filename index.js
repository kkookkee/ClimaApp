const { leerInput, inquirerMenu, pausa, listarCiudades } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
require('dotenv').config()

const main = async() => {
    let opt
    const busquedas = new Busquedas()
    
    do{
        opt = await inquirerMenu()
        switch(opt) {
            case 1:
                //mostrar mensaje
                const busqueda = await leerInput('Ciudad: ');
                //buscar lugares
                const ciudades = await busquedas.ciudades(busqueda)
                //seleccionar lugar
                const id = await listarCiudades(ciudades);
                if(id==='0') continue;
                const lugarSeleccionado = ciudades.find(l=>l.id===id)
                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                //buscar temp
                const temp = await busquedas.temperatura(lugarSeleccionado.lat,lugarSeleccionado.lng)
                //mostrar info
                console.log('Informacion de la ciudad');
                console.log('Ciudad: ',lugarSeleccionado.nombre);
                console.log('Lat: ',lugarSeleccionado.lat);
                console.log('Lng: ',lugarSeleccionado.lng);
                console.log('Tiempo: ' ,temp.desc);
                console.log('Temperatura: ',temp.temp);
                console.log('Temperatura minima: ',temp.tempMin);
                console.log('Temperatura maxima: ',temp.tempMax);
                break;
            case 2:
                console.log('Tu historial de busquedas: ', busquedas.historial);

        }
        if (opt!==0) await pausa()

    } while (opt!==0)
}

main()