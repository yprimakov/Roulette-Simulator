/**
Global site library
**/
var Global = function () {

    // initializes main settings
    var handleInit = function () {

    };

    return {

        //main function to initiate the theme
        init: function () {

            handleInit(); // initialize core settings           
        },

        displayMessage: function (msg, props) {
                props = props || {};
                props.params = props.params || {};
                props.type = props.type || 'info';
                props.align = props.align || 'center';
                props.offsetAmount = props.offsetAmount || 250;
                props.offsetFrom = props.offsetFrom || 'top';
                props.width = props.width || 'auto';
                props.delay = props.delay || '5000';
                props.allow_dismiss = props.allow_dismiss || true;
                props.stackup_spacing = props.stackup_spacing || 10;

                $.bootstrapGrowl(msg, {
                    type: props.type, // (null, 'info', 'danger', 'success', 'warning')
                    offset: {
                        from: props.offsetFrom,
                        amount: props.offsetAmount
                    },
                    align: props.align,
                    width: props.width,
                    delay: props.delay,
                    allow_dismiss: props.allow_dismiss,
                    stackup_spacing: props.stackup_spacing
                });
            
        }

};

}();


jQuery(document).ready(function () {
    Global.init();
});