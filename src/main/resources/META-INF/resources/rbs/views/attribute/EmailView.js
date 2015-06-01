/**
 * Represents an e-mail type input
 */
define(["./InputView", "underscore"], function (inputView, _) {
    "use strict";

    return inputView.extend({
        type: "email"
    });
});