import axios from 'axios';

const URL = 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search'

export const getCoords = async (q) => {
    try{
        // //console.log("coord");
        const { data  } = await axios.get(URL,{
            
            params: {q: q},

            headers: {
              'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
            }
                    
                })
        const lat = data[0].lat;
        const lng = data[0].lon;
        const CoordsData = {lat,lng};
        // //console.log('coordsdata',CoordsData);
        return CoordsData;
    }catch(error){
        //console.log(error)
    }
}