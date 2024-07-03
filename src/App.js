// import React, { useState } from 'react';
// import './App.css'; // Ensure this path is correct
// import WeatherApp from './WeatherApp';
// import LoginForm from './LoginForm';
// import RegisterForm from './RegisterForm';

// function App() {
//     const [location, setLocation] = useState('');
//     const [showLogin, setShowLogin] = useState(false);
//     const [showRegister, setShowRegister] = useState(false);
//     const [showWeather, setShowWeather] = useState(true); // Initially show weather forecast
//     const [submissionMessage, setSubmissionMessage] = useState(''); // New state variable for submission message
//     const [registeredUsers, setRegisteredUsers] = useState([]); // State for storing registered users
//     const [currentUser, setCurrentUser] = useState(null); // State for storing the current user

//     const handleSearch = () => {
//         if (location.trim() !== '') {
//             console.log('Location:', location);
//             setShowWeather(true); // Show weather forecast section
//             // Optionally, you can perform further actions with the location data
//         } else {
//             alert('Please enter a location');
//         }
//     };

//     const toggleLogin = () => {
//         setShowLogin(!showLogin);
//         setShowRegister(false); // Close register form if open
//         setShowWeather(false); // Hide weather forecast section
//         setSubmissionMessage(''); // Clear submission message
//     };

//     const toggleRegister = () => {
//         setShowRegister(!showRegister);
//         setShowLogin(false); // Close login form if open
//         setShowWeather(false); // Hide weather forecast section
//         setSubmissionMessage(''); // Clear submission message
//     };

//     const handleLoginSubmit = (e) => {
//         e.preventDefault();
//         const username = e.target.username.value;
//         const password = e.target.password.value;

//         const user = registeredUsers.find(user => user.username === username && user.password === password);
//         if (user) {
//             setCurrentUser({ ...user, favorites: user.favorites || [] });
//             setSubmissionMessage('Login successful!'); // Set submission message
//             setShowWeather(true); // Show weather forecast after login
//             setShowLogin(false); // Hide login form after successful login
//         } else {
//             setSubmissionMessage('Invalid username or password');
//         }
//     };

//     const handleRegisterSubmit = (e) => {
//         e.preventDefault();
//         const fullname = e.target.fullname.value;
//         const email = e.target.email.value;
//         const username = e.target.username.value;
//         const password = e.target.password.value;

//         const userExists = registeredUsers.some(user => user.username === username);
//         if (userExists) {
//             setSubmissionMessage('Username already exists');
//         } else {
//             const newUser = { fullname, email, username, password, favorites: [] };
//             setRegisteredUsers([...registeredUsers, newUser]);
//             setSubmissionMessage('Registration successful!'); // Set submission message
//             setShowLogin(true); // Show login form after successful registration
//             setShowRegister(false); // Hide register form after successful registration
//         }
//     };

//     const addFavorite = (location) => {
//         if (currentUser) {
//             const updatedUser = { ...currentUser, favorites: [...currentUser.favorites, location] };
//             setCurrentUser(updatedUser);
//             setRegisteredUsers(registeredUsers.map(user => user.username === currentUser.username ? updatedUser : user));
//             setSubmissionMessage('Favorite added!');
//         } else {
//             setSubmissionMessage('You must be logged in to add favorites.');
//         }
//     };

//     return (
//         <div className="App">
//             <header>
//                 <div className="logo">Weather App</div>
//                 <nav>
//                     <button id="loginBtn" onClick={toggleLogin}>Login</button>
//                     <button id="registerBtn" onClick={toggleRegister}>Register</button>
//                 </nav>
//             </header>
//             <main>
//                 {submissionMessage && <div className="submission-message">{submissionMessage}</div>}
//                 <section id="authSection">
//                     {showWeather && (
//                         <WeatherApp addFavorite={addFavorite} currentUser={currentUser} />
//                     )}
//                     {showLogin && <LoginForm onSubmit={handleLoginSubmit} />}
//                     {showRegister && <RegisterForm onSubmit={handleRegisterSubmit} />}
//                 </section>
//             </main>
//         </div>
//     );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure this path is correct
import WeatherApp from './WeatherApp';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function App() {
    const [location, setLocation] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showWeather, setShowWeather] = useState(true); // Initially show weather forecast
    const [submissionMessage, setSubmissionMessage] = useState(''); // New state variable for submission message
    const [registeredUsers, setRegisteredUsers] = useState(() => {
        const storedUsers = localStorage.getItem('registeredUsers');
        return storedUsers ? JSON.parse(storedUsers) : [];
    }); // State for storing registered users
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    }); // State for storing the current user

    useEffect(() => {
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }, [currentUser]);

    const handleSearch = () => {
        if (location.trim() !== '') {
            console.log('Location:', location);
            setShowWeather(true); // Show weather forecast section
            // Optionally, you can perform further actions with the location data
        } else {
            alert('Please enter a location');
        }
    };

    const toggleLogin = () => {
        setShowLogin(!showLogin);
        setShowRegister(false); // Close register form if open
        setShowWeather(false); // Hide weather forecast section
        setSubmissionMessage(''); // Clear submission message
    };

    const toggleRegister = () => {
        setShowRegister(!showRegister);
        setShowLogin(false); // Close login form if open
        setShowWeather(false); // Hide weather forecast section
        setSubmissionMessage(''); // Clear submission message
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        const user = registeredUsers.find(user => user.username === username && user.password === password);
        if (user) {
            setCurrentUser({ ...user, favorites: user.favorites || [] });
            setSubmissionMessage('Login successful!'); // Set submission message
            setShowWeather(true); // Show weather forecast after login
            setShowLogin(false); // Hide login form after successful login
        } else {
            setSubmissionMessage('Invalid username or password');
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        const fullname = e.target.fullname.value;
        const email = e.target.email.value;
        const username = e.target.username.value;
        const password = e.target.password.value;

        const userExists = registeredUsers.some(user => user.username === username);
        if (userExists) {
            setSubmissionMessage('Username already exists');
        } else {
            const newUser = { fullname, email, username, password, favorites: [] };
            setRegisteredUsers([...registeredUsers, newUser]);
            setSubmissionMessage('Registration successful!'); // Set submission message
            setShowLogin(true); // Show login form after successful registration
            setShowRegister(false); // Hide register form after successful registration
        }
    };

    const addFavorite = (location) => {
        if (currentUser) {
            const updatedUser = { ...currentUser, favorites: [...currentUser.favorites, location] };
            setCurrentUser(updatedUser);
            setRegisteredUsers(registeredUsers.map(user => user.username === currentUser.username ? updatedUser : user));
            setSubmissionMessage('Favorite added!');
        } else {
            setSubmissionMessage('You must be logged in to add favorites.');
        }
    };

    return (
        <div className="App">
            <header>
                <div className="logo">Weather App</div>
                <nav>
                    <button id="loginBtn" onClick={toggleLogin}>Login</button>
                    <button id="registerBtn" onClick={toggleRegister}>Register</button>
                </nav>
            </header>
            <main>
                {submissionMessage && <div className="submission-message">{submissionMessage}</div>}
                <section id="authSection">
                    {showWeather && (
                        <WeatherApp addFavorite={addFavorite} currentUser={currentUser} />
                    )}
                    {showLogin && <LoginForm onSubmit={handleLoginSubmit} />}
                    {showRegister && <RegisterForm onSubmit={handleRegisterSubmit} />}
                </section>
            </main>
        </div>
    );
}

export default App;
