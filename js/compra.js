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
                
                if(gameItem.nombre == myItems[gc].nombre && gameItem.precio == myItems[gc].precio) {
                    
                    itemCount[gc]++;
                    precioTotal += gameItem.precio;
                    estaEnLaLista = true;
                }
            }
            
            if(!estaEnLaLista){
                myItems.push(gameItem);
                precioTotal += gameItem.precio;
                itemCount.push(1);
                precioTotal += gameItem.precio;
            }
        }

        sessionStorage.setItem("carrito", miCarro.serializar());

    };

    var quitarItem = function (gameItem) {
        for (juego in myItems) {
            if (gameItem.verNombre() === juego.nombre) {
                precioTotal -= gameItem.precio;
                myItems.remove(gameItem);
            }
        }
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