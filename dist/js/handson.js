"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var MainApp = React.createClass({
    displayName: "MainApp",

    render: function render() {
        return React.createElement(Floor, { key: "firstFloor" });
    }
});

var Floor = React.createClass({
    displayName: "Floor",

    getEmployeeData: function getEmployeeData() {

        var peoples = [{
            ucid: 1,
            name: "Rahat Jha",
            position: "UI 1",
            team: "Spatans",
            projectUndertaken: "Dashboard"
        }, {
            ucid: 2,
            name: "Sanyam Agrawal",
            position: "UI 2",
            team: "Morpheus",
            projectUndertaken: "Inbox"
        }, {
            ucid: 3,
            name: "Umesh Saha",
            position: "UI 1",
            team: "Titans",
            projectUndertaken: "FlipAgent"
        }, {
            ucid: 4,
            name: "Darshan Khanna",
            position: "UI 2",
            team: "Titans",
            projectUndertaken: "Smart Assist"
        }, {
            ucid: 5,
            name: "Amkol K",
            position: "UI 2",
            team: "Atlas",
            projectUndertaken: "Authoring Console"
        }, {
            ucid: 6,
            name: "Nag Bansal",
            position: "SE 1",
            team: "NLP",
            projectUndertaken: "L1 Console"
        }];

        return peoples;
    },

    getFloorDetails: function getFloorDetails() {
        var tableToTeamMapping = [{
            id: 1,
            team: "Spatans",
            baySize: 4
        }, {
            id: 2,
            team: "NLP",
            baySize: 3
        }, {
            id: 3,
            team: "Atlas",
            baySize: 4
        }, {
            id: 4,
            team: "Titans",
            baySize: 4
        }, {
            id: 5,
            team: "Morpheus",
            baySize: 5
        }];

        return tableToTeamMapping;
    },

    getInitialState: function getInitialState() {
        return {
            employees: this.getEmployeeData(),
            cubicles: this.getFloorDetails()
        };
    },

    getBayNodes: function getBayNodes() {
        var cubicleNodes = [];

        this.state.cubicles.map((function (bayData) {
            cubicleNodes.push(React.createElement(Cubicle, { key: bayData.id, bay: bayData, employees: this.state.employees }));
        }).bind(this));

        return cubicleNodes;
    },

    filterByInput: function filterByInput() {
        var inputString = this.refs.inputToSearch.getValue();

        if (inputString) {
            inputString = inputString.toLowerCase();

            _.map(this.state.employees, function (employee) {
                if (employee.name.toLowerCase().indexOf(inputString) > -1) {
                    employee.isVisible = true;
                } else {
                    employee.isVisible = false;
                }
            });
        } else {
            this.resetValues();
        }
        this.setState({
            employees: this.state.employees
        });
    },

    resetValues: function resetValues() {
        _.map(this.state.employees, function (employee) {
            employee.isVisible = false;
        });
    },

    resetValueAndRender: function resetValueAndRender() {
        this.resetValues();
        this.setState({
            employees: this.state.employees
        });
    },

    searchByFilter: function searchByFilter(selections, typeOfFilter) {
        var employees;

        this.resetValues();
        employees = this.executeNewFilters(selections, typeOfFilter);

        if (employees) {
            _.map(employees, function (employee) {
                employee.isVisible = true;
            });
        }

        this.setState({
            employees: this.state.employees
        });
    },

    executeNewFilters: function executeNewFilters(selections, typeOfFilter) {
        var filteredEmployeeDetails, arrangeByFilterType;

        arrangeByFilterType = _.groupBy(this.state.employees, typeOfFilter);
        filteredEmployeeDetails = this.get(arrangeByFilterType, selections);

        return filteredEmployeeDetails;
    },

    get: function get(data, selection) {
        var arr = [];
        _.map(selection).map(function (name) {
            arr = arr.concat(data[name]);
        });

        return arr;
    },

    render: function render() {
        return React.createElement(
            "div",
            { className: "well container" },
            React.createElement(SearchFilters, { handleInputSearch: this.filterByInput,
                employees: this.state.employees,
                searchByFilter: this.searchByFilter,
                resetValues: this.resetValueAndRender,
                ref: "inputToSearch"

            }),
            React.createElement(
                "div",
                { className: "col-md-8 col-md-offset-2 cubical-container clearfix" },
                this.getBayNodes()
            )
        );
    }
});

var Cubicle = React.createClass({
    displayName: "Cubicle",

    SEAT_TYPE: {
        "DOWN_FACING_SEAT": "down-facing",
        "UP_FACING_SEAT": "up-facing"
    },

    getEmployeesByTeam: function getEmployeesByTeam() {
        return _.filter(this.props.employees, 'team', this.props.bay.team);
    },

    createCubicles: function createCubicles(employeesByTeam) {
        var count = 0,
            listOfCubicles = [];

        for (count; count < this.props.bay.baySize; count++) {
            var obj = {
                cubicalNo: [this.props.bay.id, count + 1].join(""),
                type: (count + 1) % 2 === 0 ? this.SEAT_TYPE.DOWN_FACING_SEAT : this.SEAT_TYPE.UP_FACING_SEAT,
                employee: employeesByTeam[count]
            };

            listOfCubicles.push(obj);
        }

        return listOfCubicles;
    },

    divideCubicles: function divideCubicles(listOfCubicles) {
        var cubicleGroups = _.groupBy(listOfCubicles, "type");
        return cubicleGroups;
    },

    getCubiclesDetails: function getCubiclesDetails() {
        var employeesByTeam = this.getEmployeesByTeam();
        var listOfCubicles = this.createCubicles(employeesByTeam);
        return this.divideCubicles(listOfCubicles);
    },

    getCubicalNodes: function getCubicalNodes(dataArray, workStation) {
        var cubicleNodes = [];

        dataArray.map((function (cubicalData) {
            if (cubicalData.employee) {
                cubicleNodes.push(React.createElement(Person, { data: cubicalData.employee, workstation: workStation }));
            } else {
                cubicleNodes.push(React.createElement(EmptySeat, { workstation: workStation }));
            }
        }).bind(this));

        return cubicleNodes;
    },
    render: function render() {
        var cubicalGroups = this.getCubiclesDetails();

        return React.createElement(
            "section",
            { className: "col-md-4 workstation-view relative" },
            this.getCubicalNodes(cubicalGroups[this.SEAT_TYPE.DOWN_FACING_SEAT], this.SEAT_TYPE.DOWN_FACING_SEAT),
            React.createElement(
                "div",
                { className: "centerAligned cubical-view" },
                this.props.bay.team
            ),
            this.getCubicalNodes(cubicalGroups[this.SEAT_TYPE.UP_FACING_SEAT], this.SEAT_TYPE.UP_FACING_SEAT)
        );
    }
});

var Person = React.createClass({
    displayName: "Person",

    render: function render() {

        var data = this.props.data,
            workstation = this.props.workstation,
            isVisible;

        isVisible = data.isVisible ? "isVisible" : "";

        return React.createElement(
            "div",
            { className: "inlineBlock person-container relative " + isVisible },
            React.createElement("div", { className: workstation + " semi-circle" }),
            React.createElement(
                "div",
                { className: "person-info absolute" },
                React.createElement(
                    "div",
                    { className: "image-person-info clearfix" },
                    React.createElement(
                        "div",
                        { className: "tableCell" },
                        React.createElement("img", { src: 'http://icons.iconarchive.com/icons/danleech/simple/512/facebook-icon.png',
                            className: "middleAlign image-circle ", height: "30", width: "30" })
                    ),
                    React.createElement(
                        "div",
                        { className: "middleAlign tableCell" },
                        React.createElement(
                            "div",
                            null,
                            data.name
                        ),
                        React.createElement(
                            "div",
                            { className: "subsectionText12" },
                            data.position
                        )
                    )
                ),
                React.createElement("div", { className: "breakDiv" }),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "subsectionText12" },
                        "Team"
                    ),
                    React.createElement(
                        "div",
                        { className: "subsectionText12Bold" },
                        data.team
                    )
                ),
                React.createElement("div", { className: "breakDiv" }),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "subsectionText12" },
                        "Current Project"
                    ),
                    React.createElement(
                        "div",
                        { className: "subsectionText12Bold" },
                        data.projectUndertaken
                    )
                )
            )
        );
    }
});

var EmptySeat = React.createClass({
    displayName: "EmptySeat",

    render: function render() {
        return React.createElement(
            "div",
            { className: " inlineBlock person-container relative" },
            React.createElement("div", { className: this.props.workstation + " semi-circle empty" })
        );
    }
});

var SearchFilters = React.createClass({
    displayName: "SearchFilters",

    getInitialState: function getInitialState() {
        return {
            showMoreFilters: false
        };
    },
    getValue: function getValue() {
        return this.refs.filterTextInput.getDOMNode().value;
    },

    onMoreFilter: function onMoreFilter() {
        this.setState({
            showMoreFilters: !this.state.showMoreFilters
        });
    },
    render: function render() {
        var handleInputSearch = this.props.handleInputSearch;
        return React.createElement(
            "div",
            { className: "col-md-8 col-md-offset-2 filter-container clearfix" },
            React.createElement("div", { className: " col-md-6" }),
            React.createElement(
                "div",
                { className: "col-md-6 relative" },
                React.createElement(
                    "div",
                    { className: "col-md-10" },
                    React.createElement("input", {
                        type: "text",
                        className: "form-control",
                        placeholder: "Search...",
                        ref: "filterTextInput",
                        onChange: handleInputSearch
                    })
                ),
                React.createElement(
                    "div",
                    { className: "filter-options" },
                    React.createElement(
                        "div",
                        { className: "col-md-2 filter-icon" },
                        React.createElement("i", { className: "fa fa-search fa-2x",
                            onClick: this.onMoreFilter, r: true })
                    ),
                    React.createElement(FilterBar, _extends({ key: this.state.showMoreFilters, show: this.state.showMoreFilters }, this.props))
                )
            )
        );
    }
});

var FilterBar = React.createClass({
    displayName: "FilterBar",

    getInitialState: function getInitialState() {
        return {
            forKey: "",
            keys: []
        };
    },
    filterSelected: function filterSelected(event) {
        var filterValue = event.target.id,
            keys;
        if (!filterValue) {
            return;
        }
        keys = Object.keys(_.groupBy(this.props.employees, filterValue));
        this.setState({
            forKey: filterValue,
            keys: keys
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.props.resetValues();
    },

    render: function render() {
        var shouldShowMoreFilters = this.props.show ? "show" : "hide";
        return React.createElement(
            "div",
            { className: shouldShowMoreFilters + " filter-by-options" },
            React.createElement(
                "div",
                { className: "col-md-12 filterOptions", onChange: this.filterSelected },
                React.createElement(
                    "span",
                    { className: "col-md-4" },
                    React.createElement("input", { id: "team", type: "radio", name: "filterEmployee" }),
                    React.createElement(
                        "label",
                        { htmlFor: "team" },
                        "Team"
                    )
                ),
                React.createElement(
                    "span",
                    { className: "col-md-4" },
                    React.createElement("input", { id: "position", type: "radio", name: "filterEmployee" }),
                    React.createElement(
                        "label",
                        { htmlFor: "position" },
                        "JobTitle"
                    )
                )
            ),
            React.createElement(MultiSelect, _extends({ key: this.state.forKey,
                keys: this.state.keys,
                typeKey: this.state.forKey
            }, this.props))
        );
    }
});

var MultiSelect = React.createClass({
    displayName: "MultiSelect",

    getInitialState: function getInitialState() {
        return {
            selections: []
        };
    },

    createCheckBoxNodes: function createCheckBoxNodes(keys) {
        var nodes = [];
        keys.map((function (key) {
            nodes.push(this.getCheckBoxNode(key));
        }).bind(this));
        return nodes;
    },

    isChecked: function isChecked(name) {
        this.state.selections.indexOf(name) > -1;
    },

    toggleSelection: function toggleSelection(name) {
        var idx = this.state.selections.indexOf(name);

        if (idx > -1) {
            //Remove Selection
            this.state.selections.splice(idx, 1);
        } else {
            //Add Selection
            this.state.selections.push(name);
        }

        if (this.props.searchByFilter) {
            this.props.searchByFilter.call(this, this.state.selections, this.props.typeKey);
        }
    },
    getCheckBoxNode: function getCheckBoxNode(name) {
        return React.createElement(
            "div",
            { className: "col-md-4 select-option" },
            React.createElement("input", { key: name,
                id: name,
                type: "checkbox",
                value: name,
                onChange: this.toggleSelection.bind(this, name) }),
            React.createElement(
                "label",
                { forName: "{name}" },
                name
            )
        );
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "col-md-12 multi-select-view" },
            this.createCheckBoxNodes(this.props.keys)
        );
    },

    componentWillUnmount: function componentWillUnmount() {
        this.props.resetValues();
        this.setState({
            selections: []
        });
    }
});

React.render(React.createElement(MainApp, null), document.getElementById("reactAppContainer"));
//# sourceMappingURL=handson.js.map
