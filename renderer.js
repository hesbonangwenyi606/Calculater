const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let memory = 0;

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;

    switch(action) {

      // Numbers and decimal
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
      case '.':
        if (currentInput === '0' && action !== '.') {
          currentInput = action;
        } else {
          currentInput += action;
        }
        display.textContent = currentInput;
        break;

      // Operators
      case '+': case '-': case '*': case '/': case '%':
        currentInput += ` ${action} `;
        display.textContent = currentInput;
        break;

      // Functions
      case 'sqrt':
        try {
          currentInput = Math.sqrt(eval(currentInput)).toString();
          display.textContent = currentInput;
        } catch {
          display.textContent = 'Error';
          currentInput = '';
        }
        break;

      case 'power':
        currentInput += ' ** ';
        display.textContent = currentInput;
        break;

      case '=':
        try {
          currentInput = eval(currentInput).toString();
          display.textContent = currentInput;
        } catch {
          display.textContent = 'Error';
          currentInput = '';
        }
        break;

      case 'C':
        currentInput = '';
        display.textContent = '0';
        break;

      // Memory buttons
      case 'MC':
        memory = 0;
        break;

      case 'MR':
        currentInput += memory;
        display.textContent = currentInput;
        break;

      case 'M+':
        memory += Number(eval(currentInput) || 0);
        break;

      case 'M-':
        memory -= Number(eval(currentInput) || 0);
        break;
    }
  });
});
