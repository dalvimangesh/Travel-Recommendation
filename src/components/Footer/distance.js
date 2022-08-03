import axios from 'axios';

const URL = 'https://trueway-directions2.p.rapidapi.com/FindDrivingPath'

export const getDistance = async (origin,destination) => {
    try{
        const originD = origin.lat + ',' + origin.lng
        const destinationD = destination.lat + ',' + destination.lng

        const { data } = await axios.get(URL,{
            
            params: {origin: originD,
                     destination: destinationD},
                     
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'trueway-directions2.p.rapidapi.com'
                    }

                })

        //console.log('distdata',data.route);
        return data.route;
    }catch(error){
        //console.log(error)
    }
}