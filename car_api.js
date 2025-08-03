//Helpers:
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- DOM Elements ---
const makeSelect = document.getElementById("makeSelect");
const modelSelect = document.getElementById("modelSelect");
const yearSelect = document.getElementById("yearSelect");
const resultsDiv = document.getElementById("results");

// --- Static Make/Model Data (You can expand this) ---
let carData = {};

async function loadCarData() {
  const response = await fetch("data/car_data.json");
  carData = await response.json();
  populateMakes();
}

// --- Populate Makes ---
function populateMakes() {
  makeSelect.innerHTML = '<option value="">Select Make</option>';
  for (const make in carData) {
    makeSelect.innerHTML += `<option value="${make}">${make}</option>`;
  }
}

// --- On Make Change {selection} ---
makeSelect.addEventListener("change", () => {
  const selectedMake = makeSelect.value;
  modelSelect.innerHTML = '<option value="">Select Model</option>';
  if (carData[selectedMake]) {
    carData[selectedMake].forEach(model => {
      modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
    });
  }
});

// --- On Model Change: Show Years ---
modelSelect.addEventListener("change", () => {
  yearSelect.innerHTML = '<option value="">Select Year</option>';
  for (let y = 2025; y >= 1960; y--) {
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
  }
});

// --- On Year Select: Fetch Specs ---
yearSelect.addEventListener("change", async () => {
  const make = makeSelect.value;
  const model = modelSelect.value;
  const year = yearSelect.value;

  const specs = await fetchCarSpecs_Ninjas(make, model, year);
  const wikiData = await fetchWikipediaSummary(make, model);
  renderWikipediaInfo(wikiData);
  renderResults(specs, make , model);
});

// --- Fetch from json ---
async function fetchCarSpecs_Ninjas(make, model, year) {
  try {
    const specsResponse = await fetch("data/car_specs.json");
    const allCarSpecs = await specsResponse.json();

    console.log("User selected:", make, model, year);
    //console.log("Sample spec entry:", allCarSpecs[0]);

    const matchedCars = allCarSpecs.filter(car => {
      const carMake = (car.Make || "").trim().toLowerCase();
      const carModel = (car.Model || car.Modle || "").trim().toLowerCase(); // typo-safe
      const carYearFrom = String(car.Year_from || car.Year || "").trim();
      const carYearTo = String(car.Year_to || car.Year || "").trim();

      return (
        carMake === make.trim().toLowerCase() &&
        carModel.includes(model.trim().toLowerCase()) &&
        carYearFrom <= String(year).trim() &&
        carYearTo >= String(year).trim() 
      );
    });

    if (!matchedCars) {
      console.warn("❌ No match found for:", make, model, year);
    } else {
      console.log("✅ Match found:", matchedCars);
    }

    return matchedCars || null;
  } catch (err) {
    console.error("❌ Specs JSON load error:", err);
    return null;
  }
}

// --- Display Results ---
async function renderResults(matchedCars, make, model) {
  document.getElementById("search-prompt").innerHTML = `<h2>${make} - ${model}</h2>`;
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "";

  if (!matchedCars || matchedCars.length === 0) {
    resultDiv.innerHTML = "<p>No detailed specs found for this car.</p>";
    return;
  }

  

  resultDiv.innerHTML = `<h3>📊 Found ${matchedCars.length} Different Modles:</h3>`;

  for (let index = 0; index < matchedCars.length; index++) {
    const car = matchedCars[index];

    let specHtml = 
                  `<div class="car-spec-box">
                      <h2 class="modle-box">Modle ${index + 1}: ${car.Trim || 'N/A'}</h2>
                      <ul>`;

    for (let key in car) {
      if (!["Year", "id_trim"].includes(key) && car[key]) {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const value = car[key];
        specHtml += `<li><strong>${label}:</strong> ${value}</li>`;
      }
    }

    specHtml += "</ul></div>";

    const imageUrl = await fetchUnsplashImage(car.Make, car.Model || car.Modle, car.Trim);
    if (imageUrl) {
      specHtml = `
        <div class="car-spec-box">
          <div class="trim-image-container">
            <img src="${imageUrl}" alt="${car.Model} Trim Image" class="car-image">
          </div>
          <h2 class="modle-box">Modle ${index + 1}: ${car.Trim || 'N/A'}</h2>
          <ul>
      ` + specHtml.split("<ul>")[1]; // Keep the rest of the specs intact;
    }

    resultDiv.innerHTML += specHtml;
  }

}


async function fetchUnsplashImage(make, model, trim = "") {
  const accessKey = "qA50yYxUSzvaLxQTEZuG8h50s06WYzmmFuPjdkZ0t5c"; // Your working key

  const queries = [
    `${make} ${model} ${trim} car`.trim(),
    `${make} ${model} car`.trim()
  ];

  for (const query of queries) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&orientation=landscape&per_page=1&content_filter=high`;

    try {
      const response = await fetch(url);
      if (!response.ok) continue;

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
    } catch (err) {
      console.warn(`Unsplash fetch error for query "${query}":`, err);
    }
  }

  return null;
}





function renderWikipediaInfo(wikiData) {
  const wikiDiv = document.getElementById("wikiInfo");
  wikiDiv.innerHTML = "";

  if (!wikiData) return;

  wikiDiv.innerHTML = `
    <div class="wiki-box">
      ${wikiData.image ? `
        <div class="wiki-img">
          <img src="${wikiData.image}" alt="${wikiData.description}">
        </div>
      ` : ""}
      <div class="wiki-text">
        <p>${wikiData.description}</p>
        <a href="${wikiData.link}" target="_blank">Read more on Wikipedia</a>
      </div>
    </div>
  `;
}

// =============================
// 📘 Wikipedia Car Summary API
// =============================
async function fetchWikipediaSummary(make, model) {
  const pageTitle = `${make}_${model}`.replace(/ /g, "_");

  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`);
    const data = await response.json();

    if (data.extract) {
      return {
        description: data.extract,
        image: data.thumbnail ? data.thumbnail.source : null,
        link: data.content_urls.desktop.page
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Wikipedia fetch error:", err);
    return null;
  }
}


// --- Initialize on Page Load ---
window.onload = function () {
  loadCarData();
};
//populateMakes();
//matching only the from Year!!