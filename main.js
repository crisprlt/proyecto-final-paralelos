// ========== CONFIGURACIÓN Y VARIABLES GLOBALES ==========

const algorithms = [
    { id: 'bubble', name: 'Ordenamiento Burbuja' },
    { id: 'quick', name: 'Quick Sort' },
    { id: 'insertion', name: 'Método de Inserción' },
    { id: 'sequential', name: 'Búsqueda Secuencial' },
    { id: 'binary', name: 'Búsqueda Binaria' }
];

let currentArray = [];
let results = {};
let raceInProgress = false;

// ========== ELEMENTOS DEL DOM ==========

const startButton = document.getElementById('startRace');
const resetButton = document.getElementById('resetRace');
const arraySizeInput = document.getElementById('arraySize');
const arrayPreview = document.getElementById('arrayPreview');
const resultsSection = document.getElementById('results');

// ========== FUNCIONES DE UTILIDAD ==========

/**
 * Genera un arreglo aleatorio de números
 */
function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 10000));
    }
    return array;
}

/**
 * Muestra una vista previa del arreglo generado
 */
function displayArrayPreview(array) {
    const preview = array.slice(0, 10).join(', ');
    const remaining = array.length > 10 ? `, ... (${array.length} elementos en total)` : '';
    arrayPreview.textContent = `[${preview}${remaining}]`;
}

/**
 * Actualiza el estado visual de un algoritmo
 */
function updateAlgorithmStatus(algoId, status, time = null) {
    const card = document.querySelector(`.algorithm-card[data-algo="${algoId}"]`);
    if (!card) return;

    const statusElement = card.querySelector('.status');
    const timeElement = card.querySelector('.time');
    const progressFill = card.querySelector('.progress-fill');

    // Remover clases previas
    card.classList.remove('running', 'finished', 'winner');
    statusElement.classList.remove('waiting', 'running', 'finished');

    if (status === 'running') {
        card.classList.add('running');
        statusElement.classList.add('running');
        statusElement.textContent = 'Ejecutando...';
        progressFill.style.width = '0%'; // Empezar en 0%, se actualizará con los mensajes de progreso
    } else if (status === 'finished') {
        card.classList.add('finished');
        statusElement.classList.add('finished');
        statusElement.textContent = 'Completado';
        progressFill.style.width = '100%';

        if (time !== null) {
            timeElement.textContent = `Tiempo: ${time.toFixed(2)} ms`;
        }
    } else {
        statusElement.classList.add('waiting');
        statusElement.textContent = 'Esperando...';
        progressFill.style.width = '0%';
        timeElement.textContent = 'Tiempo: -- ms';
    }
}

/**
 * Actualiza la posición de un algoritmo
 */
function updateAlgorithmPosition(algoId, position) {
    const card = document.querySelector(`.algorithm-card[data-algo="${algoId}"]`);
    if (!card) return;

    const positionElement = card.querySelector('.position');

    positionElement.textContent = `${position}° Lugar`;

    if (position === 1) {
        card.classList.add('winner');
    }
}

/**
 * Actualiza el progreso de un algoritmo en tiempo real
 */
function updateAlgorithmProgress(algoId, progress) {
    const card = document.querySelector(`.algorithm-card[data-algo="${algoId}"]`);
    if (!card) return;

    const progressFill = card.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

/**
 * Muestra los resultados finales de la carrera
 */
function displayResults() {
    // Ordenar resultados por tiempo
    const sortedResults = Object.entries(results)
        .sort((a, b) => a[1].time - b[1].time);

    // Actualizar posiciones en las tarjetas
    sortedResults.forEach(([algoId, data], index) => {
        updateAlgorithmPosition(algoId, index + 1);
    });

    // Mostrar podio
    const podiumPlaces = ['first-place', 'second-place', 'third-place'];

    podiumPlaces.forEach((placeId, index) => {
        const place = document.getElementById(placeId);
        if (sortedResults[index]) {
            const [algoId, data] = sortedResults[index];
            const algoInfo = algorithms.find(a => a.id === algoId);

            place.querySelector('.algo-name').textContent = algoInfo.name;
            place.querySelector('.algo-time').textContent =
                `${data.time.toFixed(2)} ms`;
        }
    });

    // Mostrar tabla completa de resultados
    const fullResultsDiv = document.getElementById('fullResults');
    fullResultsDiv.innerHTML = '<h3>Tabla Completa de Resultados</h3>';

    sortedResults.forEach(([algoId, data], index) => {
        const algoInfo = algorithms.find(a => a.id === algoId);
        const row = document.createElement('div');
        row.className = 'result-row';

        row.innerHTML = `
            <span class="result-position">${index + 1}°</span>
            <span class="result-algo">${algoInfo.name}</span>
            <span class="result-time">${data.time.toFixed(2)} ms</span>
        `;

        fullResultsDiv.appendChild(row);
    });

    // Mostrar sección de resultados
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// ========== CONTROL DE LA CARRERA ==========

/**
 * Ejecuta un algoritmo usando Web Workers para verdadero paralelismo
 */
function executeAlgorithmWithWorker(algorithmId, data) {
    return new Promise((resolve, reject) => {
        // Crear un nuevo worker para este algoritmo
        const worker = new Worker('worker.js');

        // Configurar timeout para evitar workers colgados
        const timeout = setTimeout(() => {
            worker.terminate();
            reject(new Error(`Timeout: ${algorithmId} tardó demasiado`));
        }, 300000); // 5 minutos timeout

        // Escuchar mensajes del worker (progreso y completado)
        worker.onmessage = function(e) {
            const message = e.data;

            // Si es un mensaje de progreso, actualizar la barra
            if (message.type === 'progress') {
                updateAlgorithmProgress(message.algorithm, message.progress);
            }
            // Si es un mensaje de completado, resolver la promesa
            else if (message.type === 'complete') {
                clearTimeout(timeout);
                worker.terminate(); // Terminar el worker cuando termine
                resolve(message);
            }
            // Para retrocompatibilidad con mensajes sin tipo
            else {
                clearTimeout(timeout);
                worker.terminate();
                resolve(message);
            }
        };

        // Manejar errores del worker
        worker.onerror = function(error) {
            clearTimeout(timeout);
            worker.terminate();
            reject(error);
        };

        // Enviar datos al worker
        worker.postMessage({
            algorithmName: algorithmId,
            data: data
        });
    });
}

/**
 * Inicia la carrera de algoritmos
 */
async function startRace() {
    if (raceInProgress) return;

    // Preparar variables
    raceInProgress = true;
    results = {};
    resultsSection.style.display = 'none';

    // Generar arreglo aleatorio
    const arraySize = parseInt(arraySizeInput.value);
    currentArray = generateRandomArray(arraySize);
    displayArrayPreview(currentArray);

    // Deshabilitar botón de inicio
    startButton.disabled = true;
    startButton.textContent = 'Carrera en progreso...';

    // Resetear estados visuales
    algorithms.forEach(algo => {
        updateAlgorithmStatus(algo.id, 'running');
        const card = document.querySelector(`.algorithm-card[data-algo="${algo.id}"]`);
        if (card) card.querySelector('.position').textContent = '';
    });

    console.log('Iniciando carrera con', currentArray.length, 'elementos...');
    console.log('Ejecutando algoritmos en paralelo usando Web Workers (multi-hilo)...');

    // Ejecutar todos los algoritmos EN PARALELO usando Web Workers
    const promises = algorithms.map(algo => {
        console.log(`${algo.name} iniciado en worker separado`);
        return executeAlgorithmWithWorker(algo.id, currentArray);
    });

    // Esperar a que todos terminen y procesar resultados conforme llegan
    try {
        const results = await Promise.all(promises);
        results.forEach(result => handleAlgorithmResult(result));
    } catch (error) {
        console.error('Error durante la ejecución:', error);
        alert('Ocurrió un error durante la ejecución de los algoritmos. Ver consola para detalles.');
    }

    // Cuando todos terminaron, mostrar resultados
    displayResults();
    raceInProgress = false;
    startButton.disabled = false;
    startButton.textContent = 'Iniciar Carrera';
}

/**
 * Maneja el resultado de un algoritmo
 */
function handleAlgorithmResult(data) {
    const { algorithm, time, success, isCorrect } = data;

    console.log(`${algorithm} completado en ${time.toFixed(2)} ms`);

    // Guardar resultado
    results[algorithm] = {
        time: time,
        success: success,
        isCorrect: isCorrect
    };

    // Actualizar UI
    updateAlgorithmStatus(algorithm, 'finished', time);
}

/**
 * Reinicia la aplicación
 */
function resetRace() {
    // Resetear variables
    raceInProgress = false;
    results = {};
    currentArray = [];

    // Resetear UI
    algorithms.forEach(algo => {
        updateAlgorithmStatus(algo.id, 'waiting');
        const card = document.querySelector(`.algorithm-card[data-algo="${algo.id}"]`);
        if (card) card.querySelector('.position').textContent = '';
    });

    arrayPreview.textContent = 'Haz clic en "Iniciar Carrera"';
    resultsSection.style.display = 'none';

    startButton.disabled = false;
    startButton.textContent = 'Iniciar Carrera';

    console.log('Aplicación reiniciada');
}

// ========== EVENT LISTENERS ==========

startButton.addEventListener('click', startRace);
resetButton.addEventListener('click', resetRace);

// Validar tamaño del arreglo
arraySizeInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value < 100) this.value = 100;
    if (value > 50000) this.value = 50000;
});

// ========== INICIALIZACIÓN ==========

console.log('Aplicación de Carrera de Algoritmos cargada');
console.log('Algoritmos disponibles:', algorithms.length);
console.log('Modo: Web Workers (ejecución paralela multi-hilo)');
console.log('IMPORTANTE: Esta aplicación requiere ser servida desde un servidor web (http-server, Live Server, etc.)');
console.log('No funcionará correctamente con file:// debido a las restricciones de seguridad de Web Workers');
