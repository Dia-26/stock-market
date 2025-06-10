// Finnhub API Key (yours is valid!)
const FINNHUB_API_KEY = "cvta1qhr01qhup0v6e6gcvta1qhr01qhup0v6e70";

// DOM Elements
const newsContainer = document.getElementById("newsContainer");
const loadingSkeleton = document.getElementById("loadingSkeleton");
const refreshButton = document.getElementById("refreshNews");
const categorySelect = document.getElementById("newsCategory");
const lastUpdatedSpan = document.getElementById("lastUpdated");

// Fetch News from Finnhub
async function fetchNews() {
    try {
        // Show loading state
        newsContainer.innerHTML = "";
        loadingSkeleton.style.display = "grid";

        const category = categorySelect.value;
        const response = await fetch(
            `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_API_KEY}`
        );

        if (!response.ok) throw new Error("Failed to fetch news");
        
        const newsData = await response.json();
        displayNews(newsData.slice(0, 12)); // Show first 12 articles
        updateLastUpdated();
    } catch (error) {
        console.error("Error:", error);
        newsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load news. <a href="javascript:fetchNews()">Click to retry</a></p>
            </div>
        `;
    } finally {
        loadingSkeleton.style.display = "none";
    }
}

// Display News Articles
function displayNews(articles) {
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = "<p>No news found. Try refreshing.</p>";
        return;
    }

    newsContainer.innerHTML = articles.map(article => `
        <div class="news-card">
            <img src="${article.image || "https://via.placeholder.com/400x200?text=Market+News"}" 
                 alt="${article.headline}" class="news-image">
            <div class="news-content">
                <div class="news-source">
                    <span>${article.source || "Unknown Source"}</span>
                    <span>${new Date(article.datetime * 1000).toLocaleDateString()}</span>
                </div>
                <h3 class="news-title">${article.headline}</h3>
                <p class="news-desc">${article.summary || "No summary available."}</p>
                <a href="${article.url}" target="_blank" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join("");
}

// Update Timestamp
function updateLastUpdated() {
    lastUpdatedSpan.textContent = new Date().toLocaleString();
}

// Initialize
document.addEventListener("DOMContentLoaded", fetchNews);
refreshButton.addEventListener("click", fetchNews);
categorySelect.addEventListener("change", fetchNews);