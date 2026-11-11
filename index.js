const calculatorKeys = document.querySelector('#calculator');
const visor = document.getElementById("result");
const calculatorQueue = [];
let justCalculated = false;
let errorShown = false;

const arithmeticOperators = {
    sum: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b
};

const isOperatorNode = (el) => el.value in arithmeticOperators;

function calculate() {
    const index = calculatorQueue.findIndex(isOperatorNode);

    // Nothing to calculate: no operator, or no second number yet
    if (index === -1 || index === calculatorQueue.length - 1) return false;

    const a = Number(calculatorQueue.slice(0, index).map(n => n.textContent).join(""));
    const operation = calculatorQueue[index];
    const b = Number(calculatorQueue.slice(index + 1).map(n => n.textContent).join(""));

    if (operation.value === "divide" && b === 0) {
        calculatorQueue.length = 0;
        errorShown = true;
        return false;
    }

    const resultValue = arithmeticOperators[operation.value](a, b);
    const resultNode = document.createElement("button");
    resultNode.classList.add('num');
    resultNode.textContent = resultNode.value = resultValue;

    calculatorQueue.length = 0;      // empty the array in place
    calculatorQueue.push(resultNode);
    justCalculated = true;
    return true;
}

function addToQueue(queue, data) {
    const isNum = data.classList.contains('num');
    const isOperator = data.value in arithmeticOperators;

    // New digit after a result: start a fresh calculation
    if (isNum && justCalculated) {
        queue.length = 0;
        justCalculated = false;
    }

    if (queue.length === 0) {
        if (isNum) queue.push(data);
        return;
    }

    const last = queue[queue.length - 1];
    const lastIsNum = last.classList.contains('num');

    if (isOperator && lastIsNum) {
        // Operator acts like "=" when there is already a full expression
        if (queue.some(isOperatorNode)) {
            if (!calculate()) return;   // nothing calculated or error
        }
        queue.push(data);
        justCalculated = false;         // keep the result, continue with it
    } else if (isNum) {
        queue.push(data);
    }
}

function updateVisor(queue) {
    if (errorShown) {
        visor.textContent = "Error";
        errorShown = false;             // next click clears it
        return;
    }
    visor.textContent = queue.map(el => el.textContent).join(" ");
}

calculatorKeys.addEventListener('click', (e) => {
    if (e.target.classList.contains('num') || e.target.value in arithmeticOperators) {
        addToQueue(calculatorQueue, e.target);
    } else if (e.target.value === "delete") {
        calculatorQueue.pop();
        justCalculated = false;
    } else if (e.target.value === "enter") {
        calculate();
    }

    updateVisor(calculatorQueue);
});