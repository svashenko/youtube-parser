document.querySelector('.fetch-btn').addEventListener('click', async function () {
  const userInput = document.getElementById('userInput');
  const status = document.getElementById('status');
  const loader = document.querySelector('.loader');

  if (!userInput) {
    status.textContent = 'Please enter a link!';
    return;
  }

  this.style.display = 'none';
  loader.style.display = 'block';
  status.textContent = 'Processing...';

  try {
    const response = await fetch('/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: userInput.value })
    });

    const result = await response.json();    
    status.textContent = result.message;
    this.style.display = 'block';
    loader.style.display = 'none';
    userInput.value = '';
  } catch (error) {
    status.textContent = 'Error processing request.';
    console.error(error);
  }
});

