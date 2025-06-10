// Stock Symbol Suggestions Data
const stockList = {
    "AAPL": "Apple",
    "MSFT": "Microsoft",
    "GOOGL": "Google",
    "AMZN": "Amazon",
    "TSLA": "Tesla",
    "NFLX": "Netflix",
    "FB": "Meta (Facebook)",
    "NVDA": "Nvidia",
    "AMD": "AMD",
    "INTC": "Intel"
};

// Function to show suggestions
function showSuggestions() {
    let input = document.getElementById("stockInput").value.toUpperCase();
    let suggestionsBox = document.getElementById("suggestions");
    
    // Clear previous suggestions
    suggestionsBox.innerHTML = "";

    if (input.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    let matches = Object.keys(stockList).filter(symbol => symbol.startsWith(input));

    if (matches.length > 0) {
        suggestionsBox.style.display = "block";
        matches.forEach(symbol => {
            let div = document.createElement("div");
            div.innerHTML = `${symbol} (${stockList[symbol]})`;
            div.onclick = function () {
                document.getElementById("stockInput").value = symbol;
                suggestionsBox.style.display = "none";
            };
            suggestionsBox.appendChild(div);
        });
    } else {
        suggestionsBox.style.display = "none";
    }
}

// Function to fetch stock data
async function fetchStockData() {
    let stockSymbol = document.getElementById("stockInput").value.toUpperCase();
    let stockPriceElement = document.getElementById("stockPrice");
    let chartFrame = document.getElementById("tradingViewChart");

    if (!stockSymbol || !stockList[stockSymbol]) {
        stockPriceElement.innerText = "Please enter a valid stock symbol!";
        return;
    }

    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}`);
        const data = await response.json();

        if (data.chart.result) {
            let price = data.chart.result[0].meta.regularMarketPrice;
            stockPriceElement.innerText = `Current price of ${stockSymbol} (${stockList[stockSymbol]}): $${price}`;
        } else {
            stockPriceElement.innerText = "Stock not found!";
        }
    } catch (error) {
        stockPriceElement.innerText = "";
    }

    // Set TradingView Chart for the stock
    chartFrame.src = `https://s.tradingview.com/widgetembed/?symbol=NASDAQ:${stockSymbol}&interval=D&theme=light`;
}
