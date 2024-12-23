import { Link } from "react-router-dom";
import "./HomeCard.css";

const HomeCard = ({ id, heading, date = {}, location, description,img }) => {
  const { year, month } = date; 

  return (
    <Link>
      <div className="card">
        <div className="card-content">
          <h3>{heading}</h3>
          <p>
            <span className="underline">Date: {date || 'N/A'}</span> 
            
          </p>
          <p>{location}</p>
          <p className="mx-14 underline">About Event: </p> 
           <p> {description}</p>
        </div>

        <div className="card-img-wrapper">
          <img src={img} alt="image not found" />
        </div>
      </div>
    </Link>
  );
};

export default HomeCard;
