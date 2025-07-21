// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Array of space facts
const spaceFacts = [
  "One day on Venus is longer than its year! Venus takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun!",
  "A teaspoon of neutron star material would weigh about 6 billion tons on Earth!",
  "Jupiter has 79 known moons, including four large moons discovered by Galileo in 1610!",
  "The Sun contains 99.86% of all the mass in our solar system!",
  "Saturn's moon Titan has lakes and rivers of liquid methane and ethane!",
  "The Great Red Spot on Jupiter is a storm that has been raging for over 400 years!",
  "Space is completely silent because sound waves need a medium to travel through!",
  "The footprints left by astronauts on the Moon will remain there for millions of years because there's no wind or water to erode them!",
  "One million Earths could fit inside the Sun!",
  "The Milky Way galaxy is spinning at 168 miles per second!",
  "A year on Mercury is just 88 Earth days long, but a day on Mercury lasts 176 Earth days!",
  "The coldest place in the universe is the Boomerang Nebula at -458°F (-272°C)!",
  "Olympus Mons on Mars is the largest volcano in the solar system, standing 13.6 miles high!",
  "The International Space Station travels at a speed of 17,500 mph and orbits Earth every 90 minutes!",
  "There are more stars in the universe than grains of sand on all the beaches on Earth!"
];

// Function to display a random space fact
function displayRandomSpaceFact() {
  // Get a random index from the spaceFacts array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  
  // Get the random fact
  const randomFact = spaceFacts[randomIndex];
  
  // Display the fact in the HTML element
  const factText = document.getElementById('factText');
  factText.textContent = randomFact;
}

// Display a random space fact when the page loads
displayRandomSpaceFact();

// NASA API configuration
const NASA_API_KEY = '0xFFD4fhaz0TpmnY4plyQDjMcmX58smJnlincXAZ';
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';

// Get references to DOM elements
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeBtn = document.querySelector('.close');

// Add event listener to the "Get Space Images" button
getImagesBtn.addEventListener('click', function() {
  // Get the selected date values
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }
  
  // Check if start date is before end date
  if (startDate > endDate) {
    alert('Start date must be before end date');
    return;
  }
  
  // Fetch and display the space images
  fetchSpaceImages(startDate, endDate);
});

// Function to show loading message
function showLoading() {
  gallery.innerHTML = `
    <div class="loading">
      <div class="loading-icon">
        <img src="img/NASA-Logo-Large-Transparent.png" alt="NASA Logo Loading" />
      </div>
      <p>Loading space photos...</p>
    </div>
  `;
}

// Function to fetch space images from NASA API
async function fetchSpaceImages(startDate, endDate) {
  // Show loading message
  showLoading();
  
  try {
    // Build the API URL with date range and API key
    const apiUrl = `${NASA_API_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
    
    // Fetch data from NASA API
    const response = await fetch(apiUrl);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch space images');
    }
    
    // Convert response to JSON
    const data = await response.json();
    
    // Filter out videos and keep only images
    const imageData = data.filter(item => item.media_type === 'image');
    
    // Limit to 9 images maximum
    const limitedData = imageData.slice(0, 9);
    
    // Display the images in the gallery
    displayGallery(limitedData);
    
  } catch (error) {
    // Show error message if something goes wrong
    console.error('Error fetching space images:', error);
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">❌</div>
        <p>Sorry, there was an error loading the space images. Please try again.</p>
      </div>
    `;
  }
}

// Function to display images in the gallery
function displayGallery(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  
  // Check if we have any images
  if (images.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔍</div>
        <p>No images found for the selected date range. Try selecting different dates.</p>
      </div>
    `;
    return;
  }
  
  // Create gallery items for each image
  images.forEach(function(image) {
    // Create a container div for each image
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    // Create the HTML content for the gallery item
    galleryItem.innerHTML = `
      <img src="${image.url}" alt="${image.title}" loading="lazy" />
      <p class="image-title">${image.title}</p>
      <p class="image-date">${image.date}</p>
    `;
    
    // Add click event to open modal
    galleryItem.addEventListener('click', function() {
      openModal(image);
    });
    
    // Add the gallery item to the gallery
    gallery.appendChild(galleryItem);
  });
}

// Function to open the modal with image details
function openModal(imageData) {
  // Set the modal content
  modalImage.src = imageData.url;
  modalImage.alt = imageData.title;
  modalTitle.textContent = imageData.title;
  modalDate.textContent = `Date: ${imageData.date}`;
  modalExplanation.textContent = imageData.explanation;
  
  // Show the modal
  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
}

// Add event listeners for closing the modal
closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    closeModal();
  }
});

