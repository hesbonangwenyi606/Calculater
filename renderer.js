// renderer.js - UI logic and calculator engine
(() => {
  const display = document.getElementById('display');
  let memory = 0;
  let current = '0';

  function updateDisplay() {
    display.textContent = current;
  }

  function append(char) {
    if (current === '0' && char !== '.') current = char;
    else current += char;
    updateDisplay();
  }

  function clear() {
    current = '0';
    updateDisplay();
  }

  function backspace() {
    if (current.length <= 1) current = '0';
    else current = current.slice(0, -1);
    updateDisplay();
  }

  function applyUnary(fn) {
    try {
      const val = safeEval(current);
      let res = val;
      if (fn === 'sqrt') res = Math.sqrt(val);
      updateDisplay();
      current = String(res);
      updateDisplay();
    } catch (e) {
      alert('Invalid operation');
    }
  }

  function calculate() {
    try {
      const res = safeEval(current);
      current = (Number.isFinite(res) && Number.isInteger(res)) ? String(parseInt(res)) : String(res);
      updateDisplay();
    } catch (e) {
      alert('Calculation error: ' + e.message);
    }
  }

  // Memory ops
  function memoryClear(){ memory = 0; }
  function memoryRecall(){ current = String(memory); updateDisplay(); }
  function memoryAdd(){ try{ memory += Number(safeEval(current)); }catch{} }
  function memorySub(){ try{ memory -= Number(safeEval(current)); }catch{} }

  // Button handling
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = btn.getAttribute('data-action');
      if (!isNaN(a)) append(a);
      else if (a === '.') append('.');
      else if (a === 'C') clear();
      else if (a === '=') calculate();
      else if (a === 'sqrt') applyUnary('sqrt');
      else if (a === 'power') append('**');
      else if (a === 'MC') memoryClear();
      else if (a === 'MR') memoryRecall();
      else if (a === 'M+') memoryAdd();
      else if (a === 'M-') memorySub();
      else if (['+','-','*','/','%','(',')'].includes(a)) append(a);
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if ((/[\d]/).test(key)) append(key);
    else if (key === 'Enter') calculate();
    else if (key === 'Backspace') backspace();
    else if (key === 'c' || key === 'C') clear();
    else if ('+-*/%.()'.includes(key)) append(key);
  });

  // A simple "safe" evaluator: replace known math names with Math.* and restrict characters.
  function safeEval(expr) {
    // normalize unicode chars
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/').trim();

    // allow only numbers, operators, letters, parentheses, decimal point, and asterisks
    if (!/^[0-9+\-*/%().eE\sA-Za-z*_]+$/.test(expr)) {
      throw new Error('Disallowed characters');
    }

    // replace power operator caret (if used) with ** (we use ** when 'power' appended)
    expr = expr.replace(/\^/g, '**');

    // map constants and functions to Math
    const replacements = {
      '\\bpi\\b': 'Math.PI',
      '\\be\\b': 'Math.E',
      '\\bsqrt\\s*\\(': 'Math.sqrt(',
      '\\bsin\\s*\\(': 'Math.sin(',
      '\\bcos\\s*\\(': 'Math.cos(',
      '\\btan\\s*\\(': 'Math.tan('),
    };

    for (const [k, v] of Object.entries(replacements)) {
      expr = expr.replace(new RegExp(k, 'g'), v);
    }

    // Prevent access to global objects by disallowing "Math." occurrences other than our injected ones?
    // We will use Function to evaluate — acceptable for a local desktop app.
    // Still, avoid accidental identifiers by rejecting double-underscores.
    if (expr.includes('__')) throw new Error('Unsafe expression');

    // Evaluate
    // eslint-disable-next-line no-new-func
    const fn = new Function('return ' + expr + ';');
    const result = fn();

    if (typeof result === 'number' && !Number.isFinite(result)) {
      throw new Error('Non-finite result');
    }
    return result;
  }

  updateDisplay();
})();
