"use strict";

var MainApp = React.createClass({
    displayName: "MainApp",

    render: function render() {
        return React.createElement(
            "main",
            { className: "well centerAligned" },
            React.createElement(
                "h1",
                null,
                "React Hands On Session"
            )
        );
    }
});

React.render(React.createElement(MainApp, null), document.getElementById("reactAppContainer"));
//# sourceMappingURL=handson.js.map
