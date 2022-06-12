const axios = require("axios");

axios
    .get(
        "http://api.openweathermap.org/geo/1.0/direct?q=Ridgewood,NJ,US&limit=1&appid=294e262744e0da66d38e517c095e60eb"
    )
    .then((response) => {
        response.data[0];
        axios
            .get(
                `http://api.openweathermap.org/data/2.5/forecast?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=294e262744e0da66d38e517c095e60eb`
            )
            .then((otherResponse) => {
                console.log(JSON.stringify(otherResponse.data));
            });
    });
