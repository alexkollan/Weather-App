// const geoCodingAPIKey = 'AIzaSyC89vZacLzYOG4xGOt1ujzc4MhkDq9V4jo';
// const reverseGeocodingAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&key=' + geoCodingAPIKey;
const weatherApiKEY = "22e1275124fe1f69deb85fd3eec13269";
const currentWeatherAPI = 'http://api.openweathermap.org/data/2.5/weather?lat=';
const currentWeatherApiByName = 'http://api.openweathermap.org/data/2.5/weather?q=';
const weatherOptions = '&units=metric&appid=';
const weatherIcon = 'http://openweathermap.org/img/w/'


$(function() {
    getLocationAndWeather();
    $('#searchbtn').on('click', function() {
        let cityName = $('input:text').val();
        searchByName(cityName);
        updateValues(geocode, wicon, status, temp, press, hum);

    })
})

function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            var coordinates = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };
            getCurrentWeather(coordinates.latitude, coordinates.longitude);

        });

    } else {
        alert("Your browser does nto support geolocation services. Open the app with another browse, or check your preferences.");
    }
}



function getCurrentWeather(lat, lon) {
    $.ajax({
        url: currentWeatherAPI + lat + '&lon=' + lon + weatherOptions + weatherApiKEY,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            let wicon = data.weather[0].icon;
            let geocode = data.name;
            let status = data.weather[0].main;
            let temp = data.main.temp;
            let press = data.main.pressure;
            let hum = data.main.humidity;
            updateValues(geocode, wicon, status, temp, press, hum);
        }
    })

}

function searchByName(cn) {
    $.ajax({
        url: currentWeatherApiByName + cn + weatherOptions + weatherApiKEY,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            let wicon = data.weather[0].icon;
            let geocode = data.name;
            let status = data.weather[0].main;
            let temp = data.main.temp;
            let press = data.main.pressure;
            let hum = data.main.humidity;
            updateValues(geocode, wicon, status, temp, press, hum);
        }
    })
}


function updateValues(g, i, s, t, p, h) {
    $('#geocode').html(g);
    let wiconID = i + '.png';
    $('#wicon').attr('src', weatherIcon + wiconID);
    $('#weatherStatus').html('Weather: ' + s);
    $('#temp').html('Temperature: ' + t + ' Celcius');
    $('#pressure').html('Pressure: ' + p);
    $('#humidity').html('Humidity: ' + h + '%');

}

function onYouTubeIframeAPIReady() {
    var player;
    player = new YT.Player('fullscreen-bg', {
        videoId: 'MJ9-HmGWw1k', // YouTube Video ID
        width: 560, // Player width (in px)
        height: 316, // Player height (in px)
        playerVars: {
            autoplay: 1, // Auto-play the video on load
            controls: 0, // Show pause/play buttons in player
            showinfo: 0, // Hide the video title
            modestbranding: 1, // Hide the Youtube Logo
            loop: 1, // Run the video in a loop
            fs: 0, // Hide the full screen button
            cc_load_policy: 0, // Hide closed captions
            iv_load_policy: 3, // Hide the Video Annotations
            autohide: 0, // Hide video controls when playing
            playlist: 'MJ9-HmGWw1k'
        },
        events: {
            onReady: function(e) {
                e.target.mute();
            }
        }
    });
}