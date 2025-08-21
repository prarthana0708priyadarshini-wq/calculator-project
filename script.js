class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    return;
                }
                computation = prev / current;
                break;
            case 'percentage':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        
        if (this.operation != null) {
            let operationSymbol;
            switch (this.operation) {
                case 'add': operationSymbol = '+'; break;
                case 'subtract': operationSymbol = '-'; break;
                case 'multiply': operationSymbol = '×'; break;
                case 'divide': operationSymbol = '÷'; break;
                case 'percentage': operationSymbol = '%'; break;
            }
            this.previousOperandElement.textContent = 
                `${this.formatNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.getAttribute('data-number'));
                this.updateDisplay();
                this.animateButton(button);
            });
        });

        // Operation buttons
        document.querySelectorAll('[data-operation]').forEach(button => {
            button.addEventListener('click', () => {
                const operation = button.getAttribute('data-operation');
                
                if (operation === 'clear') {
                    this.clear();
                } else if (operation === 'delete') {
                    this.delete();
                } else if (operation === 'equals') {
                    this.compute();
                } else if (operation === 'percentage') {
                    if (this.previousOperand === '') {
                        this.chooseOperation('percentage');
                    } else {
                        this.compute();
                    }
                } else {
                    this.chooseOperation(operation);
                }
                
                this.updateDisplay();
                this.animateButton(button);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            if (/[0-9]/.test(event.key)) {
                this.appendNumber(event.key);
                this.updateDisplay();
            } else if (event.key === '.') {
                this.appendNumber('.');
                this.updateDisplay();
            } else if (event.key === '+') {
                this.chooseOperation('add');
                this.updateDisplay();
            } else if (event.key === '-') {
                this.chooseOperation('subtract');
                this.updateDisplay();
            } else if (event.key === '*') {
                this.chooseOperation('multiply');
                this.updateDisplay();
            } else if (event.key === '/') {
                event.preventDefault();
                this.chooseOperation('divide');
                this.updateDisplay();
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                this.compute();
                this.updateDisplay();
            } else if (event.key === 'Backspace') {
                this.delete();
                this.updateDisplay();
            } else if (event.key === 'Escape') {
                this.clear();
                this.updateDisplay();
            } else if (event.key === '%') {
                this.chooseOperation('percentage');
                this.updateDisplay();
            }
        });
    }

    animateButton(button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 100);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    calculator.updateDisplay();
});

// Additional utility functions for better user experience
function formatNumberForDisplay(number) {
    // Handle very large or small numbers
    if (number.toString().length > 12) {
        return Number(number).toExponential(6);
    }
    return number;
}

// Error handling for invalid operations
window.addEventListener('error', (event) => {
    console.error('Calculator error:', event.error);
    const calculator = new Calculator();
    calculator.currentOperand = 'Error';
    calculator.updateDisplay();
});

