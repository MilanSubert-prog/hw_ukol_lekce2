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
    poleMesto.push(document.getElementById("mesto").value.split(','));
    // console.log(poleMesto);


    const cityCoords = await getCityCoords(mesto);
    await getForecast(cityCoords);

   // print(cityCoords);

})