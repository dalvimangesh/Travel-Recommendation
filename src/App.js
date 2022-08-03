import React, { useState, useEffect } from 'react'
import { CssBaseline,Grid } from '@mui/material';
import { getPlacesData } from './api/apis';
import { getLocationID } from './api/getLocationId';


import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
// import Map from './components/Map/Map';
import PlaceDetails from './components/PlaceDetails/PlaceDetails';
import Details from './components/Details/Details';


function App() {

     const [places,setPlaces] = useState([]);
     const [rating,setRating] = useState('rating');
     const [isLoading,setIsLoading] = useState(false);
     const [filteredPlaces,setFilteredPlaces] = useState([]);

    

// 298571
const [locationID, setlocationID] = useState([]); 
const [searched, setSearched] = useState("");

  useEffect( () => {   
    //console.log("bo");  
    if(locationID){   
    
      //console.log(locationID)
      getPlacesData(locationID) 
        .then((data) =>{
          
            //console.log(data);
            setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
            setFilteredPlaces(filteredPlaces)
            setIsLoading(false)
        })
      }
  },[locationID]);

  useEffect(()=>{
    //console.log("finding id");
    //console.log(searched);
    if(searched){
      getLocationID(searched)
        .then((data) => {
            //console.log(data);
            setlocationID(data);
        })
    }
  },[searched])


  useEffect( () =>{
    const filteredPlaces = places?.filter((place) => place.rating > rating);
    setFilteredPlaces(filteredPlaces)
  },[rating]);

  

  return (
       <>
    <CssBaseline/>  
    <Header searched = {searched} setSearched = { setSearched }/>
     <Grid container spacing = {2} style = {{width:'100%'}} >
       <Grid item xs={12}  md={12} padding = {5} >
          
           <PlaceDetails
              locationID = { locationID }
              setlocationID = { setlocationID }
              places = {filteredPlaces?.length? filteredPlaces :places}

              isLoading = {isLoading}
              rating = {rating}
              setRating = {setRating}
           /> 
                 
       </Grid>
   
     </Grid>
 
    <Footer/>
    </>
    
  );
}

export default App;
