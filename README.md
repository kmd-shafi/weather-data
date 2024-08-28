# Weather Report Generator for Andhra Pradesh Cities: Setup Guide

## Project Setup

1. Clone the Repository
First, clone the project repository from GitHub using HTTPS:
```
git clone https://github.com/kmd-shafi/weather-data.git
```
2. npm install
This will install all dependencies listed in the package.json file, including:
```
npm install
```
3. Environment Setup
Create a .env file in the root directory of the project and add your OpenWeatherMap API key:
APIKEY=your_openweathermap_api_key_here

4. Running the Application
Once setup is complete, run the application using:
```
node index.js
```
## Weather Report Generator
This Node.js project creates a weather report for selected cities in Andhra Pradesh, India. It fetches weather data from the OpenWeatherMap API and generates a PDF report.
Key Features

City selection from Andhra Pradesh using a checkbox prompt
Fetches real-time weather data for selected cities
Generates a PDF report with Individual city weather information
Average temperature and humidity across selected cities
Timestamp of report generation

### 1. City Selection

![City Selection](image.png)
To select the city name enter the space button
To select the next city enter up arrow and down arrow
Click Enter

### 2. PDF Generation
In root directory of the project the report folder save the pdf's
![City Selection](image1.png)

## Demo Video

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/7b46a79f2f8b4ce48d29f32354220315?sid=c6450974-37e7-4e43-a06e-1bf8e718a6f5" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>
