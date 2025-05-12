document.querySelector('.fetch-btn').addEventListener('click', async function () {
  const userInput = document.getElementById('userInput');
  const links = userInput.value.trim().split(/\s+/);
  const status = document.getElementById('status');
  const loader = document.querySelector('.loader');
  const loaderCounter = document.querySelector('.loader__counter');
  const loaderBg = document.querySelector('.loader__bg');

  if (!links.length || links[0] === '') {
    status.textContent = 'Please enter one or more links!';
    return;
  }

  this.style.display = 'none';
  status.textContent = 'Processing...';
  loader.style.display = 'flex';
  loaderCounter.innerHTML = `1 / ${links.length}`;

  for (const link of links) {
    try {
      const response = await fetch('/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link })
      });

      loaderCounter.innerHTML = `${links.indexOf(link) + 1} / ${links.length}`;
      loaderBg.style.width = `${(links.indexOf(link) + 1) / links.length * 100}%`;

      const result = await response.json();
      status.textContent = `${link} — ${result.message}`;
    } catch (error) {
      status.textContent = `${link} — ${result.message}`;
      console.error(`Error with ${link}:`, error);
    }
  }

  this.style.display = 'block';
  loader.style.display = 'none';
  userInput.value = '';
  status.textContent = '✅ All Done ✅';
});
