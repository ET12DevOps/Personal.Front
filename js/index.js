//let baseUrl = "http://localhost:5221"
let baseUrl = "https://api-personal.up.railway.app"

document.addEventListener("DOMContentLoaded", () => {
    actualizarEmpleados()
    actualizarAccesos()
    actualizarGrafico()
})


function actualizarEmpleados() {
    axios.get(baseUrl + '/api/empleado')
        .then(function (response) {
            let empleados = document.getElementById("empleados")
            empleadosData = response.data
            var empleadosHtml = ''
            for (let i = 0; i < empleadosData.length; i++) {
                empleadosHtml += `${empleadosData[i].nombre} ${empleadosData[i].apellido} - ${empleadosData[i].tarjeta} <br/> `
            }
            empleados.innerHTML = empleadosHtml
        })
        .catch(function (error) {
            console.log(error);
        })
}

let btnGuardarEmpleado = document.getElementById("btnGuardarEmpleado")

btnGuardarEmpleado.addEventListener("click", (e) => {
    let nombreEmpleado = document.getElementById("nombreEmpleado")
    let apellidoEmpleado = document.getElementById("apellidoEmpleado")
    let tarjetaEmpleado = document.getElementById("tarjetaEmpleado")
    let empleado = {
        nombre: nombreEmpleado.value,
        apellido: apellidoEmpleado.value,
        tarjeta: tarjetaEmpleado.value
    }
    if (empleado.nombre !== '' && empleado.nombre !== null &&
        empleado.apellido !== '' && empleado.apellido !== null &&
        empleado.tarjeta !== '' && empleado.tarjeta !== null) {
        axios.post(baseUrl + "/api/empleado", empleado)
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                alert(error)
            })
        actualizarEmpleados()
        nombreEmpleado.value = ''
        apellidoEmpleado.value = ''
        tarjetaEmpleado.value = ''
    } else {
        alert('Verificar campos empleado')
    }
})

let btnGuardarAcceso = document.getElementById("btnGuardarAcceso")

btnGuardarAcceso.addEventListener("click", (e) => {
    let accesoEmpleado = document.getElementById("accesoEmpleado")
    let acceso = {
        tarjeta: accesoEmpleado.value
    }
    if (acceso.tarjeta !== '' && acceso.tarjeta !== null) {
        axios.post(baseUrl + "/api/acceso", acceso)
            .then(function (response) {
                actualizarAccesos()
                actualizarGrafico()
            })
            .catch(function (error) {
                alert(error)
            })
        accesoEmpleado.value = ''
    } else {
        alert('La tarjeta no es correcta')
    }
})

function actualizarAccesos() {
    axios.get(baseUrl + '/api/acceso')
        .then(function (response) {
            let accesos = document.getElementById("accesos")
            accesosData = response.data
            var accesosHtml = ''
            for (let i = 0; i < accesosData.length; i++) {
                accesosHtml += `${accesosData[i].hora} - ${accesosData[i].nombre} ${accesosData[i].apellido} <br/> `
            }
            accesos.innerHTML = accesosHtml
        })
        .catch(function (error) {
            console.log(error);
        })
}

const accesosDia = document.getElementById('accesosdia');

var grafico = new Chart(accesosDia, {
    type: 'bar',
    data: {
        labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        datasets: [{
            label: '# de accesos',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderWidth: 1
        }]
    }
});

function actualizarGrafico() {
    accesosDia.innerHTML = ""
    axios.get(baseUrl + '/api/acceso/dia')
        .then(function (response) {
            let accesos = response.data;
            grafico.data.datasets[0].data = accesos.map(x => x.accesos)
            grafico.update()
        })
        .catch(function (error) {
            console.log(error);
        })
}

