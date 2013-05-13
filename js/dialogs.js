(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //TODO I bet there is a angularjs way to handle dialogs instead...

    ploxworld.dialogs = [];
    var dialogs = ploxworld.dialogs;

    ploxworld.showDialog = function (dialogId) {
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

    $(document).keyup(function (e) {
        if (e.which === 27) {
            ploxworld.closeDialog();
        }
    });
})();

