/**
 * Created by Badr on 30/01/2017.
 */

var dataObj = {
    result:
    {
        trips: [
            {
            code: "",
            name: "",
            price: "",
            statut: "",
            roundTrips: [
                {type: "", date: "", trains: []},
                {type: "", date: "", trains: []},
                {type: "", date: "", trains: []},
                {type: "", date: "", trains: []}]
        }]
    },
    custom: {
        price: []
    }
};

function putInDom(str) {
    $("#content").html(str.replace(/\\"/g, "").replace(/\\r\\n/g, ""));
    $( "#loader" ).remove();

}

function transformDate(str) {
    var tab = [];
    for (var i = 0; str.length > i; i++)
    {
        str[i] = str[i].replace(/[^0-9// /]/g, "").replace(/\s\s+/g, "");
        str[i].split(" ").forEach(function(elem)
        {
            tab.push(elem);
        });
    }
    return(tab);
    // Pour ce qui est de la date j'ai gardé le format 'fr', j'aurai pu faire un split pour ensuite changer leur
    // position ou utiliser une librairie comme date.js. Cepandant j'ai préféré ne pas le faire car je ne suis pas sur
    // du format à utilisé à cause des zeros à la suite, je pense que c'est l'heure et les minutes mais dans le doute
    // je préfère laisser quelques chose de simple.
}

function getTrain(pos) {
    var tabAllInfo = [];
    $("td", $(".product-details")[pos]).each(function () {
        var tmp = $(this);
        tabAllInfo.push(tmp[0].innerText);
    });
    tabAllInfo.splice(5, 1);
    return (tabAllInfo)
}

function test(b, tabTrain) {
    b.trains[0].departureTime = tabTrain[1].replace("h", ":");
    b.trains[0].departureStation = tabTrain[2];
    b.trains[0].type = tabTrain[3];
    b.trains[0].number = tabTrain[4];
    b.trains[0].arrivalTime = tabTrain[6].replace("h", ":");
    b.trains[0].arrivalStation = tabTrain[7];
    return(b)
}

function getRoundTrips() {
    var tabFinal = [];
    var typeArray = $(".travel-way");
    var dateArray = $(".pnr-summary");
    var tmpArrayLen = [];

    for (var i = 0; i < dateArray.length; i++)
    {
        tmpArrayLen.push(dateArray[i].innerText);
    }
    tmpArrayLen = transformDate(tmpArrayLen);
    for (var i = 0; i < typeArray.length; i++)
    {
        var b ={
            type: "",
            date: "",
            trains: [
                {
                    departureTime: "",
                    departureStation: "",
                    arrivalTime: "",
                    arrivalStation: "",
                    type: "",
                    number: ""
                }
            ]
        };
        b.date = tmpArrayLen[i];
        b.type = typeArray[i].innerText;
        var tabTrain = getTrain(i);
        b = test(b, tabTrain);
        tabFinal.push(b);
    }
    return (tabFinal);
}

function getCustom() {
    var priceTab = [];
    var nbr;

    for(var i = 0; i < $(".product-header > tbody > tr > td:last-child").length; i++)
    {
        nbr = $(".product-header > tbody > tr > td:last-child")[i].innerText.replace(",", ".").replace("€", "");
        nbr = parseFloat(nbr);
        priceTab.push(nbr);
    }
    for(var i = 0; i < $(".product-header > td:last-child").length; i++)
    {
        nbr = $(".product-header > td:last-child")[i].innerText.replace(",", ".").replace("€", "");
        nbr = parseFloat(nbr);
        priceTab.push(nbr);
    }
    return(priceTab)
}

function parseData() {
    var len;
    var str;

    str = $("#intro-hello")[0].innerText;
    str = str.split(" ");
    str = str[2];
    dataObj.result.trips[0].name = str;
    dataObj.result.trips[0].price = $(".very-important")[0].innerText.replace(/,/, ".").replace(/€/, "");
    len = $(".pnr-ref").length;
    dataObj.result.trips[0].code = $(".pnr-ref")[len - 1].innerText.replace(/.*: /, "");
    dataObj.result.trips[0].roundTrips = getRoundTrips();
    dataObj.custom.price = getCustom();
    dataObj.result.trips[0].statut = "ok";
}

function displayJson() {
    console.log(dataObj);
}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e)
    {
        var content = e.target.result;
        putInDom(content);
        parseData();
        displayJson();
    };
    reader.readAsText(file);
}
document.getElementById('file-input').addEventListener('change', readSingleFile, false);