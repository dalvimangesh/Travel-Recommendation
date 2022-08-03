import React,{ useState } from 'react'

// import useStyles from './style';
import data from "./Cities.json"

const Header = ({ searched,setSearched }) => {

  const [word,setWord] = useState("");
  const [filteredData,setFilteredData] = useState([]);

  const PlaceChanged = ()=> {
    //console.log("submitttt");
    setSearched(word);

    //console.log(word,"searchingggg");
    setFilteredData([]);
    
  }

  const handleEvent =(e) => {
    
    const searching = e.target.value;
    // //console.log(searching,"searchingggg");
    setWord(searching);
    // //console.log(word)
    const filterData = data.filter((value) => {
      // //console.log(value)
      return value.city.toLowerCase().includes(searching.toLowerCase());
    });

    if(searching === ""){
      setFilteredData([]);
    } else
    {
      setFilteredData(filterData);
    }

  }

  return (
  
    <>
    <nav className="navbar navbar-expand-lg bg-light">
    <div className="container-fluid">
    <a className="navbar-brand" href="#">Tourist Attractions</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Link</a>
        </li>        
      </ul>
    </div>
    </div>
    </nav>
    <div>   
    
      <form className="form" role="search">
 
          <div className="input-group mb-3">
          
           <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleEvent} value = {word} />
      
          <div className="input-group-append">      
        <button className="btn btn-outline-success" type="button" onClick = {PlaceChanged}>Search</button>
        </div>
        </div>
      </form> 
            <div className="dataResult">
            {filteredData.slice(0, 10).map((value, ind) => {
              return (
                <div className = 'dataItem' >
                  <p key = {ind} >{value.city} </p>
                </div>
              );
            })}
            </div>       
   
    </div>

    </>
  )
}

export default Header