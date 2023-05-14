import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";

const Ngo = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [total, setTotal] = useState(0);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTotal();
  }, []);

  //get products
  const getAllNgos = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/ngo/ngo-list/${page}`);
      setLoading(false);
      setNgos(data.ngos);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/ngo/ngo-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/ngo/ngo-list/${page}`);
      setLoading(false);
      setNgos([...ngos, ...data?.ngos]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllNgos();
  }, [checked.length, radio.length]);
  return (
    <Layout title={" Petfinder - Ngos "}>
      {/* banner image */}
      <img
        src="/images/banner-image.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-9 ">
          <h1 className="text-center">All Ngos</h1>
          <div className="d-flex flex-wrap">
            {ngos?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`/api/v1/ngo/ngo-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                                        <h5 className="card-title">{p.email}</h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/ngo/${p.slug}`)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {ngos && ngos.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ngo;