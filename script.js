document.getElementById('quadratic-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const c = parseFloat(document.getElementById('c').value);

    const discriminant = b * b - 4 * a * c;
    let resultText = '';

    if (discriminant > 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        resultText = `The roots are real and different: x1 = ${root1.toFixed(2)}, x2 = ${root2.toFixed(2)}`;
    } else if (discriminant === 0) {
        const root = -b / (2 * a);
        resultText = `The roots are real and the same: x = ${root.toFixed(2)}`;
    } else {
        const realPart = (-b / (2 * a)).toFixed(2);
        const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
        resultText = `The roots are complex: x1 = ${realPart} + ${imaginaryPart}i, x2 = ${realPart} - ${imaginaryPart}i`;
    }

    document.getElementById('result').innerText = resultText;
});

document.getElementById('derivative-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const equation = document.getElementById('equation').value;
    const derivative = calculateDerivative(equation);

    if (derivative) {
        document.getElementById('derivative-result').innerText = `The derivative is: ${derivative}`;
    } else {
        document.getElementById('derivative-result').innerText = 'Invalid equation format. Please enter in the correct form.';
    }
});

document.getElementById('graph-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const equation = document.getElementById('graph-equation').value;
    graphEquation(equation);
});

function calculateDerivative(equation) {
    try {
        const parsedEquation = math.parse(equation);
        const derivative = math.derivative(parsedEquation, 'x').toString();
        return derivative;
    } catch (error) {
        return null;
    }
}

function graphEquation(equation) {
    try {
        const parsedEquation = math.parse(equation);
        const compiledEquation = parsedEquation.compile();

        const xValues = math.range(-10, 10, 0.1).toArray();
        const yValues = xValues.map(function(x) {
            const y = compiledEquation.evaluate({ x: x });
            // Replace extremely large values with NaN to handle discontinuities
            return Math.abs(y) > 1e10 ? NaN : y;
        });

        const trace = {
            x: xValues,
            y: yValues,
            type: 'scatter'
        };

        const data = [trace];
        const layout = {
            title: `Graph of ${equation}`,
            xaxis: { title: 'x' },
            yaxis: { title: 'y' }
        };

        Plotly.newPlot('graph-container', data, layout);
        openModal();
    } catch (error) {
        document.getElementById('graph-result').innerText = 'Invalid equation format. Please enter in the correct form.';
    }
}

function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = 'none';
    }
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

function resetForm() {
    document.getElementById('quadratic-form').reset();
    document.getElementById('derivative-form').reset();
    document.getElementById('graph-form').reset();
    document.getElementById('result').innerText = '';
    document.getElementById('derivative-result').innerText = '';
    document.getElementById('graph-result').innerText = '';
}

function openModal() {
    document.getElementById('graphModal').style.display = "block";
}

function closeModal() {
    document.getElementById('graphModal').style.display = "none";
}
