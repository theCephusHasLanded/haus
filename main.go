import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }, []);

    return (
        <div className="App">
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.ID}>{user.Name} ({user.Email})</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
