import React from 'react'
import Card  from 'react-bootstrap/Card'
import Button  from 'react-bootstrap/Button'
import { Typography,Box, Chip } from '@mui/material'

import styles from "./style.module.css"

const Details = ({ place }) => {
  //console.log('place',place)

  if (place.web_url !== "https://www.tripadvisor.com/Attractions")
  {
  return ( 
        <>
          <div className={styles.Cards}>
          
            <Card.Img variant="top" className={styles.img} src= {place.photo ? place.photo.images.large.url : "https://cdn.wallpapersafari.com/62/95/zkSBYe.jpg"} />
            <Card.Body>
              <Card.Title className={styles.title} >{place?.name}</Card.Title>
              <Card.Text>
                <Box className = {styles.box} >
                  Rating: {place?.rating? place.rating : "-"}
                <Typography gutterBottom variant="subtitle2">{place.num_reviews} review{place.num_reviews > 1 && 's'} &nbsp;&nbsp;</Typography>
                </Box>

               
                <Box className = {styles.box}>
                  <Typography component="legend">{place?.ranking? "Ranking: " : ""}</Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {place.ranking? place.ranking : ""}
                  </Typography>
                </Box>
                
                <Box className = {styles.box}>
                <Typography gutterBottom variant="subtitle1" size="12" marginTop={1}>
                   {place.offer_group? "Price: " : ""}
                </Typography>
                  
                  <Typography gutterBottom variant="subtitle1" size="12" marginTop={1}>
                   {place.offer_group?  place.offer_group.lowest_price  : ""}
                   &nbsp;&nbsp;&nbsp;&nbsp;
                   </Typography>
                </Box>
             
                <Typography gutterBottom variant="body2" color="textSecondary" className='subtitle'>
                  {place.address? "Address: " + place.address  : ""}
                                  
                </Typography>
              
              
                <Typography variant="body2" color="textSecondary" className='spacing' height={2}>
                  {place.phone? "Contact: " + place.phone : ""}
                  {/* {place.phone? place.phone : ""} */}
                </Typography>
                <Typography variant="body2" color="textSecondary" className='spacing' marginTop={3} height={2}>
                  
                  {place?.subcategory?.map(({ name })  => (
                    <Chip key = {name} size = "small" label ={name} className= "chip" />
                  ))};
                 
                </Typography>
              
              </Card.Text>
              
              <Button className={styles.btn} variant="primary" 
                onClick = {() => window.open(place.web_url,'_blank')}>
                Open Trip Advisor

              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
            
            </Card.Body>
            </div>

    </>
  )
  }
}

export default Details