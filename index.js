const axios = require('axios');
const readline = require('readline');
require('dotenv').config()
const fs=require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const inquirer = require('inquirer');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const cities = [];
let totalCities;

function startCityInput() {
  const createPrompt = inquirer.createPromptModule();
  const options = ['Adoni', 'Amaravati', 'Anantapur', 'Chandragiri', 'Chittor', 'Guntur', 'Kakinada', 'Tirupati', 'Vijayawada', 'Visakhapatnam'];

  createPrompt([
    {
      type: 'checkbox',
      name: 'selectedOption',
      message: 'Please select an option:',
      choices: options,
    },
  ])
    .then((answers) => {
      cities.push(...answers.selectedOption);
      totalCities = cities.length;
      fetchWeatherData();
    });
}

function fetchWeatherData() {
  const promises=cities.map(city=>{
    const api =
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.APIKEY}&units=metric`;
    return axios.get(api)
  });
  
  Promise.all(promises)
  .then(responses => {
    let totalTemp=0;
    let totalHumidity=0;
    let cityHtml=''

    responses.forEach(response => {
      const weatherData = response.data;
      totalTemp += weatherData.main.temp;
      totalHumidity += weatherData.main.humidity;
      cityHtml +=`
          <tr>
            <td>${weatherData.name}</td>
            <td>${weatherData.main.temp}°C</td>
            <td>${weatherData.weather[0].description}</td>
            <td>${weatherData.main.humidity}%</td>
          </tr>
      `
    });

    const avgTemp=totalTemp/cities.length;
    const avgHumidity=totalHumidity/cities.length

    async function generatePDF(html, filename) {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html);
    
      
      const reportsDir = path.join(__dirname, 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
      }
      const pdfPath = path.join(reportsDir, filename);
      await page.pdf({ path: pdfPath, format: 'A4' });
      await browser.close();
      console.log(`PDF saved at: ${pdfPath}`);
    }


    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const fullTime = date.toLocaleTimeString().toString();


    const htmlContent =`
    <!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background-color: whitesmoke;
        }
        .container {
          max-width: 800px;
          margin: auto;
          padding: 20px;
        }
        h1 {
          color: #333;
          text-align: center;
        }
        p {
          color: #333;
          text-align: center;
        }
        table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
        }
        td{
        text-align: center;
        }
        .summary {
          padding: 10px;
          border-radius: 5px;
        }
        .timestamp {
          text-align: right;
          color: #777;
          font-style: italic;
        }
      </style>
    <title>Document</title>
</head>
<body>
    <div class="container">
        <h1>Weather Report</h1>
        <p>${formattedDate+" "+fullTime}</p>

        <table style="width:100%" class='city'>
          <tr>
            <th>City</th>
            <th>Temperature</th> 
            <th>Description</th>
            <th>Humidity</th>
          </tr>
          ${cityHtml}
        </table>

        <div class="summary">
          <h2>Summary</h2>
          <p>Average Temperature: ${avgTemp.toFixed(2)}°C</p>
          <p>Average Humidity: ${avgHumidity.toFixed(2)}%</p>
        </div>
      </div>
</body>
</html>
    `

    const pdfFilename = `weather_report_${formattedDate+" "+fullTime}.pdf`;
    generatePDF(htmlContent, pdfFilename);

  })
  .catch(err=>{
    console.log("error of fetching data :",err.message);
  })
  .finally(()=>{
    rl.close();
  });
 
  console.log('Fetching weather data for:', cities);
}

startCityInput();






