const axios = require('axios');
const readline = require('readline');
require('dotenv').config()
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const inquirer = require('inquirer');
const indiancities = require('indian-cities-database');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const cities = [];
let totalCities;

function startCityInput() {
  const createPrompt = inquirer.createPromptModule();
  const options = [];

  try {
    const allCities = indiancities.cities;
    const maharashtraCities = allCities.filter(city => city.state === 'Andhra Pradesh');
    maharashtraCities.forEach(city => options.push(city.city));

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
        if (totalCities === 0) {
          console.log("No cities selected. Exiting...");
          rl.close();
        } else {
          fetchWeatherData();
        }
      })
      .catch((error) => {
        console.error("Error in city selection:", error);
        rl.close();
      });
  } catch (error) {
    console.error("Error in startCityInput:", error);
    rl.close();
  }
}

function fetchWeatherData() {
  const promises = cities.map(city => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.APIKEY}&units=metric`;
    return axios.get(api).catch(error => {
      console.error(`Error fetching data for ${city}:`, error.message);
      return null;
    });
  });

  Promise.all(promises)
    .then(responses => {
      let totalTemp = 0;
      let totalHumidity = 0;
      let cityHtml = '';
      let validResponses = 0;

      responses.forEach(response => {
        if (response && response.data) {
          const weatherData = response.data;
          totalTemp += weatherData.main.temp;
          totalHumidity += weatherData.main.humidity;
          validResponses++;
          cityHtml += `
            <tr>
              <td>${weatherData.name}</td>
              <td>${weatherData.main.temp}°C</td>
              <td>${weatherData.weather[0].description}</td>
              <td>${weatherData.main.humidity}%</td>
            </tr>
          `;
        }
      });

      if (validResponses === 0) {
        throw new Error("No valid weather data received");
      }

      const avgTemp = totalTemp / validResponses;
      const avgHumidity = totalHumidity / validResponses;

      return generatePDF(cityHtml, avgTemp, avgHumidity);
    })
    .then(() => {
      console.log("PDF generation completed.");
    })
    .catch(err => {
      console.error("Error in fetchWeatherData:", err.message);
    })
    .finally(() => {
      rl.close();
    });

  console.log('Fetching weather data for:', cities);
}

async function generatePDF(cityHtml, avgTemp, avgHumidity) {
  let browser;
  try {
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
        <p>${formattedDate+"_"+fullTime}</p>

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

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }
    const pdfFilename = `weather_report_${formattedDate+"_"+fullTime}.pdf`;
    const pdfPath = path.join(reportsDir, pdfFilename);
    await page.pdf({ path: pdfPath, format: 'A4' });
    console.log(`PDF saved at: ${pdfPath}`);
  } catch (error) {
    console.error("Error in generatePDF:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

startCityInput();



