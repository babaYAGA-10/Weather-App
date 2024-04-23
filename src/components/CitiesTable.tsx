import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface City {
  name: string;
  cou_name_en: string;
  timezone: string;
  lon: number;
  lat: number;
}

const CitiesTable: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    filterCities(value);
  };

  const filterCities = (value: string) => {
    if (!value) {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(
        (city) =>
          city.name.toLowerCase().includes(value.toLowerCase()) ||
          city.cou_name_en.toLowerCase().includes(value.toLowerCase()) ||
          city.timezone.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  const fetchCities = async () => {
    const response = await axios.get(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=name&limit=100`
    );

    console.log(response.data.results);

    const formattedCities = response.data.results.map((record: any) => ({
      name: record.name.substring(1), // Remove leading single quotes
      //   name: record.name, // Remove leading single quotes
      cou_name_en: record.cou_name_en,
      timezone: record.timezone,
      lon: record.coordinates.lon,
      lat: record.coordinates.lat,
    }));

    setCities(formattedCities);
    setFilteredCities(formattedCities);
    setHasMore(response.data.results.length > 0);
  };

  useEffect(() => {
    fetchCities();
  }, [page]);

  const handleCityClick = (city: City) => {
    console.log(city)
    navigate(`/weather/${city.name}`, {state: { lon: city.lon, lat: city.lat} });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        color: "white"
      }}
    >
      <h2>List Of Cities</h2>
      <TextField
        label="Search Cities"
        variant="filled"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3, width: "80%", color: "white", // Set text color to white
        borderRadius: 1, // Set border radius
        backgroundColor: "white", // Set the background color to white
        "& input": {
          backgroundColor: "transparent", // Set input background color to transparent
          color: "black", // Set input text color to white
        },
        "& .MuiInputBase-root": {
          borderRadius: 1, // Set input border radius
          "&:hover": {
            // backgroundColor: "black", // Set input background color on hover
          },
        },}}
      />
      <Card variant="outlined" style={{ width: "80%" }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>
                  City Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>
                  Country
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>
                  Timezone
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>
                  Lon
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>
                  Lat
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCities.map((city, index) => (
                <TableRow key={index}>
                  <TableCell onClick={() => handleCityClick(city)}>
                      {city.name}
                  </TableCell>
                  <TableCell>{city.cou_name_en}</TableCell>
                  <TableCell>{city.timezone}</TableCell>
                  <TableCell>{city.lon}</TableCell>
                  <TableCell>{city.lat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitiesTable;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   TextField,
// } from "@mui/material";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import { Link } from "react-router-dom";

// interface City {
//   name: string;
//   //   country: string;
//   cou_name_en: string;
//   timezone: string;
// }

// const CitiesTable: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [cities, setCities] = useState<City[]>([]);
//   const [filteredCities, setFilteredCities] = useState<City[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setSearchTerm(value);
//   }

//   const fetchCities = async () => {
//     const response = await axios.get(
//       `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=name&limit=100`
//     );

//     console.log(response.data.results);
//     setCities((prevCities) => [
//       ...prevCities,
//       //   ...response.data.records.map((record: any) => record.fields),
//       //   ...response.data.results.map((record: any) => record.fields),

//       ...response.data.results.map((record: any) => ({
//         // name: record.name.replace(/^'/, ""), // Remove leading single quote
//         // name: record.name.replace(/^'+/, ""), // Remove leading single quotes
//         name: record.name.substring(1), // Remove leading single quotes
//         cou_name_en: record.cou_name_en,
//         timezone: record.timezone,
//       })),
//     //   ...response.data.results.map((record: any) => record),
//     ]);
//     // setHasMore(response.data.records.length > 0);
//     setHasMore(response.data.results.length > 0);
//   };

//   useEffect(() => {
//     fetchCities();
//   }, [page]);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         marginTop: "20px",
//       }}
//     >
//       <h2>List Of Cities</h2>
//       <TextField label="Search Cities" value={searchTerm} onChange={handleSearch} sx={{mb: 3, width:  '80%'}} />
//       <Card variant="outlined" style={{ width: "80%" }}>
//         <CardContent>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>City Name</TableCell>
//                 <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Country</TableCell>
//                 <TableCell sx={{ fontWeight: "bold", fontSize: 18 }}>Timezone</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {cities.map((city, index) => (
//                 <TableRow key={index}>
//                   <TableCell>
//                     {/* {city.name} */}
//                     <Link style={{
//                         color: "green", // Change link color
//                         cursor: "pointer", // Show pointer cursor on hover
//                         textDecoration: "none"
//                       }}
//                        to={`/weather/${city.name}`}>{city.name}</Link>
//                     </TableCell>
//                   <TableCell>{city.cou_name_en}</TableCell>
//                   <TableCell>{city.timezone}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
// export default CitiesTable;
