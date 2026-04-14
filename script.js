const COLORES = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
let codigoSecreto = [];
let intentoActual = [];
let filaActiva = 0;
const MAX_INTENTOS = 10;

function iniciarJuego() {
    codigoSecreto = Array.from({length: 4}, () => COLORES[Math.floor(Math.random() * COLORES.length)]);
    dibujarTablero();
}

function dibujarTablero() {
    const tablero = document.getElementById('tablero');
    for (let i = 0; i < MAX_INTENTOS; i++) {
        const fila = document.createElement('div');
        fila.className = 'fila';
        fila.id = `fila-${i}`;
        
        const huecos = document.createElement('div');
        huecos.className = 'huecos-intento';
        for (let j = 0; j < 4; j++) {
            const h = document.createElement('div');
            h.className = 'hueco';
            huecos.appendChild(h);
        }
        
        const pistas = document.createElement('div');
        pistas.className = 'pistas-grid';
        for (let k = 0; k < 4; k++) {
            const p = document.createElement('div');
            p.className = 'pista-punto';
            pistas.appendChild(p);
        }
        
        fila.appendChild(huecos);
        fila.appendChild(pistas);
        tablero.appendChild(fila);
    }
}

function seleccionarColor(color) {
    if (intentoActual.length < 4) {
        intentoActual.push(color);
        actualizarFilaVisual();
    }
}

function borrarUltimo() {
    intentoActual.pop();
    actualizarFilaVisual();
}

function actualizarFilaVisual() {
    const fila = document.getElementById(`fila-${filaActiva}`);
    const huecos = fila.getElementsByClassName('hueco');
    // Limpiar fila primero
    for(let h of huecos) h.style.backgroundColor = "#002a54";
    // Pintar seleccionados
    intentoActual.forEach((color, i) => {
        huecos[i].style.backgroundColor = color;
    });
}

// --- REEMPLAZAR EN script.js ---

function verificarIntento() {
    if (intentoActual.length < 4) return;

    let rojas = 0;
    let amarillas = 0;

    // Lógica de comparación RIGUROSA (Mastermind Standard)

    // Usaremos marcas para no re-contar fichas
    let marcasCodigo = [false, false, false, false];
    let marcasIntento = [false, false, false, false];

    // PASO 1: Contar Rojas (Coincidencias EXACTAS)
    for (let i = 0; i < 4; i++) {
        if (intentoActual[i] === codigoSecreto[i]) {
            rojas++;
            marcasCodigo[i] = true;
            marcasIntento[i] = true;
        }
    }

    // PASO 2: Contar Amarillas (Coincidencias de COLOR restante)
    // Solo comparamos las fichas que NO fueron marcadas como rojas
    for (let i = 0; i < 4; i++) {
        if (!marcasIntento[i]) { // Si esta ficha del intento NO es roja
            for (let j = 0; j < 4; j++) {
                // Buscamos una ficha del código que NO sea roja Y que NO haya sido ya usada como amarilla
                if (!marcasCodigo[j] && intentoActual[i] === codigoSecreto[j]) {
                    amarillas++;
                    marcasCodigo[j] = true; // Marcamos esta ficha del código como usada para esta pista
                    break; // Pasamos a la siguiente ficha del intento
                }
            }
        }
    }

    // El resto de la función sigue igual...
    mostrarPistas(rojas, amarillas);

    if (rojas === 4) {
        alert("¡Ganaste! Código descifrado.");
        location.reload();
    } else {
        filaActiva++;
        intentoActual = [];
        if (filaActiva === MAX_INTENTOS) {
            alert("Perdiste. El código era: " + codigoSecreto.join(", "));
            location.reload();
        }
    }
}
function mostrarPistas(r, a) {
    const fila = document.getElementById(`fila-${filaActiva}`);
    const puntos = fila.getElementsByClassName('pista-punto');
    let i = 0;
    for (let j = 0; j < r; j++) puntos[i++].style.backgroundColor = 'red';
    for (let j = 0; j < a; j++) puntos[i++].style.backgroundColor = 'white';
}

iniciarJuego();
