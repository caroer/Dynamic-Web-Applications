import getWeather from './fetchWeather.js';
window.addEventListener('load', main);


function main() {
    removeEventListener('load', main);
    getWeather().then(WeatherParser).then(CreateWidget);
}

class WeatherAtt {
    constructor(temp, windSpeed, windDir, totCloudCover, weatherSymbolNr){
        this.temperature=temp;
        this.windDir=windDir;
        this.windSpeed=windSpeed;
        this.weatherSymbolNr=weatherSymbolNr;
        this.totCloudCover=totCloudCover;
    }
}


// Creating a weather dictionary where the keys are three different hours for two days.
// The values for the keys are objects of the class WeatherAtt which have the weather information as attributes. 
function WeatherParser(weatherJSON) {
    var tempIdx = 11;     // Temperature [Celsius]
    const windSpeedIdx = 4;    // Wind speed [m/s]
    const windDirIdx = 3;    // Wind direction [degree]
    const cloudCoverIdx = 7;    // Total mean cloud cover [octas] (between 0-8)
    const weatherSymbIdx = 18;    // Weather symbol
    var weatherDict = {};
    var keys = ['06_1','12_1','18_1','06_2','12_2','18_2'];
    
    // The current day is retrieved to allow for later changing the index for the key in the dictionary.
    var currentDay = weatherJSON.timeSeries[0].validTime.slice(8,10);

    var idxOffset = 0;
    for (let index = 0; index < weatherJSON.timeSeries.length; index++) {
        // Improvement: parsing to DateTime object.
        let hour = weatherJSON.timeSeries[index].validTime.slice(11,13);
        let day = weatherJSON.timeSeries[index].validTime.slice(8,10);

        
        if (index > 5){
            tempIdx = 1;
        }

        // The index is changed since the weather data for tomorrow is now processed.
        if (currentDay != day){
            idxOffset = 3;
        }

        // Retrieving the parameters from the JSON object and creating a Weather object.
        var temp = weatherJSON.timeSeries[index].parameters[tempIdx].values[0] + ' &deg;C';
        var windSpeed = weatherJSON.timeSeries[index].parameters[windSpeedIdx].values[0] + ' m/s';
        var windDir = weatherJSON.timeSeries[index].parameters[windDirIdx].values[0];
        var totCloudCover = weatherJSON.timeSeries[index].parameters[cloudCoverIdx].values[0];
        var weatherSymbolNr = weatherJSON.timeSeries[index].parameters[weatherSymbIdx].values[0];

        var weatherObj = new WeatherAtt(temp, windSpeed, windDir, totCloudCover, weatherSymbolNr);

        // The Weather object is added to the correct hour of interest in the dictionary.
        if(hour == '06'){
            weatherDict[keys[0 + idxOffset]] = weatherObj;
        } 
        else if (hour == '12'){
            weatherDict[keys[1 + idxOffset]] = weatherObj;
        } 
        else if (hour == '18') {
            weatherDict[keys[2 + idxOffset]] = weatherObj;
        }
        
        // Making the loop only retrieve the weather for the first 2 days.
        if(weatherDict['18_2'] != undefined){
            break;
        }
    }
    //console.dir(weatherDict['12_2'].temperature);
    return weatherDict;
}


function CreateWidget(weatherDict){
    // Generate js object for relevant div.
    var weatherDiv = document.getElementById('smhiWidget');

    // Creation of table
    var table = CreateTable(weatherDiv);
 
    // Populate table
    var keys = Object.keys(weatherDict);
    var todayWritten = false;
    var tomorrowWritten = false;
    
    for (const key of keys) {
        if(key.charAt(key.length - 1) == '1' && !todayWritten){
            CreateDayHeader('Idag', table)
            todayWritten = true;
            CreateTableHeads(table)
        }
        else if(key.charAt(key.length - 1) == '2' && !tomorrowWritten){
            CreateDayHeader('Imorgon', table)
            tomorrowWritten = true;
            CreateTableHeads(table)
        }

        PopulateTable(weatherDict[key], key, table)
    }
}

function CreateTable(weatherDiv){
    var table = document.createElement('table');
    weatherDiv.appendChild(table);

    return table
}

function CreateDayHeader(headerString, table){
    var day = document.createElement('h3');
    day.innerHTML = headerString;
    table.appendChild(day);
}

function CreateTableHeads(table){
    var headerRow = document.createElement('tr');
    headerRow.id = "tableHeads";
    table.appendChild(headerRow);

    // Creation of table heads
    var tableHeads = ['Tid', 'Temp', 'Vindriktning', 'Vindstyrka', 'Himmel', 'Molnighet'];
    for (var tableHead of tableHeads) {
        var th = document.createElement('th');
        th.innerHTML = tableHead;
        headerRow.appendChild(th);
    }  
}

function PopulateTable(weatherObj, key, table){
    var newRow = document.createElement('tr');
    table.appendChild(newRow);

    var attributes = Object.keys(weatherObj);

    for (let index = -1; index < attributes.length; index++) {
        if (index == -1){
            var newCell = document.createElement('td');
            newCell.innerHTML = key.slice(0,2) + ':00';
            newRow.appendChild(newCell);
        }
        else {
            var newCell = document.createElement('td');
            
            if (attributes[index] == 'windDir'){
                AppendWindArrow(newCell, newRow, weatherObj[attributes[index]])
                continue;
            }
            else if (attributes[index] == 'weatherSymbolNr'){
                AppendWeatherSymbol(newCell, newRow, weatherObj[attributes[index]])
                continue;
            }
            else if (attributes[index] == 'totCloudCover'){
                AppendCloudCoverDesc(newCell, newRow, weatherObj[attributes[index]])
                continue;
            }
            newCell.innerHTML = weatherObj[attributes[index]];
            newRow.appendChild(newCell);
        }
    }
    table.appendChild(newRow);
}

function AppendWindArrow(newCell, newRow, windDir){
    var div = document.createElement('div');
    newCell.appendChild(div);

    var image = document.createElement('img');

    // The relative path changes depending on which html site one is at.
    if (document.URL.slice(-10) == 'index.html'){
        image.src = 'img/windArrow.png';
    }
    else {
        image.src = '../img/windArrow.png';
    }
    
    image.alt = 'Arrow presenting the wind direction.'
    image.width = '60';
    image.height = '60';
    div.appendChild(image);

    div.style.webkitTransform = 'rotate(' + windDir + 'deg)';
    div.style.mozTransform    = 'rotate(' + windDir + 'deg)';
    div.style.msTransform     = 'rotate(' + windDir + 'deg)';
    div.style.oTransform      = 'rotate(' + windDir + 'deg)';
    div.style.transform       = 'rotate(' + windDir + 'deg)';
    newRow.appendChild(newCell);
}

function AppendWeatherSymbol(newCell, newRow, weatherSymbolNr){
    var image = document.createElement('img');

    // The relative path changes depending on which html site one is at.
    if (document.URL.slice(-10) == 'index.html'){
        image.src = 'img/WeatherSymbols/' + weatherSymbolNr.toString() + '.png';
    }
    else {
        image.src = '../img/WeatherSymbols/' + weatherSymbolNr.toString() + '.png';
    }

    image.alt = 'Symbol presenting the weather for the specific hour.'
    image.width = '70';
    image.height = '70';

    newCell.appendChild(image);
    newRow.appendChild(newCell);
}

function AppendCloudCoverDesc(newCell, newRow, totCloudCover){
    var desc;
    switch(totCloudCover) {
        case 0:
            desc = 'Klart, molnfritt'
            break;
        case 1:
            desc = 'Nästan klart, mestadels klart'
            break;
        case 2:
            desc = 'Nästan klart, mestadels klart'
            break;
        case 3:
            desc = 'Halvklart'
            break;
        case 4:
            desc = 'Halvklart'
            break;
        case 5:
            desc = 'Halvklart'
            break;
        case 6:
            desc = 'Nästan mulet'
            break;
        case 7:
            desc = 'Nästan mulet'
            break;
        case 8:
            desc = 'Mulet'
            break;

        default:
            desc = 'Skattning saknas'
    }
    newCell.innerHTML = desc;
    newRow.appendChild(newCell);
}
