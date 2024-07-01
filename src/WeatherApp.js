import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Weather.css';

// Fix the marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const WeatherApp = ({ addFavorite, currentUser }) => {
    const [location, setLocation] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [weeklyForecast, setWeeklyForecast] = useState([]);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London
    const [favorites, setFavorites] = useState([]); // State to store favorite days
    const apiKey = '488a32ab226ea5867be5d50d221198ed';

    useEffect(() => {
        // Load favorites from localStorage if available
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    useEffect(() => {
        // Save favorites to localStorage whenever favorites change
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const handleSearch = async () => {
        if (location.trim() !== '') {
            try {
                const [currentData, hourlyData, weeklyData] = await Promise.all([
                    fetchCurrentWeather(location),
                    fetchHourlyForecast(location),
                    fetchWeeklyForecast(location)
                ]);
                setCurrentWeather(currentData);
                setHourlyForecast(hourlyData);
                setWeeklyForecast(weeklyData);
                setMapCenter([currentData.coord.lat, currentData.coord.lon]);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Invalid city name. Please try again.');
            }
        } else {
            alert('Please enter a location');
        }
    };

    const fetchCurrentWeather = async (location) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
            if (!response.ok) {
                throw new Error('Failed to fetch current weather');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    const fetchHourlyForecast = async (location) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
            if (!response.ok) {
                throw new Error('Failed to fetch hourly forecast');
            }
            const data = await response.json();
            // Filter hourly data for the next 24 hours
            const hourlyData = data.list.filter(item => {
                const date = new Date(item.dt * 1000);
                const now = new Date();
                return date > now && date < new Date(now.getTime() + 24 * 60 * 60 * 1000);
            });
            return hourlyData;
        } catch (error) {
            throw error;
        }
    };

    const fetchWeeklyForecast = async (location) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
            if (!response.ok) {
                throw new Error('Failed to fetch weekly forecast');
            }
            const data = await response.json();

            // Initialize an object to store daily forecasts
            const dailyData = {};

            // Loop through the forecast list and group by day
            data.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                
                // Check if this day already exists in dailyData
                if (!dailyData[day]) {
                    dailyData[day] = {
                        dt: item.dt,
                        main: item.main,
                        weather: [item.weather[0]],
                        wind: item.wind,
                        city: data.city.name // Store city for the day
                    };
                }
            });

            // Convert dailyData object to an array of daily forecasts
            const weeklyData = Object.values(dailyData);

            return weeklyData;
        } catch (error) {
            throw error;
        }
    };

    const addToFavorites = (day) => {
        // Check if user is logged in
        if (!currentUser) {
            alert('Please log in to add favorites.');
            return;
        }
    
        // Check if the day is already in favorites
        const alreadyAdded = favorites.some(fav => fav.dt === day.dt && fav.city === day.city );
    
        if (alreadyAdded) {
            alert('This day is already in favorites.');
        } else {
            // Find the matching weekly forecast item
            const selectedDay = weeklyForecast.find(item => item.dt === day.dt && item.city === day.city);
    
            if (selectedDay) {
                // Add the day to favorites
                setFavorites(prevFavorites => [
                    ...prevFavorites,
                    {
                        dt: day.dt,
                        day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
                        city: day.city,
                        temp: selectedDay.main.temp // Include temperature
                    }
                ]);
            }
        }
    };
    
    
    

    const renderHourlyForecast = () => {
        return (
            <div className="forecast-section">
                <h3>Today's Hourly Forecast</h3>
                <div className="forecast-container">
                    {hourlyForecast.map(item => (
                        <div className="hourly-item" key={item.dt}>
                            <p>Time: {new Date(item.dt * 1000).toLocaleTimeString()}</p>
                            <p>Temperature: {item.main.temp}°C</p>
                            <p>Weather: {item.weather[0].description}</p>
                            <p>Wind Speed: {item.wind.speed} m/s</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWeeklyForecast = () => {
        return (
            <div className="forecast-section">
                <h3>Weekly Forecast</h3>
                <div className="forecast-container">
                    {weeklyForecast.map(item => (
                        <div className="daily-forecast" key={item.dt}>
                            <p>{new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                            <p>Temperature: {item.main.temp}°C</p>
                            <div className="details">
                                <p>Weather: {item.weather[0].description}</p>
                                <p>Wind Speed: {item.wind.speed} m/s</p>
                                {currentUser && (
                                    <React.Fragment>
                                        <button onClick={() => addToFavorites({ dt: item.dt, city: item.city })}>
                                            Add to Favorites
                                        </button>
                                        {favorites.some(fav => fav.dt === item.dt && fav.city === item.city) && (
                                            <p className="already-added">Already added to favorites</p>
                                        )}
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    
    

    const renderCurrentWeather = () => {
        if (currentWeather) {
            return (
                <div id="currentWeather">
                    <div className="weather-row">
                        <div className="weather-details">
                            <h3>Current Weather</h3>
                            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                            <p>Temperature: {currentWeather.main.temp}°C</p>
                            <p>Weather: {currentWeather.weather[0].description}</p>
                            <p>Wind Speed: {currentWeather.wind.speed} m/s</p>
                            {currentUser && (
                                <button onClick={() => addToFavorites(new Date())}>
                                    Add to Favorites
                                </button>
                            )}
                        </div>
                        <div className="favorites">
                            <h3>Favorites</h3>
                            {currentUser ? (
                                <ul>
                                    {favorites.length > 0 ? (
                                        favorites.map(fav => (
                                            <li key={fav.dt}>
                                                <p>{fav.day} - {fav.city}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <p>No favorites added yet.</p>
                                    )}
                                </ul>
                            ) : (
                                <p>Please log in to add favorites.</p>
                            )}
                        </div>
                    </div>
                    <div className="weather-map">
                        <img src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`} alt={currentWeather.weather[0].description} />
                        <MapContainer center={mapCenter} zoom={13} style={{ height: '300px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={mapCenter}>
                                <Popup>{location}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            );
        }
        return null;
    };

    // JavaScript for sliding effect
    useEffect(() => {
        const slideContainer = document.querySelector('.forecast-container');
        let isDown = false;
        let startX;
        let scrollLeft;

        const handleMouseDown = (e) => {
            isDown = true;
            startX = e.pageX - slideContainer.offsetLeft;
            scrollLeft = slideContainer.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDown = false;
        };

        const handleMouseUp = () => {
            isDown = false;
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slideContainer.offsetLeft;
            const walk = (x - startX) * 2; // Adjust speed by changing multiplier
            slideContainer.scrollLeft = scrollLeft - walk;
        };

        slideContainer.addEventListener('mousedown', handleMouseDown);
        slideContainer.addEventListener('mouseleave', handleMouseLeave);
        slideContainer.addEventListener('mouseup', handleMouseUp);
        slideContainer.addEventListener('mousemove', handleMouseMove);

        return () => {
            slideContainer.removeEventListener('mousedown', handleMouseDown);
            slideContainer.removeEventListener('mouseleave', handleMouseLeave);
            slideContainer.removeEventListener('mouseup', handleMouseUp);
            slideContainer.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Empty dependency array ensures this effect runs once

    return (
        <div className="weather-app">
            <main>
                <h2>Weather App</h2>
                <form id="searchForm">
                    <input
                        type="text"
                        id="locationInput"
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button type="button" id="searchBtn" onClick={handleSearch}>Search</button>
                </form>
                {renderCurrentWeather()}
                {renderHourlyForecast()}
                {renderWeeklyForecast()}
            </main>
        </div>
    );
};

export default WeatherApp;



