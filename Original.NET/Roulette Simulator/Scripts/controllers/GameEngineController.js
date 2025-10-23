//
// Roulette Strategy Simulator
// Developed by Yury Primakov
// Date: 3/11/2017
//
// Description: An engine for simulating, testing and recording statistical and analytical data on various roulette betting strategies
// 
 //Default Strategy: Modified version of the Martingale Betting Strategy. Given a certain betting denomination, lets say $10, an outside bet
 //is placed on with red, black, odd, even, 1 to 18 or 19 to 36, after an opposite consecutive spin pattern emerges. For example: 2 consecutive
 //times the ball lands on red, an initial bet of $10 is placed on black. If the next spin is a win, the player looks for a new pattern. If the
 //next spin is a loss, however, the same bet is repeated but doubled. This continues until the player wins. Player needs to have a bankroll to
 //sustain 6 consecutive losses. So for a $10 betting denomination, a player needs to have a bankroll of $1280. Finally, the player should 
 //set a reasonable limit to cashout earnings. The longer a player plays, the less his odds of cashing out a winner become. Reasonable cashout
 //limit might be $1680 for a $400 profit.
//

(function () {

    'use strict';


    // Exam details page
    function RouletteGameController($scope, $sce, $http, $interval) {

        var vm = this;
        vm.table = Table;
        vm.wheel = Wheel;

        vm.isEuropeanTable = true;
        vm.showOptions = false;
        vm.viewMode = "GAME"; // options: 'GAME', 'SETTINGS'

        vm.timeBetweenSpins = 3; //How many seconds between spins
        vm.timeRemainingBeforeNextSpin = 0;
        vm.autoBet = true;

        vm.startingBankroll = 1280;
        vm.playerBalance = vm.startingBankroll;
        vm.playerBalanceRecordHigh = vm.startingBankroll;

        vm.totalBets = 0;
        vm.totalWinnings = 0;

        vm.firstBetAmount = 10;
        vm.isSecondBetActive = false;
        vm.secondBetAmount = 5;
        vm.isThirdBetActive = false;
        vm.thirdBetAmount = 3;

        vm.timer = null;
        vm.isPlaying = false;
        vm.betFormula = "2x";
        vm.isBetsSettled = true;

        vm.betAmount = 10;

        vm.currentNumber = null;
        vm.history = [];                    //historical track of spins occurred, bets placed, etc.
        vm.message = [];                    //event log
        vm.trailingHistory = [];            //tracks the history of consecutive red, black, odd, even, low or high streaks
        vm.consecutiveLossHistory = [];     //tracks history of consecutive loss streaks
        vm.trailingUniques = {};            //tracks the numbner of times a consecutive red, black, odd, even, low or high streak occurred
        vm.consecutiveLossUniques = {};     //tracks the number of times a loss streak occurred
        vm.minTrail = 5;                    //minimum number of consecutive spins to track as history
        vm.consecutivePatternMin = 2;       //number of consecutive spins of a type (red, black, odd, even, low, high) before a pattern is established

        vm.totalNumberOfBets = 0;           //count of the total number of bets placed and settled
        vm.maxConsecutiveLossCount = 0;          //maximum number of consecutive losses recorded during a session
        vm.maxConsecutiveLossType = "";
        vm.consecutiveLossLimit = 7;        //player set limit of how many consecutive losses can be endured before giving up

        vm.percentRed = 0;
        vm.percentBlack = 0;
        vm.percentGreen = 0;
        vm.percentOdd = 0;
        vm.percentEven = 0;
        vm.percentLow = 0;
        vm.percentHigh = 0;

        vm.maxTrailingCount = 0;
        vm.maxTrailingType = "";
        vm.trailingRedCount = 0;
        vm.trailingBlackCount = 0;
        vm.trailingOddCount = 0;
        vm.trailingEvenCount = 0;
        vm.trailingLowCount = 0;
        vm.trailingHighCount = 0;


        vm.spin = function () {
            vm.currentNumber = vm.wheel.spin();
            vm.table.selectWinningNumber(vm.currentNumber);
            vm.history.push({
                "id": vm.history.length + 1,
                "number": vm.currentNumber,
                "placedBets": vm.table.getPlacedBets()
            });
            vm.initUpdateStats();
            vm.settleBets();

            // THIS IS A MAINTENANCE NIGHTMARE!! Don't do this again!
            debugger;
            vm.newMessage("<div class='row'><div class='col-xs-2'>Spin: </div><div class='col-xs-1 bold font-" +
                (vm.currentNumber.color == 'black' ? 'yellow-crusta' : (vm.currentNumber.color == 'red' ? 'red-mint' : 'green-jungle')) + "'>" +
                vm.currentNumber.name + "</div> <div class='col-xs-2 uppercase font-grey'>[" + vm.currentNumber.oddeven + "]</div> <div class='col-xs-1'>" +
                (parseInt(vm.currentNumber.name) >= 19 ? '<i class="fa fa-chevron-up"></i>' : (parseInt(vm.currentNumber.name) >= 1 ? '<i class="fa fa-chevron-down"></i>' : '')) + "</div>" + 
                "<div class='col-md-5'>Win: $" + vm.totalWinnings + "</div></div>");
        };

        vm.placeBet = function (name) {
            if ((vm.remainingPlayerBalance() - vm.betAmount) > 0) {
                vm.table.placeBet(name, vm.betAmount);
                vm.table.updateBetsOnTable();
                vm.updateTotalBets();
            }
            else {
                vm.newMessage("You don't have enough money to place this bet.");
            }
        };

        vm.isPlacedBet = function (name) {
            var isPlaced = vm.table.isPlacedBet(name);
            console.log(isPlaced);
            return isPlaced;
        };

        vm.clearBets = function () {
            vm.table.clearBets();
            vm.updateTotalBets();
        };

        vm.repeatLastBet = function () {
            vm.table.setPlacedBets(vm.history[vm.history.length - 1].placedBets);
            vm.table.updateBetsOnTable();
            vm.updateTotalBets();
        };

        vm.remainingPlayerBalance = function () {
            //var placedBets = vm.table.getPlacedBets();
            //vm.totalBets = 0;
            //for (var i = 0; i < placedBets.length; i++) {
            //    vm.totalBets += placedBets[i].amount;
            //}
            return vm.playerBalance - vm.table.totalBets();
        };

        vm.updateTotalBets = function () {
            vm.totalBets = vm.table.totalBets();
            return vm.totalBets;
        };

        vm.settleBets = function () {
            vm.isBetsSettled = false;
            vm.totalWinnings = 0;

            var placedBets = vm.table.getPlacedBets();

            if (placedBets.length) {
                (function betsLoop(i) {
                    setTimeout(function () {
                        vm.evaluateBet(placedBets[i - 1]);
                        if (--i) betsLoop(i);      //  decrement i and call myLoop again if i > 0
                        else {
                            vm.playerBalance = vm.playerBalance - vm.table.totalBets() + vm.totalWinnings;
                            if (vm.playerBalance > vm.playerBalanceRecordHigh) { vm.playerBalanceRecordHigh = vm.playerBalance } //update player's maximum balance
                            vm.playerBalanceRecordHigh 
                            vm.totalNumberOfBets += placedBets.length;
                            vm.table.setPlacedBets([]);
                            vm.totalBets = vm.table.totalBets(); // should be 0
                            if (vm.totalWinnings > 0) {
                                Global.displayMessage("You won " + vm.totalWinnings);
                            }
                            vm.isBetsSettled = true;
                            $scope.$apply();
                        }
                    }, 250)
                })(placedBets.length);
            }
            else {
                vm.isBetsSettled = true;
            }

        };

        vm.evaluateBet = function (bet) {
            if (vm.isWinningBet(bet, vm.currentNumber.name)) {
                var win = (bet.amount * bet.tile.winratio);
                //console.log("User bet $" + placedBets[i].amount + " on " + placedBets[i].tile.name + " and won $" + win);
                var betWinnings = $("<span class='bet bet-winnings'>" + win + "</span>");
                $(".tile-" + bet.tile.name).append(betWinnings);
                vm.totalWinnings += bet.amount + win;
                setTimeout(function () {
                    $(".tile-" + bet.tile.name + " .bet").addClass("win").fadeOut(1000, "swing", function () { this.remove() });
                }, 2000);
                bet.isWin = true;

            } else {
                //vm.playerBalance -= bet.amount;
                $(".tile-" + bet.tile.name + " .bet").addClass("loss").fadeOut(1000, "swing", function () { this.remove() });
                bet.isWin = false;
                var doubleCount = Math.log(bet.amount / vm.firstBetAmount) / Math.log(2) + 1; // +1 to include initial bet loss
                vm.newConsecutiveLossRecord(doubleCount, bet.tile.name);
            }
        };

        vm.isWinningBet = function (bet, number) {
            return $.inArray(number, bet.tile.winningnumbers) >= 0; // if the current number is in the winning numbers array, returns -1 if not
        };

        vm.playGame = function () {
            vm.isPlaying = true;
            vm.timeRemainingBeforeNextSpin = vm.timeBetweenSpins;
            vm.newMessage("Game has started. Player has a balance of " + vm.remainingPlayerBalance());
            //Initialize the Timer to run every 1000 milliseconds i.e. one second.
            vm.timer = $interval(function () {
                if (vm.isBetsSettled) {
                    if (vm.timeRemainingBeforeNextSpin == 0) {
                        vm.spin();
                        vm.timeRemainingBeforeNextSpin = vm.timeBetweenSpins;
                    } else {
                        vm.timeRemainingBeforeNextSpin -= 1;
                    }
                    if (vm.autoBet && vm.timeRemainingBeforeNextSpin == vm.timeBetweenSpins - 2) {
                        vm.autoPlaceBet();
                    }
                }

                //vm.currentSpin = Wheel.spin();
            }, 1000);
        };

        vm.stopGame = function () {

            vm.isPlaying = false;
            //Set the Timer stop message.
            vm.newMessage("Game has stopped.");

            //Cancel the Timer
            if (angular.isDefined(vm.timer)) {
                $interval.cancel(vm.timer);
            }
        };

        vm.newMessage = function (msg) {
            vm.message.push({
                "id": vm.message.length,
                "text": $sce.trustAsHtml(msg)
            });
        };

        /* Betting Engine */

        vm.autoPlaceBet = function () {
            // Double previous losing bet
            if (vm.history.length) {
                //debugger;
                var lastBets = vm.history[vm.history.length - 1].placedBets;
                var lastNumber = vm.history[vm.history.length - 1].number;

                for (var i = 0; i < lastBets.length; i++) {
                    if (!vm.isWinningBet(lastBets[i], lastNumber.name) && !vm.table.isPlacedBet(lastBets[i].tile.name) && lastBets[i].tile.type == 'outside') {
                        var doubleAmount = lastBets[i].amount * 2;
                        var doubleCount = Math.log(doubleAmount / vm.firstBetAmount) / Math.log(2) + 1; // +1 to include first loss
                        if ((vm.remainingPlayerBalance() - doubleAmount) > 0 && doubleCount <= vm.consecutiveLossLimit) {
                            vm.table.placeBet(lastBets[i].tile.name, doubleAmount);
                            console.log("Auto double bet of $" + (lastBets[i].amount * 2) + " placed on '" + lastNumber.name + "'");
                        }
                        else {

                        }
                    }
                }

                if (vm.trailingBlackCount >= vm.consecutivePatternMin && !vm.table.isPlacedBet("red")) {
                    vm.table.placeBet("red", vm.firstBetAmount);
                    console.log("Auto bet of $" + vm.firstBetAmount + " placed on 'red'");
                }
                if (vm.trailingRedCount >= vm.consecutivePatternMin && !vm.table.isPlacedBet("black")) {
                    vm.table.placeBet("black", vm.firstBetAmount);
                    console.log("Auto bet of $" + vm.firstBetAmount + " placed on 'black'");
                }
                if (vm.trailingOddCount >= vm.consecutivePatternMin && !vm.table.isPlacedBet("even")) {
                    vm.table.placeBet("even", vm.firstBetAmount);
                    console.log("Auto bet of $" + vm.firstBetAmount + " placed on 'even'");
                }
                if (vm.trailingEvenCount >= vm.consecutivePatternMin && !vm.table.isPlacedBet("odd")) {
                    vm.table.placeBet("odd", vm.firstBetAmount);
                    console.log("Auto bet of $" + vm.firstBetAmount + " placed on 'odd'");
                }
                if (vm.trailingLowCount >= vm.consecutivePatternMin && !vm.table.isPlacedBet("19to36")) {
                    vm.table.placeBet("19to36", vm.firstBetAmount);
                    console.log("Auto bet of $" + vm.firstBetAmount + " placed on '19 to 36'");
                }
                if (vm.trailingHighCount >= vm.consecutivePatternMin && !vm.table.isPlacedBet("1to18")) {
                    vm.table.placeBet("1to18", vm.firstBetAmount);
                    console.log("Auto bet of $" + vm.firstBetAmount + " placed on '1 to 18'");
                }
            }
        };

        /* End Betting Engine */

        /* Reference methods */
        vm.initUpdateStats = function () {
            vm.percentRed = vm.getStatsRed();
            vm.percentBlack = vm.getStatsBlack();
            vm.percentGreen = vm.getStatsGreen();
            vm.percentOdd = vm.getStatsOdd();
            vm.percentEven = vm.getStatsEven();
            vm.percentLow = vm.getStatsLow();
            vm.percentHigh = vm.getStatsHigh();

            vm.trailingRedCount = vm.getTrailingRed();
            vm.trailingBlackCount = vm.getTrailingBlack();
            vm.trailingOddCount = vm.getTrailingOdd();
            vm.trailingEvenCount = vm.getTrailingEven();
            vm.trailingLowCount = vm.getTrailingLow();
            vm.trailingHighCount = vm.getTrailingHigh();
        };

        vm.getStatsRed = function () {
            var reds = $.grep(vm.history, function (e) { return e.number.color == "red" });
            return Math.floor((reds.length / vm.history.length) * 100);
        };

        vm.getStatsBlack = function () {
            var reds = $.grep(vm.history, function (e) { return e.number.color == "black" });
            return Math.floor((reds.length / vm.history.length) * 100);
        };

        vm.getStatsGreen = function () {
            var reds = $.grep(vm.history, function (e) { return e.number.color == "green" });
            return Math.floor((reds.length / vm.history.length) * 100);
        };

        vm.getStatsOdd = function () {
            var reds = $.grep(vm.history, function (e) { return e.number.oddeven == "odd" });
            return Math.floor((reds.length / vm.history.length) * 100);
        };

        vm.getStatsEven = function () {
            var reds = $.grep(vm.history, function (e) { return e.number.oddeven == "even" });
            return Math.floor((reds.length / vm.history.length) * 100);
        };

        vm.getStatsHigh = function () {
            var reds = $.grep(vm.history, function (e) { return parseInt(e.number.name) >= 19 });
            return Math.floor((reds.length / vm.history.length) * 100);
            //return 0;
        };

        vm.getStatsLow = function () {
            var reds = $.grep(vm.history, function (e) { return parseInt(e.number.name) <= 19 && parseInt(e.number.name) >= 1 });
            return Math.floor((reds.length / vm.history.length) * 100);
        };

        vm.newTrailRecord = function (count, type) {
            vm.trailingHistory.push({
                "count": count,
                "type": type,
                "spinCount": vm.history.length,
                "betCount": vm.totalNumberOfBets
            });
            if (count > vm.maxTrailingCount) { vm.maxTrailingCount = count; vm.maxTrailingType = type; }

            vm.updateTrailingUniques();
        };

        

        vm.updateTrailingUniques = function () {
            vm.trailingUniques = {};

            for (var i = 0; i < vm.trailingHistory.length; i++) {
                vm.trailingUniques[vm.trailingHistory[i].count] = 1 + (vm.trailingUniques[vm.trailingHistory[i].count] || 0);
            }
        };

        vm.newConsecutiveLossRecord = function (count, type) {
            if (count >= vm.minTrail-vm.consecutivePatternMin) {
                vm.consecutiveLossHistory.push({
                    "count": count,
                    "spinCount": vm.history.length,
                    "betCount": vm.totalNumberOfBets
                });
                if (count > vm.maxConsecutiveLossCount) { vm.maxConsecutiveLossCount = count; vm.maxConsecutiveLossType = type; }

                vm.updateConsecutiveLossUniques();
            }
        };

        vm.updateConsecutiveLossUniques = function () {
            vm.consecutiveLossUniques = {};

            for (var i = 0; i < vm.consecutiveLossHistory.length; i++) {
                vm.consecutiveLossUniques[vm.consecutiveLossHistory[i].count] = 1 + (vm.consecutiveLossUniques[vm.consecutiveLossHistory[i].count] || 0);
            }
        };

        vm.getTrailingRed = function () {
            var count = 0;
            for (var i = vm.history.length - 1; i >= 0; i--) {
                if (vm.history[i].number.color == "red") {
                    count += 1;
                }
                else break;
            }
            if (count >= vm.minTrail) { vm.newTrailRecord(count, "Red"); }

            return count;
        };

        vm.getTrailingBlack = function () {
            var count = 0;
            for (var i = vm.history.length - 1; i >= 0; i--) {
                if (vm.history[i].number.color == "black") {
                    count += 1;
                }
                else break;
            }
            if (count >= vm.minTrail) { vm.newTrailRecord(count, "Black"); }

            return count;
        };

        vm.getTrailingOdd = function () {
            var count = 0;
            for (var i = vm.history.length - 1; i >= 0; i--) {
                if (vm.history[i].number.oddeven == "odd") {
                    count += 1;
                }
                else break;
            }
            if (count >= vm.minTrail) { vm.newTrailRecord(count, "Odd"); }

            return count;
        };

        vm.getTrailingEven = function () {
            var count = 0;
            for (var i = vm.history.length - 1; i >= 0; i--) {
                if (vm.history[i].number.oddeven == "even") {
                    count += 1;
                }
                else break;
            }
            if (count >= vm.minTrail) { vm.newTrailRecord(count, "Even"); }

            return count;
        };

        vm.getTrailingLow = function () {
            var count = 0;
            for (var i = vm.history.length - 1; i >= 0; i--) {
                if (parseInt(vm.history[i].number.name) <= 18 && parseInt(vm.history[i].number.name) >= 1) {
                    count += 1;
                }
                else break;
            }
            if (count >= vm.minTrail) { vm.newTrailRecord(count, "1 to 18"); }

            return count;
        };

        vm.getTrailingHigh = function () {
            var count = 0;
            for (var i = vm.history.length - 1; i >= 0; i--) {
                if (parseInt(vm.history[i].number.name) >= 19) {
                    count += 1;
                }
                else break;
            }
            if (count >= vm.minTrail) { vm.newTrailRecord(count, "19 to 36"); }

            return count;
        };

        vm.getPercentageByBets = function (count) {
            if (vm.totalNumberOfBets > 0) {
                return ((count / vm.totalNumberOfBets) * 100).toFixed(2);
            } else return 0;
        };

        vm.getExpectedPercentage = function (key, val) {
            return ((1 / Math.pow(2, key)) * 100).toFixed(2);
        };

        /* End Refernece Methods */

        // Finalizing display, performing other initializations
        vm.finalizeDisplay = function () {
            vm.table.updateBetsOnTable();
        };

        // Finalize display for the page
        vm.finalizeDisplay();

    }

    //var casinoApp = angular.module('casinoApp', ['ngResource', 'ngSanitize']);
    var casinoApp = angular.module('casinoApp', []);
    //debugger;
    //casinoApp.controller('CasinoController', ['$scope', CasinoController]);
    casinoApp.controller('RouletteGameController', ['$scope', '$sce', '$http', '$interval', RouletteGameController]);

})();