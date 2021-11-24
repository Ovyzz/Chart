let nameStock = ""
let symbolStock = "";
let filteredList = [];
let stocksList = [];
const initialList = document.getElementById("initialList");
const searchBar = document.getElementById("search");

fetch("https://retoolapi.dev/0EPTHO/top50stocks")
    .then(res => res.json())
    .then(data => {stocksList = data;});

searchBar.addEventListener("keyup", (e) =>{
    const searchString = e.target.value.toLowerCase();
    for (let i = 0; i < stocksList.length - 1; ++i) {
        if (stocksList[i]['Name'].toLowerCase().includes(searchString) || stocksList[i]['Symbol'].toLowerCase().includes(searchString)) {
            filteredList.push(stocksList[i]);
        }
    }
    displayStockList(filteredList)
});

function displayStockList(object) {
    const displayingList = object
        .map((character) => {
            return `
            <li class="character">
                <h2>${character['Name']}</h2>
                <p>Symbol: ${character['Symbol']}</p>
            </li>
        `;
        })
        .join('');
    initialList.innerHTML = displayingList;
    initialList.addEventListener("click", e => {
        if (!e.target.innerText.includes("Symbol")) {
            nameStock = e.target.innerText;
            let symbol = e.path[1].children[1].innerHTML;
            symbolStock = symbol.replace("Symbol: ", "");
            drawChart();
        }
        initialList.innerHTML = "";
    })
    filteredList = [];
}

function drawChart() {
    let dataStocks = [];
    let stockChart = new CanvasJS.StockChart("chart", {
        theme: "light1",
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: nameStock
        },
        subtitles: [{
            text: "Price in USD"
        }],
        charts: [{
            axisX: {
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY: {
                prefix: "$"
            },
            data: [{
                type: "line",
                yValueFormatString: "$#,###.##",
                dataPoints: dataStocks
            }]
        }],
        navigator: {
            slider: {
                minimum: new Date(2014, 0o4, 0o1),
                maximum: new Date(2031, 0o6, 0o1)
            }
        }
    });
    fetch('https://api.polygon.io/v2/aggs/ticker/'+ symbolStock +'/range/1/day/2018-01-01/2020-07-01?apiKey=h_zhS7OFaetLMf6dcXpBFOYtlVYn9CQc&limit=50000&unadjusted=true')
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.resultsCount; ++i) {
                const price = parseFloat(data['results'][i]['h']).toFixed(2);
                const time = parseInt(data['results'][i]['t'])
                dataStocks.push({x: new Date(time), y: Number(price)});
            }
            stockChart.render();
        });
}
