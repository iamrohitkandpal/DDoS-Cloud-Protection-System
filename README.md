# DDoS Protection System

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Advanced Features](#advanced-features)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The **DDoS Protection System** is a web application designed to safeguard against Distributed Denial of Service (DDoS) attacks. By monitoring incoming traffic, it identifies and blocks malicious IP addresses, ensuring the continuous availability of web services. This project utilizes a MERN stack and integrates cloud services for efficient deployment and management.

## Features
- **IP Address Logging**: Captures and logs IP addresses accessing the application.
- **DDoS Mitigation**: Blocks IP addresses making excessive requests within a short timeframe.
- **User Notifications**: Alerts users with customized messages based on their request status.
- **Rich UI with React**: Provides an engaging user interface for better user experience.
- **Cloud Deployment**: Utilizes AWS services for scalable and reliable hosting.
- **Nginx Server Integration**: Enhances performance and load balancing for web traffic.

## Technologies Used
- **Frontend**: React, Axios, Sonner Toast, Recharts
- **Backend**: Node.js, Express, MongoDB, Redis
- **Cloud Services**: Redis Cloud, MongoDB Atlas
- **Development Tools**: Git, Postman

## Installation
To get started with this project, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/iamrohitkandpal/ddos-protection-system.git
cd ddos-protection-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
