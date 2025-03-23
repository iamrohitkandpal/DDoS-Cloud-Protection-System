# 🛡️ DDoS Protection System for Indian Government Websites

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.0.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-43853D?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.x-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?logo=redis)](https://redis.io/)

## 📑 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Advanced Features](#advanced-features)
- [Future Scope](#future-scope)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## 🔍 Project Overview
The **DDoS Protection System** is a specialized cybersecurity solution designed to safeguard Indian government websites against Distributed Denial of Service (DDoS) attacks. By implementing advanced traffic monitoring and analysis, it identifies and blocks malicious IP addresses in real-time, ensuring continuous availability of critical government web services.

> **Note:** This system is specifically tailored to address the unique cybersecurity challenges faced by Indian government web infrastructure.

## ✨ Features
- 🔐 **Advanced IP Address Monitoring**: Captures, logs, and analyzes IP addresses accessing protected applications
- 🛑 **Real-time DDoS Mitigation**: Blocks IP addresses making suspicious or excessive requests 
- 📊 **Traffic Analysis Dashboard**: Visual representation of traffic patterns and attack metrics
- 🔔 **User Notifications System**: Alerts administrators with customized messages based on threat levels
- 🌐 **Geolocation Tracking**: Identifies attack sources by geographical origin
- 🧠 **Machine Learning Integration**: Pattern recognition for improved threat detection
- ⚡ **High Performance Architecture**: Optimized for minimal impact on protected services

## 🛠️ Technologies Used
### Frontend
![React](https://img.shields.io/badge/React-18.0.0-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Axios](https://img.shields.io/badge/Axios-1.3.4-5A29E4?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-2.5.0-22B5BF?style=for-the-badge)
![Sonner Toast](https://img.shields.io/badge/Sonner_Toast-Latest-FF4500?style=for-the-badge)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-16.x-43853D?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/Express-4.18.x-000000?logo=express&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb&logoColor=white&style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?logo=redis&logoColor=white&style=for-the-badge)

### Cloud Services
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Cloud-13AA52?logo=mongodb&logoColor=white&style=for-the-badge)
![Redis Cloud](https://img.shields.io/badge/Redis_Cloud-Hosting-DC382D?logo=redis&logoColor=white&style=for-the-badge)
![AWS](https://img.shields.io/badge/AWS-Hosting-232F3E?logo=amazon-aws&logoColor=white&style=for-the-badge)

### Development Tools
![Git](https://img.shields.io/badge/Git-Version_Control-F05032?logo=git&logoColor=white&style=for-the-badge)
![Postman](https://img.shields.io/badge/Postman-API_Testing-FF6C37?logo=postman&logoColor=white&style=for-the-badge)

## 🏗️ Architecture
![System Architecture](docs/images/architecture-diagram.png)

The DDoS Protection System employs a multi-layered architecture:

1. **Traffic Ingestion Layer**: Captures and filters incoming requests
2. **Analysis Engine**: Processes traffic data using both rule-based and ML algorithms
3. **Cache Layer**: Redis-powered rate limiting and blacklist management
4. **Persistent Storage**: MongoDB for long-term attack pattern storage and analytics
5. **Administration Dashboard**: React-based interface for monitoring and configuration

> For a detailed architecture explanation, see [Architecture Documentation](docs/architecture.md)

## 🚀 Installation
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
```

### Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Configure environment variables:
   ```
   # Backend .env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ddos-protection
   REDIS_URL=redis://localhost:6379
   LOG_LEVEL=info
   
   # Frontend .env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Start development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev
   
   # Start frontend application
   cd ../frontend
   npm start
   ```

> For detailed installation instructions, see [Installation Guide](docs/installation.md)

## 📘 Usage
Once the system is set up, you can:

1. **Access the Dashboard**: Open `http://localhost:3000` in your browser
2. **Configure Protection Rules**: Set rate limits and sensitivity levels
3. **Monitor Traffic**: View real-time graphs of traffic patterns
4. **Review Blocked IPs**: Check the list of blocked IP addresses
5. **Export Reports**: Generate and download security reports

![Dashboard Screenshot](docs/images/dashboard-screenshot.png)

> For complete usage documentation, see [Usage Guide](docs/usage.md)

## 🔋 Advanced Features
- **API Integration**: Connect with national cybersecurity databases
- **Custom Rule Engine**: Create tailored protection rules
- **Performance Optimization**: Minimal overhead on protected services
- **Distributed Deployment**: Multi-region protection capability

## 🔮 Future Scope
- Integration with CERT-In (Indian Computer Emergency Response Team)
- Enhanced AI-based prediction of attack patterns
- Blockchain-based distributed protection network
- Mobile application for alerts and monitoring
- Collaboration with other government security systems

## Security Considerations

- This project uses environment variables for all sensitive credentials
- NEVER commit your `.env` file to version control
- Use different credentials for development and production environments
- Set up proper access controls for your MongoDB and Redis instances

## Environment Variables

To run this project, you'll need to set up the following environment variables in a `.env` file:

## 👥 Contributing
We welcome contributions to enhance this system. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](docs/contributing.md) for more details.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits
This project was developed with support from:
- Ministry of Electronics & Information Technology (MeitY), Government of India
- National Informatics Centre (NIC)
- Open source community contributors
