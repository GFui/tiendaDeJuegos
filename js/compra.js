//gameItem -> var gameItem = {nombre: "nombreJuego", precio: precioDelJuego}
var carro = function () {

    var myItems = [];
    var itemCount = [];
    var precioTotal = 0;

    var addItem = function (gameItem) {

        if (myItems.length == 0) {

            myItems.push(gameItem);
            itemCount[myItems.indexOf(gameItem)] = 1;
            precioTotal += gameItem.precio;

        } else {
            var estaEnLaLista = false;
            for (var gc = 0; gc < myItems.length; gc++) {

                if (gameItem.nombre == myItems[gc].nombre && gameItem.precio == myItems[gc].precio) {

                    itemCount[gc]++;
                    precioTotal += gameItem.precio;
                    estaEnLaLista = true;
                }
            }

            if (!estaEnLaLista) {
                myItems.push(gameItem);
                precioTotal += gameItem.precio;
                itemCount.push(1);
                
            }
        }

        sessionStorage.setItem("carrito", miCarro.serializar());
        
    };

    var quitarItem = function (buttonId) {
        
        var onlyId = buttonId.split("_")[1];
        if (itemCount[onlyId] > 1) {
            precioTotal -= myItems[onlyId].precio;
            itemCount[onlyId]--;

        } else {
            precioTotal -= myItems[onlyId].precio;
            myItems.splice(onlyId, 1);
            itemCount.splice(onlyId, 1);
        }
        var listaCompra = document.getElementById("listaCompra");
        while (listaCompra.firstChild) {
            listaCompra.removeChild(listaCompra.lastChild);
        }
        
        
        sessionStorage.setItem("carrito", miCarro.serializar());
        actualizar();
    };

    var serialize = function () {

        var carroSerializado = {
            listaItems: [],
            totalAcumulado: precioTotal,
            listaItemCount: []
        };
        for (var i = 0; i < myItems.length; i++) {
            carroSerializado['listaItems'].push(myItems[i]);
        }

        for (var j = 0; j < itemCount.length; j++) {
            carroSerializado['listaItemCount'].push(itemCount[j]);
        }
        return JSON.stringify(carroSerializado);
    };

    var deserialize = function (carroSerializado) {
        myItems = carroSerializado.listaItems;
        itemCount = carroSerializado.listaItemCount;
        precioTotal = carroSerializado.totalAcumulado;
    };

    var actualizar = function () {

        var cuenta = 0;
        for (var cu = 0; cu < itemCount.length; cu++) {
            cuenta += itemCount[cu];
        }

        if (myItems.length > 0) {
            for (var count = 0; count < myItems.length; count++) {

                var deleteImg = document.createElement("img");
                deleteImg.src = "img/deleteButtom.jpg";
                var deleteButton = document.createElement("button");
                deleteButton.classList.add("deleteButton");
                deleteButton.id = "button_" + count;
                deleteButton.appendChild(deleteImg);
                deleteButton.onclick = function myDeleteFunction() {

                    miCarro.quitar(this.id);
                }


                listaCompra.appendChild(document.createElement("li"));
                var lastChild = listaCompra.lastChild;

                lastChild.innerHTML = myItems[count].nombre + " x" + itemCount[count] + ", precio: " + (myItems[count].precio * itemCount[count]) + " € ";
                lastChild.appendChild(deleteButton);
                document.getElementById("numArticulos").innerHTML = "Número de articulos: " + cuenta;
                document.getElementById("precioFinal").innerHTML = "Precio total: " + precioTotal.toFixed(2) + " €";
            }
        } else {
            document.getElementById("numArticulos").innerHTML = "";
            document.getElementById("precioFinal").innerHTML = "";
            listaCompra.appendChild(document.createElement("li"));
            var lastChild = listaCompra.lastChild;
            lastChild.innerHTML = "Cesta vacía!";

        }

    }

    var publicIFace = {

        add: function (gameItem) {
            addItem(gameItem);
        },

        quitar: function (gameItem) {
            quitarItem(gameItem);
        },

        verTotal: function () {

            return precioTotal.toFixed(2);
        },

        serializar: function () {
            return serialize();
        },

        deserializar: function (carroSerializado) {
            deserialize(carroSerializado);
        },

        verLista: function () {
            var itemsAndCount = {
                items: myItems,
                countOfItems: itemCount,
                total: 0
            };
            var acumulador = 0;
            for (var c = 0; c < itemCount.length; c++) {
                acumulador += itemCount[c];
            }
            itemsAndCount.total = acumulador;
            return itemsAndCount;
        },

        actualizarLista: function () {
            actualizar();
        }
    };

    return publicIFace;

};


var miCarro;

if (sessionStorage.getItem("carrito") != null) {
    miCarro = carro();
    miCarro.deserializar(JSON.parse(sessionStorage.getItem("carrito")));
    console.log("si hay carrito");
} else {
    miCarro = carro();
    console.log("no hay carrito");
}