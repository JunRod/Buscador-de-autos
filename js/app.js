const marca = document.querySelector("#marca");
const minimo = document.querySelector("#minimo");
const maximo = document.querySelector("#maximo");
const puertas = document.querySelector("#puertas");
const transmision = document.querySelector("#transmision");
const color = document.querySelector("#color");
const year = document.querySelector("#year");
const resultados = document.querySelector("#resultado");

const max = new Date().getFullYear();
const min = max - 10;

const spinner = document.querySelector("#spinner");

//*variables de la funcion Guardar Filtro
const contenedorCheckbox = document.querySelector(".guardar");
let arraySaveFilter = [];
let num = 0;
const contenedorGuardar = document.querySelector(".contenedorGuardados");

//*Usamos este objeto como referencia para la busquedad ( Filtrar )
const datosBusquedad = {
    marca: "",
    year: "",
    minimo: "",
    maximo: "",
    puertas: "",
    transmision: "",
    color: "",
};

//*eventos
EventsListener();
function EventsListener() {
    document.addEventListener("DOMContentLoaded", () => {
        MostrarAutos(autos);
        llenarSelect();
    });

    marca.addEventListener("change", (e) => {
        datosBusquedad.marca = e.target.value;
        filtrarAuto();
    });
    year.addEventListener("change", (e) => {
        datosBusquedad.year = parseInt(e.target.value);
        filtrarAuto();
    });
    minimo.addEventListener("change", (e) => {
        datosBusquedad.minimo = e.target.value;
        filtrarAuto();
    });
    maximo.addEventListener("change", (e) => {
        datosBusquedad.maximo = e.target.value;
        filtrarAuto();
    });
    puertas.addEventListener("change", (e) => {
        datosBusquedad.puertas = parseInt(e.target.value);
        filtrarAuto();
    });
    transmision.addEventListener("change", (e) => {
        datosBusquedad.transmision = e.target.value;
        filtrarAuto();
    });
    color.addEventListener("change", (e) => {
        datosBusquedad.color = e.target.value;
        filtrarAuto();
    });
}

//!Imprimir Autos
function MostrarAutos(autos) {
    limpiarHTML();
    //*Hacer visible el spinner antes de que se imprima algo
    spinner.style.display = "flex";
    setTimeout(() => {
        spinner.style.display = "none";
    }, 1000);

    setTimeout(() => {
        limpiarHTML();
        //*Comprobar si no concuenda con la busquedad
        autos.forEach((auto) => {
            const autoHTML = document.createElement("P");
            //*Destructuring del arreglo Autos
            const { marca, modelo, year, puertas, transmision, precio, color } =
                auto;
            autoHTML.textContent = /*html*/ `
            ${marca} ${modelo} - ${year} - ${puertas} Puertas - Transmisión: ${transmision} - Precio: ${precio} - Color: ${color}`;
            //*Insertar autos
            resultados.appendChild(autoHTML);
        });
    }, 1000);
}

function removerChebox() {
    while (contenedorCheckbox.firstChild) {
        contenedorCheckbox.firstChild.remove();
    }
}

//!Comprueba si el filtrado se guardó

let count = 0;
function comprobarSave(autos) {
    if (autos.length !== 19) {
        let resultadoArray = [];
        let resultado;
        if (arraySaveFilter.length !== 0) {
            arraySaveFilter.forEach((elementSave, index) => {
                elementSave.autos.forEach((autoSave) => {
                    //*Si almenos un solo auto de un objeto de arraySaveFilter es false, es decir es diferente del filtrado
                    resultado = autos.filter((auto) => auto === autoSave);
                    resultadoArray.push(resultado[0]);
                });
                resultadoArray = resultadoArray.filter((obj) => {
                    return obj === undefined;
                });

                if (resultadoArray.length === 0) {
                    Color(arraySaveFilter[index].li);
                    mostrarSave(index);
                    count = 3;
                } else {
                    count++;
                    if (count === 1) {
                        MostrarAutos(autos);
                        crearCheckbox(autos);
                    }
                }
                resultadoArray = [];
            });
        } else {
            crearCheckbox(autos);
            MostrarAutos(autos);
        }
        count = 0;
    }
}

//!Guardar el checkbox
function save(e, autos) {
    if (e.target.checked) {
        //*Creando li
        const li = document.createElement("li");
        li.textContent = `${arraySaveFilter.length}`;
        e.target.id = `${arraySaveFilter.length}`;
        li.onclick = (li) => {
            Color(li.target);
            mostrarSave(parseInt(li.target.textContent));
        };

        //*Si apretamos cheked se crea el li y se imprime en el form
        const obj = {
            autos: autos,
            checkbox: e.target,
            li: li,
        };
        arraySaveFilter.push(obj);
        contenedorGuardar.appendChild(obj.li);
    } else {
        let indexCheckbox = parseInt(e.target.id);
        delete arraySaveFilter[indexCheckbox];

        arraySaveFilter = arraySaveFilter.filter((e) => e !== "");
        const liAll = document.querySelectorAll(".contenedorGuardados li");
        liAll[indexCheckbox].remove();
        removerChebox();
        alert("Eliminando filtro N° : " + indexCheckbox);

        //*Restandole -1 a los labels que se eliminan antes del ultimo
        if (indexCheckbox < arraySaveFilter.length) {
            for (
                let index = indexCheckbox;
                index < arraySaveFilter.length;
                index++
            ) {
                arraySaveFilter[index].li.textContent =
                    parseInt(arraySaveFilter[index].li.textContent) - 1;
                arraySaveFilter[index].checkbox.id =
                    parseInt(arraySaveFilter[index].checkbox.id) - 1;
            }
        }
    }
}

//!Creando checkbox
function crearCheckbox(autos) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    checkbox.onclick = (e) => {
        save(e, autos);
    };

    //*Imprimiendo el checkbox en el contenedor de Checkboxs
    removerChebox();
    contenedorCheckbox.appendChild(checkbox);
}

//!Muestra los autos guardados y su checkbox disable
function mostrarSave(index) {
    removerChebox();
    contenedorCheckbox.appendChild(arraySaveFilter[index].checkbox);
    MostrarAutos(arraySaveFilter[index].autos);
}

//*Funcion que filtra en base a la busquedad
function filtrarAuto() {
    const resultado = autos
        .filter(filtrarMarca)
        .filter(filtrarYear)
        .filter(filtrarMinimo)
        .filter(filtrarMaximo)
        .filter(filtrarPuertas)
        .filter(filtrarTransmision)
        .filter(filtrarColor);

    if (resultado.length === 0) {
        limpiarHTML();
        removerChebox();
        const error = document.createElement("div");
        error.textContent = "No hay resultados";
        error.classList.add("alerta", "error");
        //*Insertar error
        resultados.appendChild(error);
    } else {
        comprobarSave(resultado);
    }
}

//*Limpia los hijos de "Resultados"
function limpiarHTML() {
    resultados.innerHTML = "<div></div>";
}

function Color(li) {
    let liAll = document.querySelectorAll(".contenedorGuardados li");
    for (let index = 0; index < liAll.length; index++) {
        let Li = liAll[index];
        if (Li.classList.contains("colorLi")) {
            Li.classList.remove("colorLi");
        }
    }

    li.classList.add("colorLi");
}

//*Funciones de paso alto (Filtran por caracteristica del auto)
function filtrarMarca(auto) {
    const { marca } = datosBusquedad;
    if (marca) {
        return auto.marca === marca;
    }
    return auto;
}

function filtrarYear(auto) {
    const { year } = datosBusquedad;
    if (year) {
        return auto.year === year;
    }
    return auto;
}

function filtrarMinimo(auto) {
    const { minimo } = datosBusquedad;
    if (minimo) {
        return auto.precio >= minimo;
    }
    return auto;
}

function filtrarMaximo(auto) {
    const { maximo } = datosBusquedad;
    if (maximo) {
        return auto.precio <= maximo;
    }
    return auto;
}

function filtrarPuertas(auto) {
    const { puertas } = datosBusquedad;
    if (puertas) {
        return auto.puertas === puertas;
    }
    return auto;
}

function filtrarTransmision(auto) {
    const { transmision } = datosBusquedad;
    if (transmision) {
        return auto.transmision === transmision;
    }
    return auto;
}

function filtrarColor(auto) {
    const { color } = datosBusquedad;
    if (color) {
        return auto.color === color;
    }
    return auto;
}

//?Esto se le conoce programacion funcional, porque no tenemos contacto alguno con los datos originales, ya que hacemos destructuring.

//*Llenar Selec de Años
function llenarSelect() {
    for (let i = max; i >= min; i--) {
        const opcion = document.createElement("option");
        opcion.value = i;
        opcion.textContent = i;
        year.appendChild(opcion);
    }
}
