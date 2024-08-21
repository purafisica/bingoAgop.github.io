document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const generateBtn = document.getElementById("generate-btn");
    const resetBtn = document.getElementById("reset-btn");
    const manualCheckbox = document.getElementById("manual-checkbox");
    const aleatorioCheckbox = document.getElementById("aleatorio-checkbox");
    const manualSelectContainer = document.getElementById("manual-select-container");
    const manualNumberSelect = document.getElementById("manual-number");
    const currentNumberDisplay = document.getElementById("current-number"); // Referencia al <div> que muestra el número actual
    const maxNumbers = 90;
    const generatedNumbers = [];
    let lastNumberBox = null;
    let contador = 0;

    // Crear opciones para el select solo una vez
    for (let i = 1; i <= maxNumbers; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i.toString().padStart(2, '0');
        manualNumberSelect.appendChild(option);
    }

    manualCheckbox.addEventListener("change", function () {
        aleatorioCheckbox.checked = !manualCheckbox.checked;
        manualSelectContainer.hidden = !manualCheckbox.checked;
        currentNumberDisplay.style.display = 'none'; // Ocultar el número actual
        resetForm();
        toggleGenerateButton();
    });

    aleatorioCheckbox.addEventListener("change", function () {
        manualCheckbox.checked = !aleatorioCheckbox.checked;
        manualSelectContainer.hidden = aleatorioCheckbox.checked;
        currentNumberDisplay.style.display = 'none'; // Ocultar el número actual
        resetForm();
        toggleGenerateButton();
    });

    generateBtn.addEventListener("click", function () {
        document.getElementById('escudo').hidden = true;
        document.getElementById('contador').hidden = false;

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

            lastNumberBox = numberBox;
            document.getElementById('contador').innerText = 'Cantidad de números: ' + contador;
            toggleGenerateButton();
        }, 1500); // Esperar 1.5 segundos antes de mover el número al tablero

    });

    resetBtn.addEventListener("click", resetForm);

    function resetForm() {
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
