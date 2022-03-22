
const formulario = document.querySelector('#cotizar-seguro');
//  Constructores
function Seguro (marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realiza la cotización con los datos
Seguro.prototype.cotizarSeguro = function () {
    /*
    * 1 ==> Americano = 1.15
    * 2 ==> Asiatico = 1.05;
    * 3 ==> Europeo = 1.35
    * */
    let cantidad;
    const base = 2000;
    switch (parseInt(this.marca)) {
        case 1:
            cantidad = base * 1.15;
            break;
        case 2:
            cantidad = base * 1.05;
            break;
        case 3:
            cantidad = base * 1.35;
            break;
        default:
            break;
    }
    const diferencia = new Date().getFullYear() - this.year;
    cantidad-= ((diferencia * 3) - cantidad) / 100;
    if (this.tipo === 'basico'){
        cantidad-=1.30;
    }else{
        cantidad-=1.50;
    }
    return cantidad
}


function UI(){}

// Llena las opciones de los años

UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 22;

    const selectYear = document.querySelector('#year');

    for (let i = max; i >= min ; i--) {
        let option = document.createElement('option');
        option.textContent = i.toString();
        option.value = i;
        selectYear.appendChild(option);

    }
}

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');
    if (tipo === 'error'){
        div.classList.add('mensaje', 'error', 'mt-10');
    }else{
        div.classList.add('mensaje', 'correcto', 'mt-10');
    }
    div.textContent = mensaje;

    // Insertar en el HTML
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000)
}

UI.prototype.mostrarResultado = (seguro, total) => {

    const { marca, year, tipo } = seguro;
    let textoMarca;
    switch (parseInt(marca)) {
        case 1:
            textoMarca = 'Americano';
            break;
        case 2:
            textoMarca = 'Asiatico';
            break;
        case 3:
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }
    // Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML= `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> $ ${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal"> $ ${year}</span></p>
        <p class="font-bold capitalize">Tipo de Seguro: <span class="font-normal"> $ ${tipo}</span></p> 
        <p class="font-bold">Total: <span class="font-normal"> $ ${total}</span></p>  
    `;

    const resultado = document.querySelector('#resultado');

    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout( () =>{
        spinner.style.display = 'none';
        resultado.appendChild(div);
    }, 3000)
}

// Instanciar UI

const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); // Llena el select con los años
})

eventListeners();
function eventListeners() {
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();
    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    console.log(tipo);

    if(marca === ''|| year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
    }else{
        ui.mostrarMensaje('Cotizando...', 'exito');

        // Instanciar el seguro
        const seguro = new Seguro(marca, year, tipo);

        const resultados = document.querySelector('#resultado div');
        if (resultados !== null){
            resultados.remove();
        }
        const total = seguro.cotizarSeguro();
        // Utlizar el prootype que va a cotizar
        ui.mostrarResultado(seguro, total);
    }
}