"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Template = require("./Template");

var _Template2 = _interopRequireDefault(_Template);

var MainApp = _react2["default"].createClass({
    displayName: "MainApp",

    getInitialState: function getInitialState() {
        return {
            text: "Sanyam Hands On Session"
        };
    },

    render: _Template2["default"]
});

_react2["default"].render(_react2["default"].createElement(MainApp, null), document.getElementById("reactAppContainer"));
//# sourceMappingURL=handson.js.map
