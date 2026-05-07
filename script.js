const display = document.querySelector(".calculator-display")
const keypad = document.querySelector(".calculator-keypad")
const historyContainer = document.querySelector(".history-list")
const historyClearButton = document.querySelector(".history-clear")

if (!display) {
  throw new Error("No se encontró el display de la calculadora")
}

if (!keypad) {
  throw new Error("No se encontró el keypad de la calculadora")
}

if (!historyContainer) {
  throw new Error("No se encontró el contenedor de historial de la calculadora")
}

if (!historyClearButton) {
  throw new Error("No se encontró el botón para limpiar historial")
}

const BUTTONS = [
  { label: "C", type: "clear" },
  { label: "←", type: "delete" },
  { label: "/", type: "operator" },
  { label: "*", type: "operator" },

  { label: "7", type: "number" },
  { label: "8", type: "number" },
  { label: "9", type: "number" },
  { label: "-", type: "operator" },

  { label: "4", type: "number" },
  { label: "5", type: "number" },
  { label: "6", type: "number" },
  { label: "+", type: "operator" },

  { label: "1", type: "number" },
  { label: "2", type: "number" },
  { label: "3", type: "number" },
  { label: "=", type: "equals" },

  { label: "", type: "empty" },
  { label: "0", type: "number" },
  { label: ".", type: "decimal" },
  { label: "+/-", type: "sign" }
]

class History {
  #container
  #entries = []
  
  constructor (container) {
    if (!container) {
      throw new Error("No se proporcionó un contenedor para el historial") /*History requires a DOM container*/
    }
    this.#container = container
  }

  addEntry (expression, result) {
    this.#entries.push({ expression, result })
    this.#render()
  }

  clear () {
    this.#entries = []
    this.#render()
  }

  #render () {
    this.#container.replaceChildren() 

    this.#entries.forEach((entry) => {
      const item = document.createElement("li")
      item.textContent = `${entry.expression} = ${entry.result}`
      this.#container.appendChild(item)
    })
  }
}

class Calculator {
  static OPERATIONS = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b === 0 ? "Error" : a / b) /*"/": (a, b) => a / b*/
  }

  #display
  #history
  #state = {
    currentValue: "0",
    previousValue: null,
    operator: null,
    shouldResetDisplay: false
  }

  constructor (display, history) {
    if (!display) {
      throw new Error("No se proporcionó un display para la calculadora")  /*Calculator requires a display*/
    }
    if (!history) {
      throw new Error("No se proporcionó un historial para la calculadora") /*Calculator requires a history*/
    }

    this.#display = display
    this.#history = history
  }

  handleNumber (value) {
    if (this.#state.currentValue === "0" || 
        this.#state.currentValue === "Error" || 
        this.#state.shouldResetDisplay
    ) {

      this.#state.currentValue = value
      this.#state.shouldResetDisplay = false

    } else {
      this.#state.currentValue += value
    }
    this.#render()
  }

  handleOperator (operator) {
    if (this.#state.currentValue === "Error") {
      return
    }

    if (this.#state.operator !== null) {
      this.calculate(false)
    }

    this.#state.previousValue = this.#state.currentValue
    this.#state.operator = operator
    this.#state.currentValue = ""

    this.#render()
  }

  handleDelete() {
    if (this.#state.currentValue.length === 1) {
      this.#state.currentValue = "0"
    } else {
      this.#state.currentValue =
        this.#state.currentValue.slice(0, -1)
    }

    this.#render()
  }

  handleDecimal() {
    if (this.#state.currentValue.includes(".")) {
      return
    }

    this.#state.currentValue += "."

    this.#render()
  }

  handleSign() {
  if (this.#state.currentValue === "0") {
    this.#state.currentValue = "-"
    this.#render()
    return
  }

  if (this.#state.currentValue.startsWith("-")) {
    this.#state.currentValue =
      this.#state.currentValue.slice(1)
  } else {
    this.#state.currentValue =
      "-" + this.#state.currentValue
  }

  this.#render()
}

  clear() {
    this.#state.currentValue = "0"
    this.#state.previousValue = null
    this.#state.operator = null
    this.#render()
  }

  calculate(saveToHistory = true) {
    if (this.#state.previousValue === null || this.#state.operator === null) {
      return
    }

    if (this.#state.currentValue === "") {
      return
    }

    const previous = Number(this.#state.previousValue)
    const current = Number(this.#state.currentValue)
    const operator = this.#state.operator

    const result = Calculator.OPERATIONS[operator](previous, current)
    const roundedResult = Number(result.toFixed(10))

    const expression = `${previous} ${operator} ${current}`

    if (saveToHistory) {
      this.#history.addEntry(expression, roundedResult)
    }

    this.#state.currentValue = String(roundedResult)
    this.#state.previousValue = null
    this.#state.operator = null
    this.#state.shouldResetDisplay = true

    this.#render()
  }

  #render() {
  if (this.#state.operator !== null) {

    if (this.#state.currentValue === "") {
      this.#display.textContent =
        `${this.#state.previousValue} ${this.#state.operator}`
      } else {
        this.#display.textContent =
          `${this.#state.previousValue} ${this.#state.operator} ${this.#state.currentValue}`
      }

  } else {
      this.#display.textContent = this.#state.currentValue
  }
}
}

const history = new History(historyContainer)
const calculator = new Calculator(display, history)

BUTTONS.forEach((buttonConfig) => {
  const button = document.createElement("button")

  button.textContent = buttonConfig.label
  button.dataset.type = buttonConfig.type
  button.dataset.value = buttonConfig.label
  button.classList.add("calculator-button")

  if (buttonConfig.type === "operator") {
    button.classList.add("operator")
  }

  if (buttonConfig.type === "clear") {
    button.classList.add("clear")
  }

  if (buttonConfig.type === "equals") {
    button.classList.add("equals")
  }

  if (buttonConfig.type === "delete") {
  button.classList.add("delete")
  }

  if (buttonConfig.type === "decimal") {
  button.classList.add("decimal")
  }

  if (buttonConfig.type === "empty") {
  button.style.visibility = "hidden"
  }

  keypad.appendChild(button)
})

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button")

  if (!button) {
    return
  }

  const type = button.dataset.type
  const value = button.dataset.value

  //console.log("Button clicked:", type, value)

  if (type === "number") {
    calculator.handleNumber(value)
  }

  if (type === "operator") {
    calculator.handleOperator(value)
  }

  if (type === "clear") {
    calculator.clear()
  }

  if (type === "delete") {
    calculator.handleDelete()
  }

  if (type === "decimal") {
    calculator.handleDecimal()
  }

  if (type === "sign") {
  calculator.handleSign()
}

  if (type === "equals") {
    calculator.calculate()
  }
})

historyClearButton.addEventListener("click", () => {
  history.clear()
})