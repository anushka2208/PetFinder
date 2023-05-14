import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";

const NgoDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState({});

  //initalp details
  useEffect(() => {
    if (params?.slug) getNgo();
  }, [params?.slug]);
  //getProduct
  const getNgo = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/ngo/get-ngo/${params.slug}`
      );
      setNgo(data?.ngo);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/api/v1/ngo/ngo-photo/${ngo._id}`}
            className="card-img-top"
            alt={ngo.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">NGO Details</h1>
          <hr />
          <h6>Name : {ngo.name}</h6>
          <h6>Description : {ngo.description}</h6>
          <h6>
            Phone :{ngo.phone}
          </h6>
          <h6>
            Email :{ngo.email}
          </h6>
        </div>
      </div>
    </Layout>
  );
};

export default NgoDetails;