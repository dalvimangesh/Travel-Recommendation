import React, {useState, useEffect} from 'react'
import {FormControlLabel,FormGroup,Typography , Button, Checkbox} from '@mui/material'

import {TextField} from '@mui/material'
import styles from "./style.module.css"
import {getDistance} from './distance.js'
import {getCoords} from './cords.js'


function Footer() {
  
  const [origin,setOrigin] = useState('');
  const [destination,setDestination] = useState('');

  const [source,setSource] = useState('');
  const [originC,setOriginC] = useState([]);
  const [destinationC,setDestinationC] = useState([]);

  const [distance,setDistance] = useState([]);
  const [duration,setDuration] = useState([]);

  const [checked,setChecked] = useState(false);

  const handleCheck = () =>{
    setChecked(!checked)
    //console.log(!checked)
    if(!checked === true)
    {
      navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}})=>{
      const lat = JSON.stringify(latitude);
      const lng = JSON.stringify(longitude);
      const MyLocation = {lat,lng};
      
      setOriginC(MyLocation);
      setSource("My Location")});
    

    }  
    else
    {
      setSource('')
    }  
    
    
  }


  const handleClick = () =>
  {
    //console.log(origin,destination,'oriinDestination');
    if(source !== 'My Location')
    {
    if(origin){
    getCoords(origin)
      .then((data) => {
          //console.log('originC',data);
          setOriginC(data);
      })
    }
    }
    if(destination){
    getCoords(destination)
      .then((data) => {
          //console.log('destC',data);
          setDestinationC(data);
      })
    }

  }
 
  useEffect(()=>{
 
    //console.log(originC)
    //console.log(,originC.lat,originC.lng);
    //console.log(destinationC.lat,destinationC.lng);

    getDistance(originC,destinationC)
      .then((data) => {
        //console.log(data);
        const dist = (data.distance/1000)
        const hour = (Math.floor(data.duration/3600))
        const min = Math.ceil((data.duration % 3600)/60)
        setDistance(dist);
        setDuration([hour,min]);
           
        })
    
  },[originC && destinationC])


  
  return (
    <>

    <div>
    <Typography className={styles.title} ><h3>Calculate Distance and Duration for travel: </h3></Typography>
    </div>
    <div className={styles.formdiv}>

    <FormControlLabel control = {
      <Checkbox
        checked = {checked}
        onChange= {handleCheck}
        name = 'check'
        
        />
    }
    label = "Keep source as my own Location"
    />
    

    <FormGroup row className={styles.Form}>    
<br/><br/>
      <TextField className={styles.textfield} variant='outlined' label='Source' disabled={checked} value = {source} onChange={(e) => {setSource(e.target.value);setOrigin(e.target.value)}} />     
      &nbsp;&nbsp;&nbsp;
      <TextField className={styles.textfield} variant='outlined' label='Destination' onChange={(e) => {setDestination(e.target.value)}} />
      &nbsp;&nbsp;&nbsp;
      <Button  className={styles.btn} variant = 'contained' color = 'primary' onClick = {handleClick}>Find</Button>

      
    </FormGroup>
    {(destination && duration)?
        (
        <>
        <Typography className={styles.display}><h5>Distance: {distance} km</h5></Typography>
        <Typography className={styles.display}><h5>Duration: {duration[0]} hr {duration[1]} min</h5></Typography>
        </>
        )
          : ""    
      }

    </div>
    <br/><br/>
    </>
  )
}

export default Footer
