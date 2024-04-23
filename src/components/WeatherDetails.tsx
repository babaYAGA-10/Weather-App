import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";

const apiKey = "d0b129580945a8c60dac9a2e9f1b6a01";
const forcastKey = "027d6d73a74daf0303c7df17c7241252";

interface WeatherDetailsProps {
  temperature: number;
  description: string;
  humidity: number;
  pressure: number;
  speed: number;
}

interface ForcastDetailsProps {
  temperature: number;
  date: string;
}

const groupedData: {
  [key: string]: { temperatureSum: number; count: number };
} = {};

const WeatherDetails: React.FC = () => {
  const location = useLocation();
  const { cityId } = useParams<{ cityId: string }>();
  const [weather, setWeather] = useState<WeatherDetailsProps | null>(null);
  const [forcast, setForcast] = useState<ForcastDetailsProps[]>([]);
  const [bgGif, setBGGif] = useState<string | undefined>(undefined);

  const fetchWeather = async () => {
    const { state } = location;
    const { lat, lon } = state;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const weatherData: WeatherDetailsProps = {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      speed: response.data.wind.speed,
    };

    setWeather(weatherData);
    setBGGif(getBgGifUrl(response.data.weather[0].main));
  };

  const fetchForcast = async () => {
    const { state } = location;
    const { lat, lon } = state;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    console.log("forcast details");
    console.log(response);

    const forecastData = response.data.list.map((d: any) => ({
      temperature: d.main.temp,
      date: d.dt_txt,
    }));

    setForcast(forecastData);

    forecastData.forEach((item: ForcastDetailsProps) => {
      const dateKey = item.date.split(" ")[0].split("-")[2]; // Extract date from datetime string
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { temperatureSum: 0, count: 0 };
      }
      groupedData[dateKey].temperatureSum += item.temperature;
      groupedData[dateKey].count++;
    });

    // Calculate average temperature and create new array of objects
    const averageTemperatureData = Object.keys(groupedData).map((date) => {
      const averageTemp =
        groupedData[date].temperatureSum / groupedData[date].count;
      return { temperature: averageTemp, date };
    });

    setForcast(averageTemperatureData);

    console.log(forcast);
  };

  const getBgGifUrl = (weatherCondition: string): string => {
    switch (weatherCondition) {
      case "Snow":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif";
      case "Clouds":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif";
      case "Fog":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif";
      case "Rain":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif";
      case "Clear":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif";
      case "Thunderstorm":
        return "https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif";
      default:
        return "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif";
    }
  };

  useEffect(() => {
    fetchWeather();
    fetchForcast();
  }, [cityId]);

  if (!weather) {
    return <div style={{color: "white"}}>Loading...</div>;
  }

  return (
    <Container
      // <Card
      //   maxWidth="sm"
      style={{
        height: "100vh",
        // width: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // flexDirection: "column",
        backgroundColor: "black",
        // marginTop: "30px"
      }}
    >
      <Grid container 
        style={{
            display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        border: ".5px solid white",
        width: 603
        // marginTop: "30px"
        }}
      >
        {/* <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}> */}

        <Grid item>
          <Card
            sx={{
              backgroundImage: `url('${bgGif}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: 600,
              height: 500,
              color: "white",
              bgcolor: "black",
            }}
          >
            <CardHeader
              style={{
                backgroundColor: "black",
              }}
              title={cityId}
            />
            <CardContent
              style={{
                backgroundColor: "black",
              }}
            >
              <Typography variant="body1">{weather.description}</Typography>
              <Typography variant="h2">{weather.temperature}°C</Typography>
              <Typography variant="body2">
                Pressure: {weather.pressure}
              </Typography>
              <Typography variant="body2">
                Humidity: {weather.humidity}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card
            sx={{
              //   backgroundImage: `url('${bgGif}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: 600,
              height: 100,
              color: "white",
              bgcolor: "black",
            }}
          >
            <CardContent
              style={{
                backgroundColor: "black",
              }}
            >
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "42px"
                }}>
                  <Typography variant="subtitle1" component="strong">
                    <strong
                      className="d-block mb-2 mr-5"
                      style={{ marginRight: "10px" }}
                      >
                      Date
                    </strong>
                  </Typography>
                  <Typography variant="subtitle1" component="strong">
                    <strong className="d-block">
                      Temperature
                    </strong>
                  </Typography>
                </div>
              {forcast.map((f, index) => (
                  
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "15px"
                }} key={index}>
                  <Typography variant="subtitle1" component="strong">
                    <strong
                      className="d-block mb-2 mr-5"
                      style={{ marginRight: "10px" }}
                      >
                      {f.date}
                    </strong>
                  </Typography>
                  <Typography variant="subtitle1" component="strong">
                    <strong className="d-block">
                      {f.temperature.toFixed(2)}°
                    </strong>
                  </Typography>
                </div>
              ))}
              </div>

              {/* <Grid container spacing={2} justifyContent="center">
      {forcast.map((f, index) => (
        <Grid item key={index} xs={2} textAlign="center">
          <Typography variant="subtitle1" component="strong">
            <strong className="d-block mb-2 mr-2">{f.date}</strong>
            <strong className="d-block">{f.temperature}°</strong>
          </Typography>
        </Grid>
      ))}
    </Grid> */}

              {/* <Grid container spacing={2} justifyContent="center">
  {forcast.map((f, index) => (
    <Grid item key={index} xs={2} textAlign="center">
      <Typography variant="subtitle1" component="strong">
        <strong className="d-block mb-2 mr-2">{f.date}</strong>
        <strong className="d-block">{f.temperature}°</strong>
      </Typography>
    </Grid>
  ))}
</Grid> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WeatherDetails;

// import React, { useEffect, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import axios from "axios";

// const apiKey = "d0b129580945a8c60dac9a2e9f1b6a01"

// interface WeatherDetailsProps {
//   temperature: number;
//   description: string;
//   humidity: number;
//   pressure: number;
//   speed: number;
// }

// const WeatherDetails: React.FC = () => {
//   const location = useLocation();
//   const { cityId } = useParams<{ cityId: string }>();
//   const [weather, setWeather] = useState<WeatherDetailsProps | null>(null);

//   const fetchWeather = async () => {
//     console.log(location)
//     const { state } = location;
//     console.log(state)

//     const { lat, lon } = state;

//     const response =
//       await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);

//       console.log(response)
//     setWeather({
//       temperature: response.data.main.temp,
//       description: response.data.weather[0].description,
//       humidity: response.data.main.humidity,
//       pressure: response.data.main.pressure,
//       speed: response.data.wind.speed
//     });
//   };

//   useEffect(() => {
//     fetchWeather();
//   }, [cityId]);

//   if (!weather) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Weather Details</h1>
//       <p>Temperature: {weather.temperature}</p>
//       <p>Description: {weather.description}</p>
//       <p>Humidity: {weather.humidity}</p>
//       <p>Pressure: {weather.pressure}</p>
//       <p>Speed: {weather.speed}</p>
//     </div>
//   );
// };

// export default WeatherDetails;
