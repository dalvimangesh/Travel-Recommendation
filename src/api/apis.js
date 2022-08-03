import axios from 'axios';

const URL = 'https://travel-advisor.p.rapidapi.com/attractions/list'

export const getPlacesData = async (id) => {
    try{
        //console.log(id,"setting");
        const { data : { data } } = await axios.get(URL,{
            
            params: {
                location_id: id,
                
              },
              headers: {
                
                'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'              }
            })

        return data;
    }catch(error){
        //console.log(error)
    }
}


