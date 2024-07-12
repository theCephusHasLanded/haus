  <title>HAUS - Rent a Room</title>
</head>
<body>
  <h1>HAUS</h1>
  <p>Future housing innovation tech presented by LKHN Research.</p>

  <h1>"Rent a Room" App</h1>

  <p>This is a web application built with React that enables users to rent rooms with easy weekly payments, similar to Airbnb. The application features full CRUD functionality with a robust back-end built using Golang, connected to an SQL database, and using JWT and Redis for user authentication and session tracking.</p>

  <h2>Features</h2>

  <ul>
    <li>User registration and login: Users can create an account and log in to access the rental functionality.</li>
    <li>Room selection: Users can view available rooms and choose the one they want to rent.</li>
    <li>Payment system: Users can make weekly payments using an integrated payment system.</li>
    <li>Session tracking: User sessions are tracked and managed using JWT and Redis.</li>
    <li>Admin dashboard: An admin can view all active user sessions and invalidate tokens to revoke access.</li>
  </ul>

  <h2>Installation</h2>

  <p>To get started with the Rent a Room App, follow the steps below:</p>

  <h3>Prerequisites</h3>

  <ul>
    <li>Node.js: Make sure you have Node.js installed on your machine. You can download it from the official website: <a href="https://nodejs.org">https://nodejs.org</a>.</li>
    <li>Go: Install Go from the official website: <a href="https://golang.org">https://golang.org</a>.</li>
    <li>PostgreSQL: Install PostgreSQL from the official website: <a href="https://www.postgresql.org">https://www.postgresql.org</a>.</li>
    <li>Redis: Install Redis from the official website: <a href="https://redis.io">https://redis.io</a>.</li>
  </ul>

  <h3>Clone the repository</h3>

  <ol>
    <li>Open your terminal or command prompt.</li>
    <li>Clone the repository using the following command:
      <pre><code>git clone https://github.com/your-username/haus.git</code></pre>
      <p>This will create a local copy of the project on your machine.</p>
    </li>
  </ol>

  <h3>Navigate to the project directory</h3>

  <pre><code>cd haus</code></pre>

  <h3>Backend Setup</h3>

  <p>Once inside the project directory, set up the backend:</p>

  <ol>
    <li>Navigate to the backend directory:
      <pre><code>cd backend</code></pre>
    </li>
    <li>Install Go dependencies:
      <pre><code>go mod tidy</code></pre>
    </li>
    <li>Create a .env file in the backend directory with the following content:
      <pre><code>DB_HOST=your-db-host
DB_PORT=your-db-port
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
JWT_SECRET=your-jwt-secret</code></pre>
    </li>
    <li>Run the backend server:
      <pre><code>go run main.go</code></pre>
    </li>
  </ol>

  <h3>Frontend Setup</h3>

  <p>Now, set up the frontend:</p>

  <ol>
    <li>Navigate to the frontend directory:
      <pre><code>cd frontend</code></pre>
    </li>
    <li>Install the project dependencies by running the following command:
      <pre><code>npm install</code></pre>
    </li>
    <li>Create a .env file in the frontend directory with the following content:
      <pre><code>REACT_APP_API_URL=http://localhost:8080</code></pre>
    </li>
    <li>Run the React app:
      <pre><code>npm start</code></pre>
    </li>
  </ol>

  <h3>Configuration</h3>

  <p>Ensure you have configured your database and Redis properly. The backend will connect to these services using the environment variables specified in the .env file.</p>

  <p>That's it! You have successfully installed and configured the Rent a Room App on your machine. Now you can proceed to the next section to learn how to use the app.</p>

  <h2>Getting Started with Create React App</h2>

  <p>This project was bootstrapped with <a href="https://github.com/facebook/create-react-app">Create React App</a>.</p>

  <h3>Available Scripts</h3>

  <p>In the project directory, you can run:</p>

  <h4><code>npm start</code></h4>
  <p>Runs the app in the development mode.<br>
  Open <a href="http://localhost:3000">http://localhost:3000</a> to view it in your browser.<br>
  The page will reload when you make changes.<br>
  You may also see any lint errors in the console.</p>

  <h4><code>npm test</code></h4>
  <p>Launches the test runner in the interactive watch mode.<br>
  See the section about <a href="https://facebook.github.io/create-react-app/docs/running-tests">running tests</a> for more information.</p>

  <h4><code>npm run build</code></h4>
  <p>Builds the app for production to the <code>build</code> folder.<br>
  It correctly bundles React in production mode and optimizes the build for the best performance.<br>
  The build is minified and the filenames include the hashes.<br>
  Your app is ready to be deployed!<br>
  See the section about <a href="https://facebook.github.io/create-react-app/docs/deployment">deployment</a> for more information.</p>

  <h4><code>npm run eject</code></h4>
  <p><strong>Note: this is a one-way operation. Once you <code>eject</code>, you can't go back!</strong><br>
  If you aren't satisfied with the build tool and configuration choices, you can <code>eject</code> at any time. This command will remove the single build dependency from your project.<br>
  Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except <code>eject</code> will still work, but they will point to the copied scripts so you can tweak them. At this point, you're on your own.<br>
  You don't have to ever use <code>eject</code>. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.</p>

  <h3>Learn More</h3>

  <p>You can learn more in the <a href="https://facebook.github.io/create-react-app/docs/getting-started">Create React App documentation</a>.<br>
  To learn React, check out the <a href="https://reactjs.org/">React documentation</a>.</p>

  <h3>Code Splitting</h3>
  <p>This section has moved here: <a href="https://facebook.github.io/create-react-app/docs/code-splitting">https://facebook.github.io/create-react-app/docs/code-splitting</a></p>

  <h3>Analyzing the Bundle Size</h3>
  <p>This section has moved here: <a href="https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size">https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size</a></p>

  <h3>Making a Progressive Web App</h3>
  <p>This section has moved here: <a href="https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app">https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app</a></p>

  <h3>Advanced Configuration</h3>
  <p>This section has moved here: <a href="https://facebook.github.io/create-react-app/docs/advanced-configuration">https://facebook.github.io/create-react-app/docs/advanced-configuration</a></p>

  <h3>Deployment</h3>
  <p>This section has moved here: <a href="https://facebook.github.io/create-react-app/docs/deployment">https://facebook.github.io/create-react-app/docs/deployment</a></p>

  <h3><code>npm run build</code> fails to minify</h3>
  <p>This section has moved here: <a href="https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify">https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify</a></p>
</body>
</html>
