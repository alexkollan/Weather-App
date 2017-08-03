const geoCodingAPIKey = 'AIzaSyC89vZacLzYOG4xGOt1ujzc4MhkDq9V4jo';
const reverseGeocodingAPI = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=';
const weatherApiKEY2 = "0da836bc8e23ae08584f8226d080b1dd";
const currentWeatherAPI2 = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";
const clearimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256167/sunny_iyyhjn.jpg';
const clearnightimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256166/calm-night_dycrwx.jpg';
const rainimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256167/thunderstorm_o9q6ed.jpg';
const partcloudimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256647/sky-1365325_1920_xlxedp.jpg';
const partcloudnightimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256703/moon-1833172_1920_bhbhkj.jpg';
const cloudimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256933/storm-clouds-426271_1920_ze8kvp.jpg';
const sleetimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501257061/hailstones-on-window-pane-1354038_1920_delqdr.jpg';
const windimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501256168/windy_tt4ypx.jpg';
const snowimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501257195/snowflake-554635_1920_l7ymyp.jpg';
const fogimg = 'https://res.cloudinary.com/dtmkqsnpm/image/upload/v1501257293/foggy-2091573_1920_qdv2j9.jpg';

$(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos, err);
        console.log('Navigator is available!');
    } else {
        console.log('Geolocation is not supported by this browser.');
    }

    function pos(position) {
        console.log('Location Aquired.');
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        getWeather(position.coords.latitude, position.coords.longitude);
        getCityName(position.coords.latitude, position.coords.longitude);
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


$('#searchbtn').on('click', function() {
    let cityName = $('#inputf').val();
    $.ajax({
        url: reverseGeocodingAPI + cityName + '&key=' + geoCodingAPIKey,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let data1 = JSON.stringify(data);
            console.log(data.results[0].geometry.location.lat);
            console.log(data.results[0].geometry.location.lng);
            let lat = data.results[0].geometry.location.lat;
            let lon = data.results[0].geometry.location.lng;
            getWeather(lat, lon);
            getCityName(lat, lon);
        }
    })
})


function toCelsius(f) {
    return Math.round((f - 32) / 1.8);
}


function toFahrenheit(c) {
    return Math.round((c * 1.8) + 32);
}


var currentMetric = ' °C';


$('#convert').on('click', function() {
    let temptext = $('#temp').text();
    let convTemp;
    let temp = parseInt(temptext.replace(/[^0-9\.]/g, ''));
    switch (currentMetric) {
        case ' °C':
            convTemp = toFahrenheit(temp);
            currentMetric = ' °F';
            break;
        case ' °F':
            convTemp = toCelsius(temp);
            currentMetric = ' °C';
            break;
    }
    $('#temp').html(convTemp + ' ' + currentMetric);
})


function getWeather(lat, lon) {
    console.log('Attempting to call the Dark Sky API...');
    $.ajax({
        url: currentWeatherAPI2 + weatherApiKEY2 + '/' + lat + ',' + lon,
        method: 'GET',
        dataType: 'json',
        mode: 'no-cors',
        success: function(data) {
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
            updateValues(cw[1], toCelsius(cw[2]), cw[3], cw[4], cw[5], cw[6]);
        }
    })
}


function updateValues(s, t, p, h, i, w) {
    let b;
    console.log('Updating values...');
    loadIcons(i);
    $('#weatherStatus').html(s);
    $('#temp').html(t + ' °C');
    $('#pressure').html(p + ' hPa');
    $('#humidity').html(h + '%');
    switch (true) {
        case w >= 0 && w <= 0.3:
            b = 0;
            break;
        case w >= 0.4 && w <= 1.5:
            b = 1;
            break;
        case w >= 1.6 && w <= 3.3:
            b = 2;
            break;
        case w >= 3.4 && w <= 5.5:
            b = 3;
            break;
        case w >= 5.6 && w <= 7.9:
            b = 4;
            break;
        case w >= 8 && w <= 10.7:
            b = 5;
            break;
        case w >= 10.8 && w <= 13.8:
            b = 6;
            break;
        case w >= 13.9 && w <= 17.1:
            b = 7;
            break;
        case w >= 17.2 && w <= 20.7:
            b = 8;
            break;
        case w >= 20.8 && w <= 24.4:
            b = 9;
            break;
        case w >= 24.5 && w <= 28.4:
            b = 10;
            break;
        case w >= 28.5 && w <= 32.6:
            b = 11;
            break;
        default:
            b = 12;
            break;
    }


    $('#wind').html(b);


    var background;


    switch (i) {
        case "clear-day":
            background = clearimg;
            break;
        case "partly-cloudy-day":
            background = partcloudimg;

            break;
        case "clear-night":
            background = clearnightimg;
            break;
        case "partly-cloudy-night":
            background = partcloudnightimg;
            break;
        case "cloudy":
            background = cloudimg;
            break;
        case "rain":
            background = rainimg;
            break;
        case "sleet":
            background = sleetimg;
            break;
        case "snow":
            background = snowimg;
            break;
        case "wind":
            background = windimg;
            break;
        case "fog":
            background = fogimg;
            break;

        default:
            break;
    }


    $('body').css({
        'background': 'url(' + background + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
    });


    console.log('Update succesful.');
}


function loadIcons(i) {
    console.log('Loading Dark Sky Icons');

    list = [
        "clear-day", "clear-night", "partly-cloudy-day",
        "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
        "fog"
    ];

    var icons = new Skycons({
        "color": 'black'
    });
    icons.set("iconz", i);
    icons.play();
}


function getCityName(lat, lng) {
    var res;
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=false",
        success: function(data) {
            res = [data.results[0].address_components[3].long_name];
            $('#geocode').html(res[0]);
        },
        error: function() {
            console.log('error');
        }
    });
}