/**
Roulette Table object
**/
var Table = function () {

    var possibleBets = [
        {
            name: "0",
            color: "green",
            oddeven: "",
            type: "inside",
            winratio: 35,
            winningnumbers: ["0"]
        },
        {
            name: "1",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["1"]
        },
        {
            name: "2",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["2"]
        },
        {
            name: "3",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["3"]
        },
        {
            name: "4",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["4"]
        },
        {
            name: "5",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["5"]
        },
        {
            name: "6",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["6"]
        },
        {
            name: "7",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["7"]
        },
        {
            name: "8",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["8"]
        },
        {
            name: "9",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["9"]
        },
        {
            name: "10",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["10"]
        },
        {
            name: "11",
            color: "black",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["11"]
        },
        {
            name: "12",
            color: "red",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["12"]
        },
        {
            name: "13",
            color: "black",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["13"]
        },
        {
            name: "14",
            color: "red",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["14"]
        },
        {
            name: "15",
            color: "black",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["15"]
        },
        {
            name: "16",
            color: "red",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["16"]
        },
        {
            name: "17",
            color: "black",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["17"]
        },
        {
            name: "18",
            color: "red",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["18"]
        },
        {
            name: "19",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["19"]
        },
        {
            name: "20",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["20"]
        },
        {
            name: "21",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["21"]
        },
        {
            name: "22",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["22"]
        },
        {
            name: "23",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["23"]
        },
        {
            name: "24",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["24"]
        },
        {
            name: "25",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["25"]
        },
        {
            name: "26",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["26"]
        },
        {
            name: "27",
            color: "red",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["27"]
        },
        {
            name: "28",
            color: "black",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["28"]
        },
        {
            name: "29",
            color: "black",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["29"]
        },
        {
            name: "30",
            color: "red",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["30"]
        },
        {
            name: "31",
            color: "black",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["31"]
        },
        {
            name: "32",
            color: "red",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["32"]
        },
        {
            name: "33",
            color: "black",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["33"]
        },
        {
            name: "34",
            color: "red",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["34"]
        },
        {
            name: "35",
            color: "black",
            oddeven: "odd",
            type: "inside",
            winratio: 35,
            winningnumbers: ["35"]
        },
        {
            name: "36",
            color: "red",
            oddeven: "even",
            type: "inside",
            winratio: 35,
            winningnumbers: ["36"]
        },
        {
            name: "00",
            color: "green",
            oddeven: "",
            type: "inside",
            winratio: 35,
            winningnumbers: ["00"]
        },
        {
            name: "1to18",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 1,
            winningnumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"]
        },
        {
            name: "19to36",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 1,
            winningnumbers: ["19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"]
        },
        {
            name: "red",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 1,
            winningnumbers: ["1", "3", "5", "7", "9", "12", "14", "16", "18", "19", "21", "23", "25", "27", "30", "32", "34", "36"]
        },
        {
            name: "black",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 1,
            winningnumbers: ["2", "4", "6", "8", "10", "11", "13", "15", "17", "20", "22", "24", "26", "28", "29", "31", "33", "35"]
        },
        {
            name: "even",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 1,
            winningnumbers: ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "34", "36"]
        },
        {
            name: "odd",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 1,
            winningnumbers: ["1", "3", "5", "7", "9", "11", "13", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35"]
        },
        {
            name: "1st12",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 2,
            winningnumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
        },
        {
            name: "2nd12",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 2,
            winningnumbers: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"]
        },
        {
            name: "3rd12",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 2,
            winningnumbers: ["25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"]
        },
        {
            name: "1st2to1",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 2,
            winningnumbers: ["1", "4", "7", "10", "13", "16", "19", "22", "25", "28", "31", "34"]
        },
        {
            name: "2nd2to1",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 2,
            winningnumbers: ["2", "5", "8", "11", "14", "17", "20", "23", "26", "29", "32", "35"]
        },
        {
            name: "3rd2to1",
            color: "",
            oddeven: "",
            type: "outside",
            winratio: 2,
            winningnumbers: ["3", "6", "9", "12", "15", "18", "21", "24", "27", "30", "33", "36"]
        }
    ];

    var placedBets = [];

    // initializes main settings
    var handleInit = function () {

    };

    return {

        //main function to initiate the theme
        init: function () {

            handleInit(); // initialize core settings           
        },

        selectWinningNumber: function (number) {
            $(".tile").removeClass("active");
            $(".tile-" + number.name).addClass("active");
        },

        totalBets: function () {
            var total = 0;
            for (var i = 0; i < placedBets.length; i++) {
                total += placedBets[i].amount;
            }
            return total;
        },

        //findBet: function (tile, name) {
        //    return tile.name = name;
        //},

        placeBet: function (name, amount) {

            var existingBet = $.grep(placedBets, function (e) { return e.tile.name == name });
            if (existingBet.length) {
                existingBet[0].amount += amount;
            }
            else {
                var bet = {
                    "amount": amount,
                    "tile": $.grep(possibleBets, function (e) { return e.name == name })[0]
                };
                placedBets.push(bet);
            }
            
            this.updateBetsOnTable();

        },

        isPlacedBet: function (name) {
            return ($.grep(placedBets, function (e) { return e.tile.name == name }).length?true:false);
        },

        updateBetsOnTable: function () {
            $(".tile .bet").remove();
            $(".tile .bet-winnings").remove();
            for (var i = 0; i < placedBets.length; i++) {
                var bet = placedBets[i];
                $(".tile-" + bet.tile.name).append("<span class='bet'>" + bet.amount + "</span>");
            }
        },

        getPlacedBets: function () {
            return placedBets;
        },

        setPlacedBets: function (bets) {
            placedBets = bets;            
        },

        doubleBets: function () {
            for (var i = 0; i < placedBets.length; i++) {
                placedBets[i].amount = placedBets[i].amount * 2;
            }
            this.updateBetsOnTable();
        },

        clearBets: function () {
            placedBets = [];

            this.updateBetsOnTable();
        }
    };

}();


jQuery(document).ready(function () {
    Table.init();
});