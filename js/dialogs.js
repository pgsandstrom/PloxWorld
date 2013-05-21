(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //XXX I bet there is a angularjs way to handle dialogs instead...
    //TODO dialogs are still completely broken, they only show up in the order I specified in the html

    ploxworld.dialogs = [];
    var dialogs = ploxworld.dialogs;

    ploxworld.showDialog = function (dialogId) {
        console.log("show dialog");
        var $dialog = $('#' + dialogId);
        dialogs.push($dialog);
        $dialog.show();

        jQuery('.close-button', $dialog).bind('click', ploxworld.closeDialog);
    };

    ploxworld.closeDialog = function () {
        var $dialog = dialogs.pop();
        if ($dialog !== undefined) {
            $($dialog).hide();
            jQuery('.close-button', $dialog).unbind('click');
        } else {
            console.log("no dialog open");
        }
    };

})();

