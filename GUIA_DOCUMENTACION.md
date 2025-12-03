# Guía para Completar la Documentación del Proyecto

Esta guía te ayudará a completar cada sección del documento requerido para el proyecto.

---

## Estructura del Documento Requerido

### 1. Introducción

**Qué incluir:**
- Contexto de los algoritmos paralelos
- Importancia en la computación moderna
- Breve descripción del proyecto

**Ejemplo:**
```
Los algoritmos paralelos son fundamentales en la computación moderna,
permitiendo aprovechar múltiples núcleos de procesamiento para ejecutar
tareas simultáneamente. Este proyecto implementa una simulación de
"carrera" entre diferentes algoritmos de ordenamiento y búsqueda,
ejecutándolos en paralelo para comparar su rendimiento.
```

---

### 2. Descripción del Proyecto

**Qué incluir:**
- Explicación detallada de lo que hace la aplicación
- Tecnologías utilizadas
- Funcionalidades principales

**Puntos clave:**
- Aplicación web interactiva
- 5 algoritmos implementados (Burbuja, Quick Sort, Inserción, Búsqueda Secuencial, Búsqueda Binaria)
- Ejecución paralela mediante Web Workers
- Medición precisa de tiempos
- Interfaz visual con resultados en tiempo real

---

### 3. Objetivos

#### a. Objetivo General
```
Implementar y comparar el rendimiento de diferentes algoritmos de
ordenamiento y búsqueda mediante su ejecución paralela, utilizando
tecnologías web modernas para demostrar los principios de paralelismo
en algoritmos.
```

#### b. Objetivos Específicos
1. Implementar 5 algoritmos diferentes de ordenamiento y búsqueda
2. Utilizar Web Workers para lograr ejecución paralela real
3. Medir y comparar tiempos de ejecución de cada algoritmo
4. Crear una interfaz visual interactiva para mostrar resultados
5. Demostrar la aplicación práctica de algoritmos paralelos

---

### 4. Definición de Algoritmos Paralelos

**Qué incluir:**
- Definición formal
- Diferencia con algoritmos secuenciales
- Ventajas y aplicaciones

**Recursos:**
- Consulta tus notas de clase
- El archivo PSEUDOCODIGOS.md tiene información útil

---

### 5. Etapas de los Algoritmos Paralelos

Para este proyecto, las etapas se aplican así:

#### a. Partición
```
El problema se divide en 5 tareas independientes:
- Ordenar con Bubble Sort
- Ordenar con Quick Sort
- Ordenar con Insertion Sort
- Ordenar con Sequential Search
- Ordenar con Binary Search

Cada tarea recibe una copia del mismo arreglo de datos.
```

#### b. Comunicación
```
Los Web Workers se comunican con el hilo principal mediante:
- postMessage(): Envío de datos y comandos
- onmessage: Recepción de resultados
- Cada worker reporta su tiempo de ejecución al finalizar
```

#### c. Agrupamiento
```
Cada algoritmo se agrupa en un Web Worker independiente,
sin dependencias entre ellos, permitiendo ejecución totalmente paralela.
```

#### d. Asignación
```
El navegador (motor JavaScript) asigna cada Web Worker a un
hilo de ejecución diferente, utilizando núcleos disponibles del CPU.
```

---

### 6. Técnicas Algorítmicas Paralelas

**Para este proyecto:**

- **Paralelismo de Datos:** Cada worker procesa los mismos datos con diferentes algoritmos
- **Independencia de tareas:** Los algoritmos no dependen unos de otros
- **Comunicación por mensajes:** Web Workers usan paso de mensajes
- **Sin memoria compartida:** Cada worker tiene su copia de los datos

---

### 7. Modelos de Algoritmos Paralelos

**Modelo aplicado:** MIMD (Multiple Instruction, Multiple Data)

```
Cada Web Worker ejecuta instrucciones diferentes (algoritmos distintos)
sobre copias del mismo conjunto de datos, operando simultáneamente.
```

---

### 8. Algoritmos de Búsquedas y Ordenamiento

**Para cada algoritmo incluye:**
1. Descripción
2. Pseudocódigo (usa PSEUDOCODIGOS.md)
3. Código JavaScript (de worker.js)
4. Análisis de complejidad

**Formato sugerido para cada uno:**

#### Ejemplo: Ordenamiento de la Burbuja

**Descripción:**
El algoritmo de ordenamiento burbuja compara pares de elementos
adyacentes y los intercambia si están en el orden incorrecto...

**Pseudocódigo:**
(Copia del archivo PSEUDOCODIGOS.md)

**Código JavaScript:**
```javascript
function bubbleSort(arr) {
    const array = [...arr];
    const n = array.length;
    // ... (resto del código)
}
```

**Complejidad:**
- Tiempo: O(n²)
- Espacio: O(1)

---

### 9. Programa Desarrollado

#### a. Explicación de su Funcionamiento

**Estructura a seguir:**

1. **Arquitectura General:**
   - HTML: Interfaz de usuario
   - CSS: Estilos visuales
   - main.js: Lógica principal y control
   - worker.js: Algoritmos en workers

2. **Flujo de Ejecución:**
   ```
   1. Usuario configura tamaño del arreglo
   2. Click en "Iniciar Carrera"
   3. Se genera arreglo aleatorio
   4. Se crean 5 Web Workers
   5. Cada worker ejecuta su algoritmo
   6. Workers reportan tiempos al terminar
   7. Se ordenan resultados y se muestra podio
   ```

3. **Paralelismo Implementado:**
   - Uso de Web Workers API
   - Ejecución simultánea real
   - Comunicación por mensajes
   - Medición independiente de tiempos

#### b. Fotos de la Aplicación

**Capturas necesarias:**

1. **Pantalla Inicial**
   - Muestra la interfaz antes de ejecutar
   - Controles y configuración visible

2. **Carrera en Progreso**
   - Algoritmos ejecutándose (estado "running")
   - Barras de progreso animadas

3. **Resultados Finales**
   - Tarjetas con tiempos completados
   - Podio con los 3 primeros lugares
   - Tabla completa de resultados

4. **Consola del Navegador** (Opcional)
   - Presiona F12 en el navegador
   - Pestaña "Console"
   - Muestra logs de ejecución

**Cómo capturar:**
- Windows: Win + Shift + S
- Mac: Cmd + Shift + 4
- O usa la herramienta Recortes

---

## Instrucciones para Ejecutar y Capturar

### Paso 1: Iniciar Servidor Local

**Opción Python:**
```bash
cd "C:\Users\Crisbel Peralta\Desktop\uni\3-2025\paralelos\proyecto final"
python -m http.server 8000
```

Abre: http://localhost:8000

### Paso 2: Capturas Recomendadas

1. **Captura 1 - Estado Inicial:**
   - Abre la aplicación
   - Captura pantalla completa

2. **Captura 2 - Configuración:**
   - Cambia el tamaño a 10,000 elementos
   - Captura el control de tamaño

3. **Captura 3 - Ejecución:**
   - Click en "Iniciar Carrera"
   - Captura RÁPIDAMENTE mientras ejecutan
   - (Usa arreglo pequeño ~5,000 para tener más tiempo)

4. **Captura 4 - Resultados:**
   - Espera a que termine
   - Captura el podio completo
   - Scroll down y captura la tabla

5. **Captura 5 - Consola:**
   - F12 → Console
   - Captura los logs

### Paso 3: Organizar Capturas

Guarda las imágenes como:
- `01_pantalla_inicial.png`
- `02_configuracion.png`
- `03_ejecucion.png`
- `04_resultados_podio.png`
- `05_resultados_tabla.png`
- `06_consola.png`

---

## Datos para Incluir en la Documentación

### Tabla de Resultados (Ejemplo con 10,000 elementos)

| Posición | Algoritmo | Tiempo (ms) |
|----------|-----------|-------------|
| 1° 🥇 | Quick Sort | ~15-25 ms |
| 2° 🥈 | Insertion Sort | ~50-80 ms |
| 3° 🥉 | Binary Search Sort | ~100-150 ms |
| 4° | Bubble Sort | ~200-400 ms |
| 5° | Sequential Search | ~500-800 ms |

**Nota:** Ejecuta varias veces y promedia los resultados para tu tabla.

---

## Análisis de Resultados (Para la Documentación)

### Preguntas a Responder:

1. **¿Qué algoritmo fue más rápido? ¿Por qué?**
   - Quick Sort por su complejidad O(n log n)

2. **¿Los resultados coinciden con la teoría?**
   - Comparar con tabla de complejidades

3. **¿Cómo afecta el tamaño del arreglo?**
   - Probar con 1,000 / 10,000 / 50,000 elementos

4. **¿Se logró paralelismo real?**
   - Sí, mediante Web Workers

5. **Ventajas de la implementación:**
   - Portabilidad, visual, fácil de usar

---

## Checklist Final

Antes de entregar, verifica que incluiste:

- [ ] Introducción completa
- [ ] Descripción del proyecto
- [ ] Objetivos (general y específicos)
- [ ] Definición de algoritmos paralelos
- [ ] Las 4 etapas explicadas (Partición, Comunicación, Agrupamiento, Asignación)
- [ ] Técnicas algorítmicas paralelas
- [ ] Modelos de algoritmos paralelos
- [ ] Los 5 algoritmos con:
  - [ ] Pseudocódigo
  - [ ] Código JavaScript
  - [ ] Análisis de complejidad
- [ ] Explicación del funcionamiento
- [ ] Mínimo 3-4 capturas de pantalla
- [ ] Tabla de resultados
- [ ] Análisis de resultados
- [ ] Conclusiones

---

## Recursos Adicionales

**Archivos útiles del proyecto:**
- `PSEUDOCODIGOS.md` - Todos los pseudocódigos
- `README.md` - Instrucciones técnicas
- `worker.js` - Código de los algoritmos
- `main.js` - Lógica de paralelismo

**Para profundizar:**
- Busca "Web Workers MDN" para detalles técnicos
- Consulta tus apuntes sobre algoritmos paralelos
- Investiga complejidad algorítmica

---

## Consejos Finales

1. **Ejecuta varias veces** para obtener tiempos consistentes
2. **Prueba diferentes tamaños** de arreglo (pequeño, mediano, grande)
3. **Documenta lo que observas**, no solo lo esperado
4. **Explica con tus palabras** cómo funciona el paralelismo
5. **Usa las capturas** para ilustrar puntos importantes

¡Buena suerte con tu presentación! 🚀
