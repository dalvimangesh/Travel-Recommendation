import axios from 'axios';

const URL = 'https://travel-advisor.p.rapidapi.com/locations/search'

export const getLocationID = async (value) => {
    try{
        //console.log("for",value);
        const { data : { data } } = await axios.get(URL,{
            
            params: {
                query: value,
                
              },
              headers: {
                
                'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'              }
        })

        //console.log('data',data);
        return data[0].result_object.location_id;
    }catch(error){
        //console.log(error)
    }
}