# Semantic Communication Project

## Overview

Semantic Communication is a web application that focuses on transmitting information in a smarter way. It does this by understanding the meaning of the data being sent and ensuring that noise or interference doesn't compromise the important parts. The application consists of two main parts: the backend and the frontend, both of which work together to provide a seamless and effective communication experience.

## Project Structure

### Backend

The backend is like the brain behind the scenes. It is built using **Flask**, a lightweight Python framework that handles requests, processes data, and manages the core logic of the application.

- **Flask**: Manages all requests from the frontend, processes data, and ensures smooth communication between the user and the server. It takes care of tasks such as data calculations and efficient data storage.
- **API Files**:
  - `app.py`: The core backend application that uses Flask to manage routes and handle the core logic.
  - `requirements.txt`: Lists the Python dependencies required for the backend.
  - `Procfile`: Used for deployment to instruct platforms like Heroku on how to run the server.

### Frontend

The frontend is what the user sees and interacts with. It is developed using **React**, which allows for a modular approach where different parts of the UI are separated into reusable components.

- **React**: Breaks the application into small, reusable pieces called components, which makes development easier and more organized.
- **React Context**: Used for state management. This allows data to be shared easily across different parts of the application without the need for manual prop-passing.
- **Components**: The UI is composed of multiple components:
  - **GaussianNoise.js**: Handles the visualization and effects of noise in the communication process.
  - **Loading.js**: Displays a loading indicator to inform the user when data is being processed.
  - **decoder.js**: Converts noisy data into meaningful information for the user.
  - **ChatHistory/index.jsx**: Manages the history of user interactions to ensure a consistent user experience.

### Styling

To make the app visually appealing and responsive, **Tailwind CSS** is used for styling.
- **Tailwind CSS**: Provides utility-first styling, making it easy to maintain consistency and develop a responsive design without the need for extensive custom CSS.

### Organization

- **Public Folder**: Contains static assets such as `index.html`, icons, and manifest files, which are essential for the setup and branding of the application.
- **Components Folder**: Holds the different UI components that make up the user interface.
- **Context Folder**: Contains `DataProvider.js`, which handles state management using React Context API, making it easy to share data across components.

## Key Features

- **Backend with Flask**: Handles all data requests, processing, and communication between the client and server.
- **Frontend with React**: Provides an interactive and modular interface for users, enhancing their experience.
- **State Management with React Context**: Ensures smooth data flow between different parts of the app.
- **Noise Management**: The project focuses on managing noise in communication to enhance the meaning of transmitted data.

## How to Run the Project

### Prerequisites
- **Node.js** and **npm**: Required for running the frontend.
- **Python** and **pip**: Required for running the backend.
- **Flask**: Install via `pip install -r requirements.txt`.
- **Tailwind CSS**: Already set up in the project; dependencies will be installed during setup.

### Installation Steps
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Semantic_Communication



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
