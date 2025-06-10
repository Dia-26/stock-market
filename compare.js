// Enhanced Stock Symbol Database
const stockList = {
    "AAPL": { name: "Apple Inc.", sector: "Technology" },
    "MSFT": { name: "Microsoft Corporation", sector: "Technology" },
    "GOOGL": { name: "Alphabet Inc.", sector: "Technology" },
    "AMZN": { name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
    "TSLA": { name: "Tesla Inc.", sector: "Consumer Cyclical" },
    "META": { name: "Meta Platforms Inc.", sector: "Communication Services" },
    "NVDA": { name: "NVIDIA Corporation", sector: "Technology" },
    "JPM": { name: "JPMorgan Chase & Co.", sector: "Financial Services" },
    "V": { name: "Visa Inc.", sector: "Financial Services" },
    "WMT": { name: "Walmart Inc.", sector: "Consumer Defensive" },
    "JNJ": { name: "Johnson & Johnson", sector: "Healthcare" },
    "PG": { name: "Procter & Gamble", sector: "Consumer Defensive" },
    "DIS": { name: "The Walt Disney Company", sector: "Communication Services" },
    "NFLX": { name: "Netflix Inc.", sector: "Communication Services" },
    "BA": { name: "Boeing Company", sector: "Industrials" }
};

// Function to show suggestions with enhanced UI
function showSuggestions(inputId, suggestionsId) {
    const input = document.getElementById(inputId).value.toUpperCase();
    const suggestionsBox = document.getElementById(suggestionsId);
    
    suggestionsBox.innerHTML = "";

    if (input.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    const matches = Object.keys(stockList)
        .filter(symbol => symbol.startsWith(input) || 
                         stockList[symbol].name.toUpperCase().includes(input))
        .slice(0, 8); // Limit to 8 suggestions

    if (matches.length > 0) {
        suggestionsBox.style.display = "block";
        matches.forEach(symbol => {
            const div = document.createElement("div");
            div.innerHTML = `
                <strong>${symbol}</strong>
                <div class="suggestion-details">
                    <span>${stockList[symbol].name}</span>
                    <small>${stockList[symbol].sector}</small>
                </div>
            `;
            div.onclick = () => {
                document.getElementById(inputId).value = symbol;
                suggestionsBox.style.display = "none";
            };
            suggestionsBox.appendChild(div);
        });
    } else {
        suggestionsBox.style.display = "none";
    }
}

// Enhanced stock comparison function with Finnhub API
async function fetchStockData() {
    const stock1 = document.getElementById("stockInput1").value.toUpperCase();
    const stock2 = document.getElementById("stockInput2").value.toUpperCase();
    const resultsContainer = document.getElementById("stockPrice");
    const chartContainer = document.getElementById("tradingViewChart");

    // Validate inputs
    if (!stock1 || !stock2 || !stockList[stock1] || !stockList[stock2]) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Please enter two valid stock symbols</p>
            </div>
        `;
        return;
    }

    // Show loading state
    resultsContainer.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Fetching stock data...</p>
        </div>
    `;

    chartContainer.innerHTML = `
        <div class="chart-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading charts...</p>
        </div>
    `;

    try {
        const apiKey = "cvta1qhr01qhup0v6e6gcvta1qhr01qhup0v6e70";
        
        // Fetch data for both stocks in parallel
        const [stock1Response, stock2Response] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/quote?symbol=${stock1}&token=${apiKey}`),
            fetch(`https://finnhub.io/api/v1/quote?symbol=${stock2}&token=${apiKey}`)
        ]);

        const stock1Data = await stock1Response.json();
        const stock2Data = await stock2Response.json();

        // Get company profiles for names (since Finnhub quote doesn't include company names)
        const [profile1Response, profile2Response] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${stock1}&token=${apiKey}`),
            fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${stock2}&token=${apiKey}`)
        ]);

        const profile1 = await profile1Response.json();
        const profile2 = await profile2Response.json();

        // Calculate changes and percentages
        const stock1Change = stock1Data.c - stock1Data.pc;
        const stock1ChangePercent = (stock1Change / stock1Data.pc) * 100;
        const stock2Change = stock2Data.c - stock2Data.pc;
        const stock2ChangePercent = (stock2Change / stock2Data.pc) * 100;

        // Display price comparison
        resultsContainer.innerHTML = `
            <div class="stock-result">
                <div class="stock-card">
                    <div class="stock-symbol">${stock1}</div>
                    <div class="stock-price">$${stock1Data.c?.toFixed(2) || 'N/A'}</div>
                    <div class="stock-name">${profile1.name || stockList[stock1]?.name || 'N/A'}</div>
                    <div class="stock-change ${stock1Change >= 0 ? 'positive' : 'negative'}">
                        ${stock1Change?.toFixed(2) || '0.00'} (${stock1ChangePercent?.toFixed(2) || '0.00'}%)
                    </div>
                </div>
                
                <div class="stock-card">
                    <div class="stock-symbol">${stock2}</div>
                    <div class="stock-price">$${stock2Data.c?.toFixed(2) || 'N/A'}</div>
                    <div class="stock-name">${profile2.name || stockList[stock2]?.name || 'N/A'}</div>
                    <div class="stock-change ${stock2Change >= 0 ? 'positive' : 'negative'}">
                        ${stock2Change?.toFixed(2) || '0.00'} (${stock2ChangePercent?.toFixed(2) || '0.00'}%)
                    </div>
                </div>
            </div>
        `;

        // Display charts (using TradingView as before)
        chartContainer.innerHTML = `
            <iframe src="https://s.tradingview.com/widgetembed/?symbol=${stock1}&interval=D&theme=light" width="45%" height="450"></iframe>
            <iframe src="https://s.tradingview.com/widgetembed/?symbol=${stock2}&interval=D&theme=light" width="45%" height="450"></iframe>
        `;

        // Update last updated time
        document.getElementById("lastUpdated").textContent = new Date().toLocaleString();
    } catch (error) {
        console.error("Error:", error);
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to fetch stock data. Please try again later.</p>
            </div>
        `;
        chartContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load charts</p>
            </div>
        `;
    }
}