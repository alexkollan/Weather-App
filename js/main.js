const geoCodingAPIKey = 'AIzaSyC89vZacLzYOG4xGOt1ujzc4MhkDq9V4jo';
const reverseGeocodingAPI = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const weatherApiKEY = "22e1275124fe1f69deb85fd3eec13269";
const weatherApiKEY2 = "0da836bc8e23ae08584f8226d080b1dd";
const currentWeatherAPI2 = "https://crossorigin.me/https://api.darksky.net/forecast/";
const currentWeatherAPI = 'http://api.openweathermap.org/data/2.5/weather?lat=';
const currentWeatherApiByName = 'http://api.openweathermap.org/data/2.5/weather?q=';
const weatherOptions = '&units=metric&appid=';
const weatherIcon = 'http://openweathermap.org/img/w/'
const clearimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256167/sunny_iyyhjn.jpg';
const clearnightimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256166/calm-night_dycrwx.jpg';
const rainimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256167/thunderstorm_o9q6ed.jpg';
const partcloudimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256647/sky-1365325_1920_xlxedp.jpg';
const partcloudnightimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256703/moon-1833172_1920_bhbhkj.jpg';
const cloudimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256933/storm-clouds-426271_1920_ze8kvp.jpg';
const sleetimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501257061/hailstones-on-window-pane-1354038_1920_delqdr.jpg';
const windimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256168/windy_tt4ypx.jpg';
const snowimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501257195/snowflake-554635_1920_l7ymyp.jpg';
const fogimg = 'http://res.cloudinary.com/dtmkqsnpm/image/upload/v1501257293/foggy-2091573_1920_qdv2j9.jpg';

$(function () {
    // getLocationAndWeather();

    getLocation();

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos, err);
            console.log('Navigator is available!');

        } else {
            console.log('Geolocation is not supported by this browser.');

        }
    }

    function pos(position) {
        console.log('Location Aquired.');
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        getWeather(position.coords.latitude, position.coords.longitude);

    }

    function err(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log('User denied the request for Geolocation.');
                break;
            case error.POSITION_UNAVAILABLE:
                console.log('Location information is unavailable.');
                break;
            case error.TIMEOUT:
                console.log('The request to get user location timed out.');
                break;
            case error.UNKNOWN_ERROR:
                console.log('An unknown error occurred.');
                break;
        }
    };
})


$('#searchbtn').on('click', function () {
    let cityName = $('#inputf').val();
    $.ajax({
        url: reverseGeocodingAPI + cityName + '&key=' + geoCodingAPIKey,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let data1 = JSON.stringify(data);

            console.log(data.results[0].geometry.location.lat);
            console.log(data.results[0].geometry.location.lng);
            let lat = data.results[0].geometry.location.lat;
            let lon = data.results[0].geometry.location.lng;
            getWeather(lat, lon);
        }
    })
})


function toCelsius(f) {
    return Math.round((f - 32) / 1.8);
}

function toFahrenheit(c) {
    return Math.round((c * 1.8) + 32);
}
var currentMetric = 'c';

$('#convert').on('click', function () {
    let temptext = $('#temp').text();
    let convTemp;
    let temp = parseInt(temptext.replace(/[^0-9\.]/g, ''));
    switch (currentMetric) {
        case 'c':
            convTemp = toFahrenheit(temp);
            $('#temp').html('Temperature: ' + convTemp + ' Fahrenheit');
            currentMetric = 'f';
            break;

        case 'f':
            convTemp = toCelsius(temp);
            $('#temp').html('Temperature: ' + convTemp + ' Celsius');
            currentMetric = 'c';
            break;
    }
})

function loadIcon() {
    console.log('Loading Dark Sky Icons');
    var icons = new Skycons(),
        list = [
            "clear-day", "clear-night", "partly-cloudy-day",
            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
            "fog"
        ],
        i;
    for (i = list.length; i--;)
        icons.set(list[i], list[i]);
    icons.play();
    console.log('Icon load successful');
}

function getWeather(lat, lon) {
    console.log('Attempting to call the Dark Sky API...');
    $.ajax({
        url: currentWeatherAPI2 + weatherApiKEY2 + '/' + lat + ',' + lon,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            let wicon = data.currently.icon;
            let cityName = data.timezone;
            let cw = [
                cityName, 
                data.currently.summary, 
                data.currently.apparentTemperature, 
                data.currently.pressure, 
                Math.round(data.currently.humidity * 100), 
                data.currently.icon, 
                data.currently.windSpeed
            ];
            console.log('Call succesful.');
            updateValues(cw[0], cw[1], toCelsius(cw[2]), cw[3], cw[4], cw[5], cw[6]);
        }
    })

}

function updateValues(n, s, t, p, h, i, w) {
    let b;
    console.log('Updating values...');
    $('#geocode').html(n.replace(/(.*)\//g, ''));
    // let wiconID = i + '.png';
    // $('#wicon').attr('src', weatherIcon + wiconID);
    $('#weatherStatus').html('Weather: ' + s);
    $('#temp').html('Temperature: ' + t + ' Celcius');
    $('#pressure').html('Pressure: ' + p + ' Hectopascals');
    $('#humidity').html('Humidity: ' + h + '%');
    // $('#wind').html('Wind: ' + w + ' Beaufort');
    console.log(typeof(w) + w);
    switch (true) {
        case w>=0 && w<=0.3:
        b = 0;
            break;
        case w>=0.4 && w<=1.5:
        b = 1;
            break;
        case w>=1.6 && w<=3.3:
        b = 2;
            break;
        case w>=3.4 && w<=5.5:
        b = 3;
            break;
        case w>=5.6 && w<=7.9:
        b = 4;
            break;
        case w>=8 && w<=10.7:
        b = 5;
            break;
        case w>=10.8 && w<=13.8:
        b = 6;
            break;
        case w>=13.9 && w<=17.1:
        b = 7;
            break;
        case w>=17.2 && w<=20.7:
        b = 8;
            break;
        case w>=20.8 && w<=24.4:
        b = 9;
            break;
        case w>=24.5 && w<=28.4:
        b = 10;
            break;
        case w>=28.5 && w<=32.6:
        b = 11;
            break;
        default:
        b = 12;
            break;
    }
    $('#wind').html('Wind: ' + b + ' Beaufort');
    $('canvas').attr('id', i);
    switch (i) {
        case "clear-day":
            $('body').css('background', 'url(' + clearimg + ')');
            break;
        case "partly-cloudy-day":
            $('body').css('background', 'url(' + partcloudimg + ')');

            break;
        case "clear-night":
            $('body').css('background', 'url(' + clearnightimg + ')');
            break;
        case "partly-cloudy-night":
            $('body').css('background', 'url(' + partcloudnightimg + ')');
            break;
        case "cloudy":
            $('body').css('background', 'url(' + cloudimg + ')');
            break;
        case "rain":
            $('body').css('background', 'url(' + rainimg + ')');
            break;
        case "sleet":
            $('body').css('background', 'url(' + sleetimg + ')');
            break;
        case "snow":
            $('body').css('background', 'url(' + snowimg + ')');
            break;
        case "wind":
            $('body').css('background', 'url(' + windimg + ')');
            break;
        case "fog":
            $('body').css('background', 'url(' + fogimg + ')');
            break;

        default:
            break;
    }
    loadIcon();
    console.log('Update succesful.');
}