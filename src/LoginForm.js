import React from 'react';

function LoginForm({ onSubmit, onBack }) {
    return (
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <button type="submit">Login</button>
            </form>
            <button className="back" onClick={onBack}>Back to Weather App</button>
        </div>
    );
}

export default LoginForm;
