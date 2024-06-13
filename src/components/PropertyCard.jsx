import React from "react";

const PropertyCard = ({ property }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">{property["Property Name"]}</h2>
        <p>Price: £{property.Price.toLocaleString()}</p>
        <p>House Type: {property["House Type"]}</p>
        <p>Area: {property["Area in sq ft"]} sq ft</p>
        <p>Bedrooms: {property["No. of Bedrooms"]}</p>
        <p>Bathrooms: {property["No. of Bathrooms"]}</p>
        <p>Receptions: {property["No. of Receptions"]}</p>
        <p>Location: {property.Location}</p>
        <p>City/County: {property["City/County"]}</p>
        <p>Postal Code: {property["Postal Code"]}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
