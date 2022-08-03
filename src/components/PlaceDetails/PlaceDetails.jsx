import React, { useState, useEffect} from 'react'
import {Typography} from '@mui/material';
import Form from 'react-bootstrap/Form';


import Details from '../Details/Details';
import styles from "./style.module.css"

const PlaceDetails = ({ locationId, setlocationId, places, isLoading, rating, setRating}) => {

  // //console.log(places)

  return (
    <>
    <div>
    
      <Typography variant = 'h5'className={styles.title}>Famous Attractions around:
      </Typography>
      
      </div>
    {isLoading? " "
      :
      (
        <>
             <Form.Select placeholder = "Rating"
              className='formControl'
              value = {rating}    
              onChange={(e)=>setRating(e.target.value)}
              >
              
                <option value ="rating" disabled hidden>Rating</option>
                <option value="0">All</option>
                <option value="3">Above 3.0</option>
                <option value="4">Above 4.0</option>
                <option value="5">Above 4.5</option>
              </Form.Select>
                &nbsp;
    
                  
                  <div className = {styles.GridC}>
                    {places?.map((place,i) => {
                        return < Details xs = {12} key = {i} place = {place} />  ;
                       
                      })}
                  </div>
                
        </>
      )

    }
    </>
   
  )
}

export default PlaceDetails

