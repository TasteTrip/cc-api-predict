document.getElementById('uploadButton').addEventListener('click', async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('image');
  const contentDiv = document.getElementById('content')

  if (!fileInput.files.length) {
    alert('Please select an image file!');
    return;
  }

  const loading = document.createElement('p')
  loading.id = 'loading'
  loading.textContent = 'loading...'
  contentDiv.appendChild(loading)

  try {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);

    const response = await fetch('http://35.222.70.188:3000/api/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    const highestEntry = Object.entries(data.result).reduce((max, current) => {
      return current[1] > max[1] ? current : max;
    }, Object.entries(data.result)[0])

    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        const foodName = document.createElement('h2')
        foodName.textContent = Object.keys(data)[highestEntry[0]]
        contentDiv.appendChild(foodName)

        const foodInfo = document.createElement('p')
        foodInfo.textContent = data[Object.keys(data)[highestEntry[0]]]
        contentDiv.appendChild(foodInfo)
      })

  } catch (error) {
    const responseDiv = document.createElement('p')
    responseDiv.textContent = `Failed to upload: ${error.message}`
    contentDiv.appendChild(responseDiv)

  } finally {
    const finishLoading = document.getElementById('loading')
    finishLoading.remove()
  }
});