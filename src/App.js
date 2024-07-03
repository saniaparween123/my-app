import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherApp from './WeatherApp';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function App() {
    const [location, setLocation] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showWeather, setShowWeather] = useState(true);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [registeredUsers, setRegisteredUsers] = useState(() => {
        const storedUsers = localStorage.getItem('registeredUsers');
        return storedUsers ? JSON.parse(storedUsers) : [];
    });
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }, [currentUser]);

    const handleSearch = () => {
        if (location.trim() !== '') {
            console.log('Location:', location);
            setShowWeather(true);
        } else {
            alert('Please enter a location');
        }
    };

    const toggleLogin = () => {
        setShowLogin(!showLogin);
        setShowRegister(false);
        setShowWeather(false);
        setSubmissionMessage('');
    };

    const toggleRegister = () => {
        setShowRegister(!showRegister);
        setShowLogin(false);
        setShowWeather(false);
        setSubmissionMessage('');
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        const user = registeredUsers.find(user => user.username === username && user.password === password);
        if (user) {
            setCurrentUser({ ...user, favorites: user.favorites || [] });
            setSubmissionMessage('Login successful!');
            setShowWeather(true);
            setShowLogin(false);
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
            setSubmissionMessage('Registration successful!');
            setShowLogin(true);
            setShowRegister(false);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setSubmissionMessage('Logged out successfully.');
        setShowRegister(true); // Show the Register button again
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
                    {currentUser ? (
                        <button id="logoutBtn" onClick={handleLogout}>Logout</button>
                    ) : (
                        <button id="registerBtn" onClick={toggleRegister}>Register</button>
                    )}
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
