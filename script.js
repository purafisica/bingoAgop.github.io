// Autor: augusalterats
// Propósito: Lógica para el funcionamiento del tablero de Bingo
document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const generateBtn = document.getElementById("generate-btn");
    const resetBtn = document.getElementById("reset-btn");
    const sortBtn = document.getElementById("sort-btn");
    const undoBtn = document.getElementById("undo-btn");
    const manualCheckbox = document.getElementById("manual-checkbox");
    const aleatorioCheckbox = document.getElementById("aleatorio-checkbox");
    const manualSelectContainer = document.getElementById("manual-select-container");
    const manualNumberSelect = document.getElementById("manual-number");
    const currentNumberDisplay = document.getElementById("current-number");
    const maxNumbers = 90;
    const generatedNumbers = [];
    let lastNumberBox = null;
    let contador = 0;
    const dateActual = new Date();
    const anoActual = dateActual.getFullYear(); 
    document.getElementById("titulo").innerText = 'Té Bingo '+ anoActual + ' - Colegio Secundario "Agop Seferian"';
    // Crear opciones para el select solo una vez
    for (let i = 1; i <= maxNumbers; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i.toString().padStart(2, '0');
        manualNumberSelect.appendChild(option);
    }

    manualCheckbox.addEventListener("change", function () {
        playSound('sound/action.mp3');
        aleatorioCheckbox.checked = !manualCheckbox.checked;
        manualSelectContainer.hidden = !manualCheckbox.checked;
        generateBtn.innerText = 'Cargar';
        currentNumberDisplay.style.display = 'none'; // Ocultar el número actual
        resetForm();
        toggleGenerateButton();
    });

    aleatorioCheckbox.addEventListener("change", function () {
        playSound('sound/action.mp3');
        manualCheckbox.checked = !aleatorioCheckbox.checked;
        manualSelectContainer.hidden = aleatorioCheckbox.checked;
        generateBtn.innerText = 'Generar';
        currentNumberDisplay.style.display = 'none'; // Ocultar el número actual
        resetForm();
        toggleGenerateButton();
    });

    generateBtn.addEventListener("click", function () {
        document.getElementById('escudo').hidden = true;

        let selectedNumber;

        if (manualCheckbox.checked) {
            selectedNumber = parseInt(manualNumberSelect.value);
            if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > maxNumbers) {
                document.getElementById("contador").hidden = true;
                showMessage("Por favor, seleccione un número válido.", "danger");
                playSound('sound/alerta.mp3');
                return;
            }
            if (generatedNumbers.includes(selectedNumber)) {
                showMessage("Este número ya ha sido generado.", "danger");
                playSound('sound/alerta.mp3');
                return;
            }
            playSound('sound/ok.mp3');
            // Eliminar la opción seleccionada del select
            manualNumberSelect.querySelector(`option[value="${selectedNumber}"]`).remove();
        } else {
            if (generatedNumbers.length >= maxNumbers) {
                showMessage("Se han generado todos los números.", "info");
                return;
            } else {
                playSound('sound/ok.mp3');
            }

            do {
                selectedNumber = Math.floor(Math.random() * maxNumbers) + 1;
            } while (generatedNumbers.includes(selectedNumber));
        }

        contador += 1; // Incrementar el contador en ambos modos
        generatedNumbers.push(selectedNumber);

        // Mostrar el número generado en grande y azul
        currentNumberDisplay.textContent = '👉' + selectedNumber.toString().padStart(2, '0');
        currentNumberDisplay.style.display = 'block';

        setTimeout(() => {
            const numberBox = document.createElement("div");
            numberBox.classList.add("col", "number-box", "recent");
            numberBox.textContent = selectedNumber.toString().padStart(2, '0');
            board.appendChild(numberBox);

            if (lastNumberBox) {
                lastNumberBox.classList.remove("recent");
                lastNumberBox.classList.add("show");
            }

            // Cambiar color del último número por 3 segundos
            numberBox.classList.add("recent");
            setTimeout(() => {
                numberBox.classList.remove("recent");
                numberBox.classList.add("show");
            }, 2000); // 2 segundos

            // Añadir evento para cambiar color a verde (Bootstrap 5 bg-success) al hacer clic
            numberBox.addEventListener("click", function () {
                this.classList.toggle("bg-danger");
            });

            undoBtn.disabled = false;
            sortBtn.disabled = false;

            lastNumberBox = numberBox;
            document.getElementById('contador').hidden = false;
            document.getElementById('contador').innerText = 'Cantidad de números: ' + contador;
            toggleGenerateButton();
        }, 1500); // Esperar 1.5 segundos antes de mover el número al tablero
    });

    sortBtn.addEventListener("click", function () {
        if (generatedNumbers.length < 2) {
            showMessage("No hay números para ordenar.", "danger");
            return;
        }
        if (contador > 1) {
            playSound('sound/action.mp3');
            const numberBoxes = Array.from(board.getElementsByClassName("number-box"));
            numberBoxes.sort((a, b) => parseInt(a.textContent) - parseInt(b.textContent));

            // Vaciar el tablero y volver a añadir los elementos ordenados
            board.innerHTML = '';
            numberBoxes.forEach(box => board.appendChild(box));

            // Actualizar la referencia a lastNumberBox
            if (numberBoxes.length > 0) {
                lastNumberBox = numberBoxes[0];
            }
            undoBtn.disabled = true;
            sortBtn.disabled = true;
        };
    });

    resetBtn.addEventListener("click", resetForm);

    undoBtn.addEventListener("click", function () {
        if (generatedNumbers.length === 0) {
            showMessage("No hay números para eliminar.", "danger");
            return;
        }

        playSound('sound/action.mp3');

        // Eliminar el último número del array y del DOM
        const lastNumber = generatedNumbers.pop();
        if (generatedNumbers.length > 0) {
            const penultimoNumber = generatedNumbers[generatedNumbers.length - 1];
            currentNumberDisplay.textContent = '👉' + penultimoNumber.toString().padStart(2, '0');
            const lastNumberBox = board.querySelector(`.number-box:last-child`);
            lastNumberBox.remove();
        }

        // Decrementar el contador
        contador -= 1;
        document.getElementById('contador').innerText = 'Cantidad de números: ' + contador;

        // Reagregar la opción al select en modo manual
        if (manualCheckbox.checked) {
            const option = document.createElement("option");
            option.value = lastNumber;
            option.textContent = lastNumber.toString().padStart(2, '0');
            manualNumberSelect.appendChild(option);
            const optionsArray = Array.from(manualNumberSelect.options);

            // Ordenar las opciones por el valor numérico
            optionsArray.sort((a, b) => parseInt(a.value) - parseInt(b.value));

            // Vaciar el select y volver a añadir las opciones ordenadas
            manualNumberSelect.innerHTML = '';
            optionsArray.forEach(opt => manualNumberSelect.appendChild(opt));

        }

        // Actualizar la visibilidad del botón de generar número
        toggleGenerateButton();

        // Si no hay más números, ocultar el contador
        if (generatedNumbers.length === 0) {
            document.getElementById('contador').hidden = true;
            currentNumberDisplay.style.display = 'none'; // Ocultar el número actual
            resetForm();
        }

    });

    function resetForm() {
        playSound('sound/action.mp3');
        contador = 0;
        document.getElementById('escudo').hidden = false;
        document.getElementById('contador').hidden = true;
        board.innerHTML = '';
        generatedNumbers.length = 0;
        lastNumberBox = null;
        currentNumberDisplay.style.display = 'none'; // Ocultar el número actual al reiniciar

        // Resetear el select
        manualNumberSelect.innerHTML = ''; // Limpiar opciones anteriores

        // Agregar la opción predeterminada
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione un número";
        manualNumberSelect.appendChild(defaultOption);

        // Agregar las opciones numéricas
        for (let i = 1; i <= maxNumbers; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            manualNumberSelect.appendChild(option);
        }
        undoBtn.disabled = false;
        sortBtn.disabled = false;
        manualNumberSelect.value = "";
        toggleGenerateButton();
    }

    function toggleGenerateButton() {
        generateBtn.disabled = (generatedNumbers.length >= maxNumbers);
        if (generatedNumbers.length >= maxNumbers) {
            showMessage("Se han generado todos los números.", "info")
        }
    }

    function showMessage(message, type = 'warning') {
        const messageContainer = document.createElement('div');
        messageContainer.className = `alert alert-${type} mt-3`;
        messageContainer.role = 'alert';
        messageContainer.textContent = message;
        board.insertBefore(messageContainer, board.firstChild);

        setTimeout(() => {
            messageContainer.remove();
        }, 3000);
    }

    function playSound(dirSound) {
        const audio = new Audio(dirSound);
        audio.play();
    }
});