document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const searchInput = document.querySelector('.fsearch input');
    const searchButton = document.querySelector('.btn-search');
    const clearButton = document.querySelector('.btn-clear');
    const searchContentDiv = document.querySelector('.search-content');
    
    // Add event listeners
    searchButton.addEventListener('click', performSearch);
    clearButton.addEventListener('click', clearSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Function to fetch JSON data and perform search
    async function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) return;
        
        try {
            // Use a more reliable path with error handling
            const response = await fetch('travel_recommendation_api.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const results = searchAllData(data, searchTerm);
            displayResults(results);
        } catch (error) {
            console.error('Error fetching or processing data:', error);
            searchContentDiv.innerHTML = '<p class="error-message">Sorry, we encountered an error processing your search. Make sure travel_recommendation_api.json exists in the same directory as this HTML file.</p>';
        }
    }
    
    // Function to search through all data categories
    function searchAllData(data, searchTerm) {
        const searchWords = searchTerm.split(' ');
        let results = [];
        
        // Special case: show all beaches when searching for "beach" or "beaches"
        if (searchTerm === "beach" || searchTerm === "beaches") {
            data.beaches.forEach(beach => {
                results.push({
                    ...beach,
                    type: 'beach'
                });
            });
            return results;
        }
        
        // Regular search through countries and cities
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (matchesSearch(city, searchWords)) {
                    results.push({
                        ...city,
                        type: 'city',
                        country: country.name
                    });
                }
            });
        });
        
        // Search temples
        data.temples.forEach(temple => {
            if (matchesSearch(temple, searchWords)) {
                results.push({
                    ...temple,
                    type: 'temple'
                });
            }
        });
        
        // Search beaches
        data.beaches.forEach(beach => {
            if (matchesSearch(beach, searchWords)) {
                results.push({
                    ...beach,
                    type: 'beach'
                });
            }
        });
        
        return results;
    }
    
    // Function to check if item matches at least one search word
    function matchesSearch(item, searchWords) {
        const itemName = item.name.toLowerCase();
        return searchWords.some(word => itemName.includes(word));
    }
    
    // Function to display search results
    function displayResults(results) {
        if (results.length === 0) {
            searchContentDiv.innerHTML = '<p class="no-results">No matching destinations found. Try a different search term.</p>';
            return;
        }
        
        let html = '';
        results.forEach(item => {
            // Create a result card for each match
            html += `
                <div class="result-card">
                    <div class="result-image">
                        <img src="${item.imageUrl}" alt="${item.name}">
                    </div>
                    <h3 class="result-title">${item.name}</h3>
                    <p class="result-description">${item.description}</p>
                    <button class="visit-btn">Visit</button>
                </div>
            `;
        });
        
        searchContentDiv.innerHTML = html;
    }
    
    // Function to clear search results
    function clearSearch() {
        searchInput.value = '';
        searchContentDiv.innerHTML = '';
    }
});
