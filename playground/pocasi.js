const print = (message) => {document.getElementById("output").value += `${typeof message === "string" ? message : JSON.stringify(message, null, 2)}`;
};


const getCityCoords = async (cityName) => {
    try
    {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`);

    if(!response.ok) {
        throw new Error('Nepodařilo se najít město');

    }

    const jsonResponse = await response.json();
    const { latitude, longitude } = jsonResponse.results?.[0];

    print(cityName + ': ');
    return { latitude, longitude };
    } catch (e) {
        console.log(e.message);
    }

};

const getForecast = async ({ latitude, longitude }) => {
    try {

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=&minutely_15=&hourly=&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1&language=en&format=json`);

        if(!response.ok) {
            throw new Error(`Nepodařilo se zjistit počasí pro zjištěnou polohu`);

        }

        const jsonResponse = await response.json();

        const max = jsonResponse.daily.temperature_2m_max[0];
        const min = jsonResponse.daily.temperature_2m_min[0];
        // const average = (max + min) / 2;
        print('min: ' + min + ' ' + jsonResponse.daily_units.temperature_2m_max + ', max: ' + max + ' ' + jsonResponse.daily_units.temperature_2m_max);

        //return average;

    } catch (e) {
        print(e.message);
    }
};

///////// proklik vyhledávání
window.document.getElementById("pocasi").addEventListener("click", async() => {

    // promažu output
    document.getElementById("output").value = "";

    const poleMesto = [];

    const splits = document.getElementById("mesto").value.split(/[;,]/);

    for (let i = 0; i < splits.length; i++) {
        poleMesto.push(splits[i]);
    }

    const souradnice = [];

    const allCoordinates = await Promise.all([getCityCoords(poleMesto[0]), getCityCoords(poleMesto[1]), getCityCoords(poleMesto[2])]).then((values) => souradnice.push(values));
    const allForecasts = await Promise.allSettled([getForecast(souradnice[0]), getForecast(souradnice[1]), getForecast(souradnice[2])]);

})

window.document.getElementById("doplnTestMesta").addEventListener("click", async() => {
    document.getElementById("mesto").value = "Brno;Prague;Pardubice";
});

window.document.getElementById("vymazOutput").addEventListener("click", async() => {
    document.getElementById("output").value = "";
});