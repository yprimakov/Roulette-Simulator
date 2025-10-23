/**
Roulette Wheel object
**/
var Wheel = function() {

    var numbers = [
        {
            name: "0",
            color: "green",
            oddeven: ""
        }, 
        {
            name: "1",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "2",
            color: "black",
            oddeven: "even"
        },
        {
            name: "3",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "4",
            color: "black",
            oddeven: "even"
        },
        {
            name: "5",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "6",
            color: "black",
            oddeven: "even"
        },
        {
            name: "7",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "8",
            color: "black",
            oddeven: "even"
        },
        {
            name: "9",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "10",
            color: "black",
            oddeven: "even"
        }, 
        {
            name: "11",
            color: "black",
            oddeven: "odd"
        },
        {
            name: "12",
            color: "red",
            oddeven: "even"
        }, 
        {
            name: "13",
            color: "black",
            oddeven: "odd"
        },
        {
            name: "14",
            color: "red",
            oddeven: "even"
        }, 
        {
            name: "15",
            color: "black",
            oddeven: "odd"
        },
        {
            name: "16",
            color: "red",
            oddeven: "even"
        }, 
        {
            name: "17",
            color: "black",
            oddeven: "odd"
        },
        {
            name: "18",
            color: "red",
            oddeven: "even"
        }, 
        {
            name: "19",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "20",
            color: "black",
            oddeven: "even"
        }, 
        {
            name: "21",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "22",
            color: "black",
            oddeven: "even"
        }, 
        {
            name: "23",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "24",
            color: "black",
            oddeven: "even"
        }, 
        {
            name: "25",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "26",
            color: "black",
            oddeven: "even"
        }, 
        {
            name: "27",
            color: "red",
            oddeven: "odd"
        },
        {
            name: "28",
            color: "black",
            oddeven: "even"
        }, 
        {
            name: "29",
            color: "black",
            oddeven: "odd"
        },
        {
            name: "30",
            color: "red",
            oddeven: "even"
        }, 
        {
            name: "31",
            color: "black",
            oddeven: "odd"
        },
        {
            name: "32",
            color: "red",
            oddeven: "even"
        }, 
        {
            name: "33",
            color: "black",
            oddeven: "odd"
        },
        {
            name: "34",
            color: "red",
            oddeven: "even"
        }, 
        {
            name: "35",
            color: "black",
            oddeven: "odd"
        },
        {
            name: "36",
            color: "red",
            oddeven: "even"
        }, 
        {
            name: "00",
            color: "green",
            oddeven: ""
        }
    ];

    // initializes main settings
    var handleInit = function() {
        
    };

    return {

        //main function to initiate the theme
        init: function() {
          
            handleInit(); // initialize core settings           
        },
        
        spin: function () {
            var random = Math.floor(Math.random() * numbers.length);

            return numbers[random];
        }

    };

}();


jQuery(document).ready(function() {    
    Wheel.init();
});