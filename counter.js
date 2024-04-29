let count = localStorage.getItem('counter');
if (!count) {
  // If no count exists, set it to 0
  count = 0;
} else {
  // If count exists, parse it as an integer
  count = parseInt(count);
}

// Increment the count
count++;

// Update the counter on the page
document.getElementById('counter').textContent = count;

// Store the updated count in localStorage
localStorage.setItem('counter', count);