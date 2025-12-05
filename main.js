const sortAlgorithms = [
    { id: 'bubble', name: 'Ordenamiento Burbuja' },
    { id: 'quick', name: 'Quick Sort' },
    { id: 'insertion', name: 'Método de Inserción' }
];

const searchAlgorithms = [
    { id: 'sequential', name: 'Búsqueda Secuencial' },
    { id: 'binary', name: 'Búsqueda Binaria' }
];

let currentArray = [];
let sortedArray = [];
let searchTarget = null;
let sortResults = {};
let searchResults = {};
let raceInProgress = false;

const startSortButton = document.getElementById('startSortRace');
const startSearchButton = document.getElementById('startSearchRace');
const resetButton = document.getElementById('resetRace');
const arraySizeInput = document.getElementById('arraySize');
const searchTargetInput = document.getElementById('searchTarget');
const arrayPreview = document.getElementById('arrayPreview');
const sortResultsSection = document.getElementById('sortResults');
const searchResultsSection = document.getElementById('searchResults');

function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 10000));
    }
    return array;
}

function displayArrayPreview(array, isSorted = false) {
    const preview = array.slice(0, 10).join(', ');
    const remaining = array.length > 10 ? `, ... (${array.length} elementos en total)` : '';
    const sortedLabel = isSorted ? ' [ORDENADO]' : '';
    arrayPreview.textContent = `[${preview}${remaining}]${sortedLabel}`;
}

function updateAlgorithmStatus(algoId, status, time = null) {
    const card = document.querySelector(`.algorithm-card[data-algo="${algoId}"]`);
    if (!card) return;

    const statusElement = card.querySelector('.status');
    const timeElement = card.querySelector('.time');
    const progressFill = card.querySelector('.progress-fill');

    card.classList.remove('running', 'finished', 'winner');
    statusElement.classList.remove('waiting', 'running', 'finished');

    if (status === 'running') {
        card.classList.add('running');
        statusElement.classList.add('running');
        statusElement.textContent = 'Ejecutando...';
        progressFill.style.width = '0%';
    } else if (status === 'finished') {
        card.classList.add('finished');
        statusElement.classList.add('finished');
        statusElement.textContent = 'Completado';
        progressFill.style.width = '100%';

        if (time !== null) {
            timeElement.textContent = `Tiempo: ${time.toFixed(4)} ms`;
        }
    } else {
        statusElement.classList.add('waiting');
        statusElement.textContent = 'Esperando...';
        progressFill.style.width = '0%';
        timeElement.textContent = 'Tiempo: -- ms';
    }
}

function updateAlgorithmPosition(algoId, position) {
    const card = document.querySelector(`.algorithm-card[data-algo="${algoId}"]`);
    if (!card) return;

    const positionElement = card.querySelector('.position');
    positionElement.textContent = `${position}° Lugar`;

    if (position === 1) {
        card.classList.add('winner');
    }
}

function updateSearchResult(algoId, found, position) {
    const card = document.querySelector(`.algorithm-card[data-algo="${algoId}"]`);
    if (!card) return;

    const positionElement = card.querySelector('.position');

    if (found) {
        positionElement.textContent = `Encontrado en posición ${position}`;
        positionElement.style.color = '#00aa00';
    } else {
        positionElement.textContent = 'No encontrado';
        positionElement.style.color = '#cc0000';
    }
}

function updateAlgorithmProgress(algoId, progress) {
    const card = document.querySelector(`.algorithm-card[data-algo="${algoId}"]`);
    if (!card) return;

    const progressFill = card.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

function displaySortResults() {
    const sortedResults = Object.entries(sortResults)
        .sort((a, b) => a[1].time - b[1].time);

    sortedResults.forEach(([algoId, data], index) => {
        updateAlgorithmPosition(algoId, index + 1);
    });

    const podiumPlaces = ['sort-first-place', 'sort-second-place', 'sort-third-place'];

    podiumPlaces.forEach((placeId, index) => {
        const place = document.getElementById(placeId);
        if (sortedResults[index]) {
            const [algoId, data] = sortedResults[index];
            const algoInfo = sortAlgorithms.find(a => a.id === algoId);

            place.querySelector('.algo-name').textContent = algoInfo.name;
            place.querySelector('.algo-time').textContent = `${data.time.toFixed(4)} ms`;
        }
    });

    // Mostrar tabla completa de resultados
    const fullResultsDiv = document.getElementById('sortFullResults');
    fullResultsDiv.innerHTML = '<h3>Tabla Completa de Resultados - Ordenamiento</h3>';

    sortedResults.forEach(([algoId, data], index) => {
        const algoInfo = sortAlgorithms.find(a => a.id === algoId);
        const row = document.createElement('div');
        row.className = 'result-row';

        row.innerHTML = `
            <span class="result-position">${index + 1}°</span>
            <span class="result-algo">${algoInfo.name}</span>
            <span class="result-time">${data.time.toFixed(4)} ms</span>
        `;

        fullResultsDiv.appendChild(row);
    });

    sortResultsSection.style.display = 'block';
    sortResultsSection.scrollIntoView({ behavior: 'smooth' });
}

function displaySearchResults() {
    const sortedResults = Object.entries(searchResults)
        .sort((a, b) => a[1].time - b[1].time);

    sortedResults.forEach(([algoId, data], index) => {
        updateAlgorithmPosition(algoId, index + 1);
        updateSearchResult(algoId, data.found, data.position);
    });

    const podiumPlaces = ['search-first-place', 'search-second-place'];

    podiumPlaces.forEach((placeId, index) => {
        const place = document.getElementById(placeId);
        if (sortedResults[index]) {
            const [algoId, data] = sortedResults[index];
            const algoInfo = searchAlgorithms.find(a => a.id === algoId);

            place.querySelector('.algo-name').textContent = algoInfo.name;
            place.querySelector('.algo-time').textContent = `${data.time.toFixed(4)} ms`;

            const resultText = data.found ? `Encontrado en posición ${data.position}` : 'No encontrado';
            place.querySelector('.algo-result').textContent = resultText;
        }
    });

    // Mostrar tabla completa de resultados
    const fullResultsDiv = document.getElementById('searchFullResults');
    fullResultsDiv.innerHTML = '<h3>Tabla Completa de Resultados - Búsqueda</h3>';
    fullResultsDiv.innerHTML += `<p>Valor buscado: <strong>${searchTarget}</strong></p>`;

    sortedResults.forEach(([algoId, data], index) => {
        const algoInfo = searchAlgorithms.find(a => a.id === algoId);
        const row = document.createElement('div');
        row.className = 'result-row';

        const resultText = data.found ? `Posición ${data.position}` : 'No encontrado';

        row.innerHTML = `
            <span class="result-position">${index + 1}°</span>
            <span class="result-algo">${algoInfo.name}</span>
            <span class="result-time">${data.time.toFixed(4)} ms</span>
            <span class="result-found">${resultText}</span>
        `;

        fullResultsDiv.appendChild(row);
    });

    // Mostrar sección de resultados
    searchResultsSection.style.display = 'block';
    searchResultsSection.scrollIntoView({ behavior: 'smooth' });
}

function executeSortAlgorithmWithWorker(algorithmId, data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('worker.js');

        const timeout = setTimeout(() => {
            worker.terminate();
            reject(new Error(`Timeout: ${algorithmId} tardó demasiado`));
        }, 300000);

        worker.onmessage = function(e) {
            const message = e.data;

            if (message.type === 'progress') {
                updateAlgorithmProgress(message.algorithm, message.progress);
            } else if (message.type === 'complete') {
                clearTimeout(timeout);
                worker.terminate();
                resolve(message);
            } else {
                clearTimeout(timeout);
                worker.terminate();
                resolve(message);
            }
        };

        worker.onerror = function(error) {
            clearTimeout(timeout);
            worker.terminate();
            reject(error);
        };

        worker.postMessage({
            type: 'sort',
            algorithmName: algorithmId,
            data: data
        });
    });
}

async function startSortRace() {
    if (raceInProgress) return;

    raceInProgress = true;
    sortResults = {};
    sortResultsSection.style.display = 'none';

    // Generar arreglo aleatorio
    const arraySize = parseInt(arraySizeInput.value);
    currentArray = generateRandomArray(arraySize);
    displayArrayPreview(currentArray);

    // Deshabilitar botones
    startSortButton.disabled = true;
    startSortButton.textContent = 'Ordenando...';
    startSearchButton.disabled = true;

    // Resetear estados visuales
    sortAlgorithms.forEach(algo => {
        updateAlgorithmStatus(algo.id, 'running');
        const card = document.querySelector(`.algorithm-card[data-algo="${algo.id}"]`);
        if (card) {
            card.querySelector('.position').textContent = '';
            card.querySelector('.position').style.color = '';
        }
    });

    console.log('Iniciando carrera de ORDENAMIENTO con', currentArray.length, 'elementos...');

    const promises = sortAlgorithms.map(algo => {
        console.log(`${algo.name} iniciado en worker separado`);
        return executeSortAlgorithmWithWorker(algo.id, currentArray);
    });

    try {
        const results = await Promise.all(promises);
        console.log('Resultados recibidos:', results);
        results.forEach(result => handleSortResult(result));

        const quickSortResult = results.find(r => r.algorithm === 'quick');
        if (quickSortResult && quickSortResult.isCorrect) {
            sortedArray = [...currentArray].sort((a, b) => a - b);
            displayArrayPreview(sortedArray, true);
        }

        displaySortResults();
    } catch (error) {
        console.error('Error durante el ordenamiento:', error);
        console.error('Stack trace:', error.stack);
    }

    raceInProgress = false;
    startSortButton.disabled = false;
    startSortButton.textContent = 'Iniciar Carrera de Ordenamiento';
    startSearchButton.disabled = false;
}

function handleSortResult(data) {
    console.log('handleSortResult recibió:', data);
    const { algorithm, time, success, isCorrect } = data;

    if (!algorithm || time === undefined) {
        console.error('Datos inválidos en handleSortResult:', data);
        return;
    }

    console.log(`${algorithm} completado en ${time.toFixed(4)} ms - Correcto: ${isCorrect}`);

    sortResults[algorithm] = {
        time: time,
        success: success,
        isCorrect: isCorrect
    };

    updateAlgorithmStatus(algorithm, 'finished', time);
}

function executeSearchAlgorithmWithWorker(algorithmId, data, target) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('worker.js');

        const timeout = setTimeout(() => {
            worker.terminate();
            reject(new Error(`Timeout: ${algorithmId} tardó demasiado`));
        }, 300000);

        worker.onmessage = function(e) {
            const message = e.data;

            if (message.type === 'progress') {
                updateAlgorithmProgress(message.algorithm, message.progress);
            } else if (message.type === 'complete') {
                clearTimeout(timeout);
                worker.terminate();
                resolve(message);
            } else {
                clearTimeout(timeout);
                worker.terminate();
                resolve(message);
            }
        };

        worker.onerror = function(error) {
            clearTimeout(timeout);
            worker.terminate();
            reject(error);
        };

        worker.postMessage({
            type: 'search',
            algorithmName: algorithmId,
            data: data,
            target: target
        });
    });
}

async function startSearchRace() {
    if (raceInProgress) return;

    // Obtener el valor a buscar
    searchTarget = parseInt(searchTargetInput.value);

    if (isNaN(searchTarget)) {
        alert('Por favor ingresa un valor numérico válido a buscar.');
        return;
    }

    let arrayToSearch;
    let isArraySorted = false;

    if (sortedArray.length > 0) {
        arrayToSearch = sortedArray;
        isArraySorted = true;
        console.log('Usando arreglo ORDENADO para la búsqueda');
    } else if (currentArray.length > 0) {
        arrayToSearch = currentArray;
        isArraySorted = false;
        console.log('Usando arreglo DESORDENADO para la búsqueda');
        console.log('NOTA: Búsqueda Binaria NO funcionará correctamente en arreglo desordenado');
    } else {
        alert('Primero debes generar un arreglo (ejecuta la carrera de ordenamiento).');
        return;
    }

    raceInProgress = true;
    searchResults = {};
    searchResultsSection.style.display = 'none';

    startSearchButton.disabled = true;
    startSearchButton.textContent = 'Buscando...';
    startSortButton.disabled = true;

    searchAlgorithms.forEach(algo => {
        updateAlgorithmStatus(algo.id, 'running');
        const card = document.querySelector(`.algorithm-card[data-algo="${algo.id}"]`);
        if (card) {
            card.querySelector('.position').textContent = '';
            card.querySelector('.position').style.color = '';
        }
    });

    const arrayType = isArraySorted ? 'ORDENADO' : 'DESORDENADO';
    console.log(`Iniciando carrera de BÚSQUEDA del valor ${searchTarget} en arreglo ${arrayType} de ${arrayToSearch.length} elementos...`);

    const promises = searchAlgorithms.map(algo => {
        console.log(`${algo.name} iniciado en worker separado`);
        return executeSearchAlgorithmWithWorker(algo.id, arrayToSearch, searchTarget);
    });

    try {
        const results = await Promise.all(promises);
        console.log('Resultados de búsqueda recibidos:', results);
        results.forEach(result => handleSearchResult(result));
        displaySearchResults();
    } catch (error) {
        console.error('Error durante la búsqueda:', error);
        console.error('Stack trace:', error.stack);
    }

    raceInProgress = false;
    startSearchButton.disabled = false;
    startSearchButton.textContent = 'Iniciar Carrera de Búsqueda';
    startSortButton.disabled = false;
}

function handleSearchResult(data) {
    console.log('handleSearchResult recibió:', data);
    const { algorithm, time, success, found, position } = data;

    if (!algorithm || time === undefined) {
        console.error('Datos inválidos en handleSearchResult:', data);
        return;
    }

    const foundText = found ? `encontrado en posición ${position}` : 'no encontrado';
    console.log(`${algorithm} completado en ${time.toFixed(4)} ms - ${foundText}`);

    searchResults[algorithm] = {
        time: time,
        success: success,
        found: found,
        position: position
    };

    updateAlgorithmStatus(algorithm, 'finished', time);
}

function generateRandomSearchTarget() {
    let arrayToUse;

    if (sortedArray.length > 0) {
        arrayToUse = sortedArray;
    } else if (currentArray.length > 0) {
        arrayToUse = currentArray;
    } else {
        alert('Primero genera un arreglo (ejecuta la carrera de ordenamiento).');
        return;
    }

    const randomIndex = Math.floor(Math.random() * arrayToUse.length);
    const randomValue = arrayToUse[randomIndex];
    searchTargetInput.value = randomValue;
    console.log(`Valor aleatorio generado: ${randomValue} (existe en posición ${randomIndex})`);
}

function resetRace() {
    raceInProgress = false;
    sortResults = {};
    searchResults = {};
    currentArray = [];
    sortedArray = [];
    searchTarget = null;

    sortAlgorithms.forEach(algo => {
        updateAlgorithmStatus(algo.id, 'waiting');
        const card = document.querySelector(`.algorithm-card[data-algo="${algo.id}"]`);
        if (card) {
            card.querySelector('.position').textContent = '';
            card.querySelector('.position').style.color = '';
        }
    });

    searchAlgorithms.forEach(algo => {
        updateAlgorithmStatus(algo.id, 'waiting');
        const card = document.querySelector(`.algorithm-card[data-algo="${algo.id}"]`);
        if (card) {
            card.querySelector('.position').textContent = '';
            card.querySelector('.position').style.color = '';
        }
    });

    arrayPreview.textContent = 'Haz clic en "Iniciar Carrera de Ordenamiento"';
    sortResultsSection.style.display = 'none';
    searchResultsSection.style.display = 'none';

    startSortButton.disabled = false;
    startSortButton.textContent = 'Iniciar Carrera de Ordenamiento';
    startSearchButton.disabled = false;
    startSearchButton.textContent = 'Iniciar Carrera de Búsqueda';

    console.log('Aplicación reiniciada');
}

startSortButton.addEventListener('click', startSortRace);
startSearchButton.addEventListener('click', startSearchRace);
resetButton.addEventListener('click', resetRace);
document.getElementById('generateTarget').addEventListener('click', generateRandomSearchTarget);

arraySizeInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value < 100) this.value = 100;
    if (value > 50000) this.value = 50000;
});

console.log('='.repeat(60));
console.log('Aplicación de Carrera de Algoritmos cargada');
console.log('Algoritmos de ordenamiento:', sortAlgorithms.length);
console.log('Algoritmos de búsqueda:', searchAlgorithms.length);
console.log('Modo: Web Workers (ejecución paralela multi-hilo)');
console.log('='.repeat(60));
console.log('Para mediciones exactas de memoria:');
console.log('  node --expose-gc measure-memory.js');
console.log('='.repeat(60));
