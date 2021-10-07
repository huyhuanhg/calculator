let screenElement = document.querySelector('.screen');
let expressionElement = document.querySelector('.screen .expression');
let equalBox = document.getElementById('equal-box');
let selectBtn = document.getElementById('btn');

// Chú ý: không viết thuật toán tính số độ dài quá lớn
// sẽ có thông báo lỗi nếu số có phần nguyên vượt quá 16 kí tự hoặc dạng e^....


onClick = () => {
    if (screenElement.classList.contains('off')) {
        let msgBox = document.getElementById('msg');
        selectBtn.style.top = '0';

        screenElement.className = 'screen';
        msgBox.innerText = 'Hello!';
        screenElement.classList.add('hello');
        setTimeout(function () {
            screenElement.classList.add('on');
            screenElement.classList.remove('hello');
            expressionElement.innerText = '0';
            equalBox.innerText = '';
        }, 500)
    }
}
offClick = () => {
    if (!screenElement.classList.contains('off')) {
        let msgBox = document.getElementById('msg');

        selectBtn.style.top = '75px';

        screenElement.className = 'screen';
        msgBox.innerText = 'Goodbye!';
        screenElement.classList.add('bye');
        setTimeout(function () {
            screenElement.classList.remove('bye');
            screenElement.classList.add('off');
        }, 500)
    }
}


let btnAC = document.getElementById('reset');
btnAC.onclick = (e) => {
    if (screenElement.classList.contains('on')) {
        screenElement.className = 'screen on';
        expressionElement.innerText = '0';
        equalBox.innerText = '';
    }
}

let backspaceBtn = document.getElementById('backspace');
backspaceBtn.onclick = (e) => {
    if (screenElement.classList.contains('on')) {
        if (screenElement.classList.contains('success')) screenElement.classList.remove('success');
        if (screenElement.classList.contains('error')) screenElement.classList.remove('error');
        if (expressionElement.innerText) {
            if (expressionElement.innerText.length == 1)
                expressionElement.innerText = 0;
            else {
                let innerText = expressionElement.innerText.slice(0, expressionElement.innerText.length - 1);
                innerText = replaceSymbol(innerText);
                expressionElement.innerHTML = innerText;
            }
        }
    }
}

let numberBtn = document.querySelectorAll('button.number');
numberBtn.forEach((btn) => {
    btn.onclick = (e) => {
        if (screenElement.classList.contains('on')) {
            if (screenElement.classList.contains('success') || screenElement.classList.contains('error')) {
                screenElement.className = 'screen on';
                expressionElement.innerText = e.target.innerText;
            } else {
                if (expressionElement.innerText == '0')
                    expressionElement.innerText = e.target.innerText;
                else {
                    if (!(expressionElement.innerText[expressionElement.innerText.length - 1] == ')')) {
                        expressionElement.innerHTML += e.target.innerText;
                    }
                }
            }
        }
    }
})

let operatorBtn = document.querySelectorAll('button.operator');
operatorBtn.forEach((btn) => {
    btn.onclick = (e) => {
        // trường hợp 1: chưa nhập gì
        // trường hợp 2: kí tự cuối là dấu phép toán
        if (screenElement.classList.contains('on')) {
            let key = e.target.innerText;
            let lastE = expressionElement.innerText[expressionElement.innerText.length - 1];
            if (screenElement.classList.contains('error')) screenElement.classList.remove('error');
            if (screenElement.classList.contains('success')) {
                screenElement.classList.remove('success');
                expressionElement.innerHTML = equalBox.innerText + `<span class="operator">${key}</span>`;
            } else {
                if (expressionElement.innerText == '0') {
                    if (key == '-') {
                        expressionElement.innerHTML = `<span class="operator">${key}</span>`;
                    }
                } else if (lastE == '.') {
                    expressionElement.innerHTML = expressionElement.innerHTML
                } else if ((/\+|x|÷|-|\(/).test(lastE)) {
                    if (key == '-') {
                        if (lastE == '-') {
                            let index = expressionElement.innerHTML.lastIndexOf(key);
                            if (expressionElement.innerText[expressionElement.innerText.length - 2] != '(')
                                expressionElement.innerHTML = setCharAt(expressionElement.innerHTML, index, '+')
                            else expressionElement.innerHTML = setCharAt(expressionElement.innerHTML, index, '')
                        } else {
                            if (lastE != '.') {
                                if (lastE == '(') {
                                    expressionElement.innerHTML += `<span class="operator">${key}</span>`;
                                } else {
                                    let index = expressionElement.innerHTML.lastIndexOf(lastE);
                                    expressionElement.innerHTML = setCharAt(expressionElement.innerHTML, index, '-')
                                }
                            }
                        }
                    } else if (lastE == '(') {
                        if (key == '-') {
                            expressionElement.innerHTML += `<span class="operator">${key}</span>`;
                        }
                    } else {
                        let index = expressionElement.innerHTML.lastIndexOf(lastE);
                        if (expressionElement.innerText[expressionElement.innerText.length - 2] != '(')
                            expressionElement.innerHTML = setCharAt(expressionElement.innerHTML, index, key)
                    }
                } else {
                    expressionElement.innerHTML += `<span class="operator">${key}</span>`;
                }
            }
        }
    }
})
let parenthesesBtn = document.querySelectorAll('button.parentheses');
parenthesesBtn.forEach((btn) => {
    btn.onclick = (e) => {
        if (screenElement.classList.contains('on')) {
            let key = e.target.innerText;
            let lastE = expressionElement.innerText[expressionElement.innerText.length - 1];
            if (screenElement.classList.contains('success') || screenElement.classList.contains('error')) {
                if (key === '(') {
                    screenElement.className = 'screen on';
                    expressionElement.innerText = key;
                }
            } else {
                if (key == '(') {
                    if ((!Number(lastE) && expressionElement.innerText != '0') && lastE != '.' && lastE != ')') {
                        expressionElement.innerHTML += `<span class="parentheses">${key}</span>`;
                    }
                } else {
                    let openPth = countOpenPth(expressionElement.innerText);
                    if (openPth) {
                        if (typeof Number(lastE) === 'number' && expressionElement.innerText != '0') {
                            expressionElement.innerHTML += `<span class="parentheses">${key}</span>`;
                        }
                    }
                }
            }
        }
    }
})

let decimalPointBtn = document.getElementById('decimal-point');
decimalPointBtn.onclick = (e) => {
    if (screenElement.classList.contains('on')) {
        let lastE = expressionElement.innerText[expressionElement.innerText.length - 1];
        if (screenElement.classList.contains('success') || screenElement.classList.contains('error')) {
            screenElement.className = 'screen on';
            expressionElement.innerText = '0.';

        } else {
            if ((/\+|x|÷|-|\(/).test(lastE)) {
                expressionElement.innerHTML += `0.`;
            } else {
                let existDP = checkExistDP(expressionElement.innerText);
                if (existDP) {
                    expressionElement.innerHTML += `.`;
                }
            }
        }
    }
}


let equalBtn = document.getElementById('equal-btn');
equalBtn.onclick = () => {
    if (screenElement.classList.contains('on')) {
        let expression = deleteResidual(expressionElement.innerText);
        expressionElement.innerHTML = replaceSymbol(expression);
        expression = addClosingPth(expression)
        expression = setOperator(expression);
        while (existParentheses(expression)) {
            let indexParentheses = getOpenAndClosePth(expression);
            let childExpression = expression.substring(indexParentheses.start, indexParentheses.end + 1);
            expression = expression.replace(childExpression, '$');
            childExpression = calculate(childExpression);
            expression = expression.replace('$', childExpression);
        }
        if (!Number(expression) && Number(expression) != 0) {
            expression = calculate(expression);
        }
        if (expression) {
            if (Number(expression) === 0) expression = Number(expression);
            if (expression) {
                if (expression.split('.')[0].length <= 16 && expression.indexOf('e') === -1) {
                    equalBox.innerText = expression;
                    screenElement.classList.add('success');
                } else {
                    screenElement.classList.add('error');
                }
            } else {
                equalBox.innerText = expression;
                screenElement.classList.add('success');
            }
        } else {
            screenElement.classList.add('error');
        }
    }
}


function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

function addClosingPth(str) {
    let count = 0;
    for (let value of str) {
        if (value == '(') count++;
        if (value == ')') count--;
    }
    if (count) {
        for (let i = 1; i <= count; i++) {
            str += ')';
        }
    }
    return str;
}

function replaceSymbol(str) {
    str = str.replaceAll('x', '<span class="operator">x</span>')
    str = str.replaceAll('-', '<span class="operator">-</span>')
    str = str.replaceAll('+', '<span class="operator">+</span>')
    str = str.replaceAll('÷', '<span class="operator">÷</span>')
    str = str.replaceAll('(', '<span class="parentheses">(</span>')
    str = str.replaceAll(')', '<span class="parentheses">)</span>')
    return str;
}

function deleteResidual(str) {
    let reg = /\+|-|x|÷|\.|\(/;
    while (reg.test(str[str.length - 1])) {
        str = str.substring(0, str.length - 1);
    }
    return str;
}


function setOperator(str) {
    str = str.replaceAll('÷', '/')
    str = str.replaceAll('x', '*')
    return str;
}

function countOpenPth(str) {
    let count = 0;
    for (let value of str) {
        if (value == '(') count++;
        if (value == ')') count--;
    }
    return count;
}

function checkExistDP(str) {
    let reg = /\+|-|x|÷|\)|\(/;
    let number = str.split(reg);
    if (number[number.length - 1] != '') {
        for (let value of number[number.length - 1]) {
            if (value == '.') {
                return false;
            }
        }
    } else return false;
    return true;
}

function getNumbers(str, operators) {
    let beforeNumber = '';
    let indexBefore;
    let indexAfter;
    let afterNumber = '';
    let operator = false;
    let operatorIndex;

    for (let i = 1; i < str.length; i++) {
        if (operators.includes(str[i])) {
            operator = str[i];
            operatorIndex = i;
            break;
        }
    }
    for (let i = operatorIndex - 1; i >= 0; i--) {
        if (Number(str[i]) || str[i] === '0' || str[i] === '.') {
            beforeNumber = str[i] + beforeNumber;
            if (i === 0) {
                indexBefore = 0;
            }
        } else {
            if (str[i] === '-') {
                if (i === 0 || str[i - 1] === '+') {
                    beforeNumber = str[i] + beforeNumber;
                    indexBefore = i;
                    break;
                } else {
                    indexBefore = i + 1;
                    break;
                }
            } else {
                indexBefore = i + 1;
                break;
            }
        }
    }
    for (let i = operatorIndex + 1; i < str.length; i++) {
        if (Number(str[i]) || str[i] === '0' || i === operatorIndex + 1 || str[i] === '.') {
            afterNumber += str[i];
            if (i === str.length - 1) indexAfter = i;
        } else {
            indexAfter = i - 1;
            break;
        }
    }
    return {
        before: beforeNumber,
        iBefore: indexBefore,
        after: afterNumber,
        iAfter: indexAfter,
        operator: operator,
    }
}


function calculate(str) {
    // nhân chia trước cộng trừ sau
    while (str[0] == '(') {
        str = str.substring(1, str.length - 1);
    }
    str = multiplication(str);
    if (str === false) return false;
    str = plusAndMinus(str);
    return str;
}

function getOpenAndClosePth(str) {
    let indexOpen;
    let indexClose;
    for (let i = 0; i < str.length; i++) {
        if ((/\(/).test(str[i])) indexOpen = i;
        if ((/\)/).test(str[i])) {
            indexClose = i;
            break;
        }
    }
    return {
        start: indexOpen,
        end: indexClose
    };
}

function existParentheses(str) {
    for (let value of str) {
        if ((/\(/).test(value)) return true;
    }
    return false;
}


// Tính toán
/**
 * phép nhân va chia
 */
function multiplication(str) {
    while (str.indexOf('*') !== -1 || str.indexOf('/') !== -1) {
        let numbers = getNumbers(str, ['*', '/']);
        let childExpression = numbers.before + numbers.operator + numbers.after;
        str = str.slice(0, numbers.iBefore) + '$' + str.slice(numbers.iAfter + 1);
        if (numbers.operator === '/') {
            if (Number(numbers.after) !== 0) {
                childExpression = Number(numbers.before / numbers.after);
            } else return false;
        } else {
            childExpression = Number(numbers.before * numbers.after);
        }
        str = str.replace('$', String(childExpression));
    }
    return str;
}


/**
 * phép cộng và trừ
 */
function plusAndMinus(str) {
    while ((str.indexOf('+') !== -1 || str.indexOf('-') !== -1)) {
        let numbers = getNumbers(str, ['+', '-']);
        if (numbers.before == '') break;
        let childExpression = numbers.before + numbers.operator + numbers.after;
        str = str.replace(childExpression, '$');
        if (numbers.operator === '+') {
            childExpression = String(Number(Number(numbers.before) + Number(numbers.after)));
        } else {
            childExpression = String(Number(Number(numbers.before) - Number(numbers.after)));
        }
        let lengthDecimalNum1 = numbers.before.split('.')[1] === undefined ? 0 : numbers.before.split('.')[1].length;
        let lengthDecimalNum2 = numbers.after.split('.')[1] === undefined ? 0 : numbers.after.split('.')[1].length;
        let maxAfterDecimal = lengthDecimalNum1 > lengthDecimalNum2 ? lengthDecimalNum1 : lengthDecimalNum2;

        if (maxAfterDecimal) {
            let lengthDecimalNumEqual = childExpression.split('.')[1] === undefined ? 0 : childExpression.split('.')[1].length;
            if (lengthDecimalNumEqual > maxAfterDecimal) {
                let x = childExpression.split('.')[1].slice(0, maxAfterDecimal);
                let y = childExpression.split('.')[1].slice(maxAfterDecimal, childExpression.split('.')[1].length)
                childExpression = childExpression.split('.')[0] + '.' + Math.round(Number(x + '.' + y))
            }
        }

        str = str.replace('$', childExpression);
    }


    return str;
}
