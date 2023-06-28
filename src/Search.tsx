import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

import { MultiSelect } from "react-multi-select-component";

import { Table } from "./Table";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

type Dog =
  | {
      id?: string;
      img: string;
      name: string;
      age: number;
      zip_code: string;
      breed: string;
    }
  | null;

type Location =
  | {
      zip_code: string;
      latitude: number;
      longitude: number;
      city: string;
      state: string;
      county: string;
    }
  | null;

 

const columns: {accessor:string, label:string}[] = [
  "name",
  "age",
  "zip_code",
  "breed",
  "img",
  "city",
  "county",
  "state",
  "latitude",
  "longitude",
].map((elem) => {
  return { accessor: elem, label: elem.toUpperCase() };
});

const states: {label:string, value:string}[] = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
].map((elem) => {
  return { label: elem, value: elem };
});

const zipCodeOptions: {label:string, value:string}[] = [
  "48333",
  "25275",
  "11962",
  "17089",
  "28451",
  "09189",
  "52630",
  "35574",
  "46814",
  "81047",
  "71725",
  "44222",
  "92013",
  "07099",
  "23435",
  "08020",
  "07641",
  "67218",
  "76855",
  "78013",
  "78368",
  "11555",
  "03233",
  "60001",
  "19009",
].map((elem) => {
  return { label: elem, value: elem };
});

export const Search = () => {
  


  const [rows, setRows]  =  useState<(Dog & Location)[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  
  const [zipCodes, setZipCodes] = useState([]);
  const [logout, setLogout] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);

  const [nextLink, setNextLink] = useState("");
  const [querySubmit, setQuerySubmit] = useState(0);
  const [data, setData] = useState([]);
  const [prevLink, setPrevLink] = useState("");

  const [finalMatch, setFinalMatch] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const [selectedBreed, setSelectedBreed] = useState(null);
  const [selectedZipCode, setSelectedZipCode] = useState([]);
  const [sortPage, setSortPage] = useState(null);
  const [ageMin, setAgeMin] = useState(null);

  const [ageMax, setAgeMax] = useState(null);
  const [dogPagesize, setDogPageSize] = useState(null);
  const [dogFromPage, setDogFromPage] = useState(null);
  const [stateName, setStateName] = useState(null);

  const [city, setCityName] = useState(null);

  const [topLeft, setTopLeft] = useState([null, null]);

  const [bottomRight, setBottomRight] = useState([null, null]);
  const [topRight, setTopRight] = useState([null, null]);
  const [bottomLeft, setBottomLeft] = useState([null, null]);

  const [locationPagesize, setlocationPageSize] = useState(null);
  const [locationFromPage, setlocationFromPage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
   
    if (selectedElements.length > 0) {
      const respo = axios
        .post(
          "   https://frontend-take-home-service.fetch.com/dogs/match",
          JSON.stringify(selectedElements),
          {
            headers: { "Content-Type": "application/json" },

            withCredentials: true,
          }
        )
        .then(function (response) {
          console.log(response.data);
          setFinalMatch(response.data.match);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [selectedElements]);

  useEffect(() => {
    const resp = axios
      .get("https://frontend-take-home-service.fetch.com/dogs/breeds", {
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response.data);
        const tempData = response.data.map((elem:any) => {
          return { value: elem, label: elem };
        });

        console.log(tempData);
        setData(tempData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (logout) {
    axios
        .post("https://frontend-take-home-service.fetch.com/auth/logout", {
          withCredentials: true,
        })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
      navigate("/");
    }
  }, [logout]);

  useEffect(() => {
    if (querySubmit > 0) {
      const locationBodyParam = {};
      if (stateName)
        locationBodyParam["states"] = stateName.map((elem) => elem.value);
      if (city) locationBodyParam["city"] = city;
      if (locationPagesize) locationBodyParam["size"] = locationPagesize;
      if (locationFromPage) locationBodyParam["from"] = locationFromPage;

      const locationApiCall = async () => {
        const response = await axios.post(
          `https://frontend-take-home-service.fetch.com/locations/search`,
          JSON.stringify(locationBodyParam),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const newZips = [
          ...selectedZipCode,
          ...response.data.results.map((elem) => elem.zip_code),
        ];
       

        const locationUrlParams = dogPagesize
          ? `size=${dogPagesize}`
          : ``
              .concat(dogFromPage ? `&from=${dogFromPage}` : ``)
              .concat(
                selectedBreed
                  ? decodeURIComponent(
                      selectedBreed
                        .map((elem) => `&breeds=` + elem.value)
                        .join("")
                    )
                  : ``
              )
              .concat(
                selectedZipCode
                  ? decodeURIComponent(
                      `${selectedZipCode
                        .map((elem) => `&zipCodes=` + elem.value)
                        .join("")}`
                    )
                  : ``
              )
              .concat(ageMin ? `&ageMin=${ageMin}` : ``)
              .concat(ageMax ? `&ageMax=${ageMax}` : ``)
              .concat(
                newZips.length > 0
                  ? decodeURIComponent(
                      `${newZips.map((elem) => `&zipCodes=` + elem).join("")}`
                    )
                  : ``
              );

        
        const url =
          nextLink.length > 0 ? nextLink : `/dogs/search?${locationUrlParams}`;

        const resp = axios
          .get("https://frontend-take-home-service.fetch.com" + url, {
            withCredentials: true,
          })
          .then(function (response) {
    
            if (response.data.next) setNextLink(response.data.next);
            if (response.data.prev) setPrevLink(response.data.prev);
          
            const respo = axios
              .post(
                "https://frontend-take-home-service.fetch.com/dogs",
                JSON.stringify(response.data.resultIds),
                {
                  headers: { "Content-Type": "application/json" },

                  withCredentials: true,
                }
              )
              .then(function (response) {
                setRows(
                  response.data.map((elem) => {
                    return {
                      ...elem,
                      ...response.data.find(
                        (location_elem) =>
                          location_elem?.zip_code === elem?.zip_code
                      ),
                    };
                  })
                );

                const resp = axios
                  .post(
                    "https://frontend-take-home-service.fetch.com/locations",
                    JSON.stringify(response.data.map((elem) => elem.zip_code)),
                    {
                      headers: { "Content-Type": "application/json" },

                      withCredentials: true,
                    }
                  )
                  .then(function (location_response) {
                  

                    const result = [];
                    setRows(
                      response.data.map((elem) => {
                        return {
                          ...elem,
                          ...location_response.data.find(
                            (location_elem) =>
                              location_elem?.zip_code === elem?.zip_code
                          ),
                        };
                      })
                    );
                  });
              });
          });
      };

      if (Object.keys(locationBodyParam).length !== 0) {
        locationApiCall();
      } else {
        const dogUrlParams = (dogPagesize ? `size=${dogPagesize}` : ``)
          .concat(dogFromPage ? `&from=${dogFromPage}` : ``)
          .concat(
            selectedBreed
              ? decodeURIComponent(
                  selectedBreed.map((elem) => `&breeds=` + elem.value).join("")
                )
              : ``
          )
          .concat(
            selectedZipCode
              ? decodeURIComponent(
                  `${selectedZipCode
                    .map((elem) => `&zipCodes=` + elem.value)
                    .join("")}`
                )
              : ``
          )
          .concat(ageMin ? `&ageMin=${ageMin}` : ``)
          .concat(ageMax ? `&ageMax=${ageMax}` : ``);

        const url =
          nextLink.length > 0 ? nextLink : `/dogs/search?${dogUrlParams}`;
      

        const resp = axios
          .get("https://frontend-take-home-service.fetch.com" + url, {
            withCredentials: true,
          })
          .then(function (response) {
          
            if (response.data.next) setNextLink(response.data.next);
            if (response.data.prev) setPrevLink(response.data.prev);
  
            const respo = axios
              .post(
                "https://frontend-take-home-service.fetch.com/dogs",
                JSON.stringify(response.data.resultIds),
                {
                  headers: { "Content-Type": "application/json" },

                  withCredentials: true,
                }
              )
              .then(function (response) {
                const resp = axios
                  .post(
                    "https://frontend-take-home-service.fetch.com/locations",
                    JSON.stringify(response.data.map((elem) => elem.zip_code)),
                    {
                      headers: { "Content-Type": "application/json" },

                      withCredentials: true,
                    }
                  )
                  .then(function (location_response) {
               

                    const result = [];
                    setRows(
                      response.data.map((elem) => {
                        return {
                          ...elem,
                          ...location_response.data.find(
                            (location_elem) =>
                              location_elem?.zip_code === elem?.zip_code
                          ),
                        };
                      })
                    );
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }, [querySubmit, pageNumber]);

  const getSelectedElements = (elements) => {
    setSelectedElements(elements);
  };

  const latLongHTML = (stateChangeFunction, stateName) => (
    <>
      {["Latitude", "Longitude"].map((elem, index) => (
        <div className="htmlForm-group">
          <label htmlFor="latText" className="control-label">
            {elem}
          </label>
          <input
            onChange={(e) => {
              if (index == 0)
                stateChangeFunction([e.target.value, stateName[1]]);
              else {
                stateChangeFunction([stateName[0], e.target.value]);
              }
            }}
            style={{ width: "50%" }}
            type="text"
            className="htmlForm-control"
            id="latText"
            name="lat"
            data-geo="lat"
          />
        </div>
      ))}
    </>
  );

 
  return (
    <div>
      <button
        style={{ float: "right" }}
        onClick={() => {
          setLogout(true);
        }}
      >
        Logout
      </button>
      <h3>Search Dogs</h3>

      <div style={{ display: "grid" }}>
        Select Breed
        <Select
          closeMenuOnSelect={false}
          onChange={setSelectedBreed}
          isMulti
          options={data}
        />
        <br></br>
        Select Zip Code
        <MultiSelect
          options={zipCodeOptions}
          value={selectedZipCode}
          onChange={setSelectedZipCode}
          labelledBy={"Select"}
          isCreatable={true}
        />
        <br></br>
        Age Min
        <input
          type="text"
          name="Age Min"
          onChange={(e) => setAgeMin(e.target.value)}
        />
        <br></br>
        Age Max
        <input
          type="text"
          name="Age Max"
          onChange={(e) => setAgeMax(e.target.value)}
        />
        <br></br>
        Page Size
        <input
          type="text"
          name="Size"
          onChange={(e) => setDogPageSize(e.target.value)}
        />
        <br></br>
        From Page
        <input
          type="text"
          name="From"
          onChange={(e) => setDogFromPage(e.target.value)}
        />
        <br></br>
        State
        <Select isMulti onChange={setStateName} options={states} />
        {/* Sort
<Select
      closeMenuOnSelect={true}
      onChange={setSortPage}  
      options ={sortOptions}
    /> */}
    <br></br>
        <label htmlFor="city_id" className="control-label">
          City
        </label>
        <input
          onChange={(e) => setCityName(e.target.value)}
          type="text"
          className="htmlForm-control"
          id="city_id"
          name="city"
          placeholder="City name"
          data-geo="locality"
        />
      </div>

      {/* <div className="row">
          <div className="col">
          <b> Top Left:</b>
{latLongHTML(setTopLeft, topLeft)}
<b> Top Right:</b>

{latLongHTML(setBottomRight, bottomRight)}
<b> Bottom Left:</b>

{latLongHTML(setTopRight, topRight)}

<b>Bottom Right:</b>

{latLongHTML(setBottomLeft, bottomLeft)}

          </div>
<b>
         Location Size:</b>
        <input 
          onChange={(e) =>
           setlocationPageSize(e.target.value)
             }
        
        type="text" name ="Size"/>
        <b>  Location From Page:</b>
        <input
           onChange={(e) =>
            setlocationFromPage(e.target.value)
              }
        type="text" name ="From"/>

          <div className="col">
          
          </div>
        </div> */}

      <br></br>
      <button
        onClick={() => {
          setFinalMatch("");
          setNextLink("");
          setQuerySubmit(querySubmit + 1);
        }}
      >
        Find Dogs
      </button>

      <div>
        <br />

        <div style={{ display: "flex" }}>
          {prevLink && (
            <button onClick={() => setPageNumber(pageNumber - 1)}>
              Previous Page
            </button>
          )}

          {nextLink && (
            <button
              style={{ float: "right" }}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next Page
            </button>
          )}
        </div>

        <Table
          rows={rows}
          columns={columns}
          selectedElementsArray={setSelectedElements}
        />
      </div>

      <br />

      <h3>{finalMatch && `Your final Match Dog id : ${finalMatch}`}</h3>
    </div>
  );
};
