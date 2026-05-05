const display = document.querySelector(".calculator-display")
const keypad = document.querySelector(".calculator-keypad")

if (!display) {
  throw new Error("No se encontró el display de la calculadora")
}

if (!keypad) {
  throw new Error("No se encontró el keypad de la calculadora")
}

const calculatorState = {
  currentValue: "0",
  previousValue: null,
  operator: null
}

const buttons = [
  { label: "7", type: "number" },
  { label: "8", type: "number" },
  { label: "9", type: "number" },
  { label: "/", type: "operator" },
  { label: "4", type: "number" },
  { label: "5", type: "number" },
  { label: "6", type: "number" },
  { label: "*", type: "operator" },
  { label: "1", type: "number" },
  { label: "2", type: "number" },
  { label: "3", type: "number" },
  { label: "-", type: "operator" },
  { label: "0", type: "number" },
  { label: "C", type: "clear" },
  { label: "=", type: "equals" },
  { label: "+", type: "operator" }
]

function renderDisplay () {
  display.textContent = calculatorState.currentValue
}

function createButton () {
  const button = document.createElement("button")
  return button
}

buttons.forEach(function (buttonConfig) {
  const button = createButton()

  button.textContent = buttonConfig.label
  button.dataset.type = buttonConfig.type
  button.dataset.value = buttonConfig.label
  button.classList.add("calculator-button")

  if (buttonConfig.type === "operator") {
    button.classList.add("operator")
  }

  keypad.append(button)
})

function handleNumber (value) {
  if (calculatorState.currentValue === "0") {
    calculatorState.currentValue = value
    return
  }

  calculatorState.currentValue += value
}

function handleOperator (operator) {
  calculatorState.previousValue = calculatorState.currentValue
  calculatorState.operator = operator
  calculatorState.currentValue = "0"
}

function clearCalculator () {
  calculatorState.currentValue = "0"
  calculatorState.previousValue = null
  calculatorState.operator = null
}

function calculateResult () {
  if (calculatorState.previousValue === null || calculatorState.operator === null) {
    return
  }

  const previous = Number(calculatorState.previousValue)
  const current = Number(calculatorState.currentValue)
  let result = 0

  if (calculatorState.operator === "+") {
    result = previous + current
  }

  if (calculatorState.operator === "-") {
    result = previous - current
  }

  if (calculatorState.operator === "*") {
    result = previous * current
  }

  if (calculatorState.operator === "/") {
    result = previous / current
  }

  calculatorState.currentValue = String(result)
  calculatorState.previousValue = null
  calculatorState.operator = null
}

function buttonPress (event) {
  const button = event.target.closest("button")

  if (!button) {
    return
  }

  const type = button.dataset.type
  const value = button.dataset.value

  console.log("Button clicked:", type, value)

  if (type === "number") {
    handleNumber(value)
  }

  if (type === "operator") {
    handleOperator(value)
  }

  if (type === "clear") {
    clearCalculator()
  }

  if (type === "equals") {
    calculateResult()
  }

  renderDisplay()
}

keypad.addEventListener("click", buttonPress)