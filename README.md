# Weather Report Generator for Andhra Pradesh Cities: Setup Guide

## Project Setup

### 1. Clone the Repository
First, clone the project repository from GitHub using HTTPS:

```bash
git clone https://github.com/[username]/[repository-name].git
cd [repository-name]


# npm install
This will install all dependencies listed in the package.json file, including:
axios
readline
dotenv
fs
puppeteer
path
inquirer

# Environment Setup
Create a .env file in the root directory of the project and add your OpenWeatherMap API key:
APIKEY=your_openweathermap_api_key_here

# Running the Application
Once setup is complete, run the application using:
node [main-file-name].js

# Weather Report Generator for Andhra Pradesh Cities

## Project Overview
This Node.js application generates a weather report for selected cities in Andhra Pradesh, India. It fetches current weather data and creates a PDF report.

## Key Features

### 1. User Input
- Uses 'inquirer' library
- Presents a list of 10 Andhra Pradesh cities
- Allows multiple city selection

### 2. Weather Data Fetching
- Utilizes OpenWeatherMap API
- Uses axios for HTTP requests

### 3. Data Processing
- Calculates average temperature and humidity
- Prepares individual city weather data

### 4. Report Generation
- Creates an HTML template
- Includes a table of city weather data
- Adds a summary section with averages

### 5. PDF Creation
- Uses Puppeteer to convert HTML to PDF
- Saves PDF in a 'reports' directory
- Includes timestamp in filename

### 6. Environment Variables
- Uses dotenv for API key management

### 7. File System Operations
- Creates 'reports' directory if not exists
- Saves PDF reports in this directory

### 8. Error Handling
- Basic error logging for API request failures

### 9. Console Output
- Provides feedback on fetching process
- Indicates location of saved PDF

## Technologies Used
- Node.js
- Axios
- Inquirer
- Puppeteer
- dotenv

## Potential Use Cases
- Local weather monitoring
- Weather reporting for multiple cities
