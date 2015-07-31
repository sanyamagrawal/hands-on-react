
var MainApp = React.createClass({
    render() {
        return (
            <Floor key="firstFloor"/>
        );
    }
});

var Floor = React.createClass({

    getEmployeeData() {

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

    getFloorDetails() {
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

    getInitialState() {
        return {
            employees: this.getEmployeeData(),
            cubicles: this.getFloorDetails()
        };
    },

    getBayNodes() {
        var cubicleNodes = [];

        this.state.cubicles.map(function(bayData) {
            cubicleNodes.push(<Cubicle key={bayData.id} bay={bayData} employees={this.state.employees}/>);
        }.bind(this));

        return cubicleNodes;
    },

    filterByInput() {
        var inputString = this.refs.inputToSearch.getValue();

        if (inputString) {
            inputString = inputString.toLowerCase();

            _.map(this.state.employees, function(employee) {
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

    resetValues() {
        _.map(this.state.employees, function(employee) {
            employee.isVisible = false;
        });

    },

    resetValueAndRender() {
        this.resetValues();
        this.setState({
            employees: this.state.employees
        });
    },

    searchByFilter(selections, typeOfFilter) {
        var employees;

        this.resetValues();
        employees = this.executeNewFilters(selections, typeOfFilter);

        if (employees) {
            _.map(employees, function(employee) {
                employee.isVisible = true;

            });
        }

        this.setState({
            employees: this.state.employees
        });
    },

    executeNewFilters(selections, typeOfFilter) {
        var filteredEmployeeDetails,
            arrangeByFilterType;

        arrangeByFilterType = _.groupBy(this.state.employees, typeOfFilter);
        filteredEmployeeDetails = this.get(arrangeByFilterType, selections);

        return filteredEmployeeDetails;
    },

    get(data, selection) {
        var arr = [];
        _.map(selection).map(function(name) {
            arr = arr.concat(data[name]);
        });

        return arr;
    },

    render() {
        return (
            <div className="well container">
                <SearchFilters handleInputSearch={this.filterByInput}
                               employees={this.state.employees}
                               searchByFilter={this.searchByFilter}
                               resetValues={this.resetValueAndRender}
                               ref="inputToSearch"

                    />

                <div className="col-md-8 col-md-offset-2 cubical-container clearfix">
                    {this.getBayNodes()}
                </div>
            </div>
        );
    }
});

var Cubicle = React.createClass({

    SEAT_TYPE: {
        "DOWN_FACING_SEAT": "down-facing",
        "UP_FACING_SEAT": "up-facing"
    },

    getEmployeesByTeam() {
        return _.filter(this.props.employees, 'team', this.props.bay.team);
    },

    createCubicles: function(employeesByTeam) {
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

    divideCubicles: function(listOfCubicles) {
        var cubicleGroups = _.groupBy(listOfCubicles, "type");
        return cubicleGroups;
    },

    getCubiclesDetails() {
        var employeesByTeam = this.getEmployeesByTeam();
        var listOfCubicles = this.createCubicles(employeesByTeam);
        return this.divideCubicles(listOfCubicles);
    },

    getCubicalNodes(dataArray, workStation) {
        var cubicleNodes = [];

        dataArray.map(function(cubicalData) {
            if (cubicalData.employee) {
                cubicleNodes.push(<Person data={cubicalData.employee} workstation={workStation}/>);
            } else {
                cubicleNodes.push(<EmptySeat workstation={workStation}/>);
            }
        }.bind(this));

        return cubicleNodes;
    },
    render() {
        var cubicalGroups = this.getCubiclesDetails();

        return (
            <section className="col-md-4 workstation-view relative">
                {this.getCubicalNodes(cubicalGroups[this.SEAT_TYPE.DOWN_FACING_SEAT], this.SEAT_TYPE.DOWN_FACING_SEAT)}

                <div className="centerAligned cubical-view">
                    {this.props.bay.team}
                </div>
                {this.getCubicalNodes(cubicalGroups[this.SEAT_TYPE.UP_FACING_SEAT], this.SEAT_TYPE.UP_FACING_SEAT)}
            </section>
        );

    }
});

var Person = React.createClass({
    render() {

        var data = this.props.data,
            workstation = this.props.workstation,
            isVisible;

        isVisible = data.isVisible ? "isVisible" : "";

        return (
            <div className={"inlineBlock person-container relative " + isVisible}>
                <div className={workstation + " semi-circle"}></div>
                <div className="person-info absolute">
                    <div className="image-person-info clearfix">
                        <div className="tableCell">
                            <img src='http://icons.iconarchive.com/icons/danleech/simple/512/facebook-icon.png'
                                 className="middleAlign image-circle " height="30" width="30"/>
                        </div>
                        <div className="middleAlign tableCell">
                            <div>{data.name}</div>
                            <div className="subsectionText12">{data.position}</div>
                        </div>
                    </div>

                    <div className="breakDiv"></div>

                    <div>
                        <div className="subsectionText12">Team</div>
                        <div className="subsectionText12Bold">{data.team}</div>
                    </div>

                    <div className="breakDiv"></div>

                    <div>
                        <div className="subsectionText12">Current Project</div>
                        <div className="subsectionText12Bold">{data.projectUndertaken}</div>
                    </div>
                </div>
            </div>
        );
    }
});

var EmptySeat = React.createClass({
    render() {
        return (<div className=" inlineBlock person-container relative">
            <div className={this.props.workstation + " semi-circle empty"}></div>
        </div>);
    }
});

var SearchFilters = React.createClass({
    getInitialState() {
        return {
            showMoreFilters: false
        };
    },
    getValue() {
        return this.refs.filterTextInput.getDOMNode().value;
    },

    onMoreFilter() {
        this.setState({
            showMoreFilters: !this.state.showMoreFilters
        });
    },
    render() {
        var handleInputSearch= this.props.handleInputSearch;
        return (
            <div className="col-md-8 col-md-offset-2 filter-container clearfix">
                <div className=" col-md-6"></div>

                <div className="col-md-6 relative">
                    <div className="col-md-10">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            ref="filterTextInput"
                            onChange={handleInputSearch}
                            />
                    </div>
                    <div className="filter-options">
                        <div className="col-md-2 filter-icon">
                            <i className="fa fa-search fa-2x"
                               onClick={this.onMoreFilter} r></i>
                        </div>

                        <FilterBar key={this.state.showMoreFilters} show={this.state.showMoreFilters} {...this.props}/>
                    </div>
                </div>
            </div>
        );
    }
});

var FilterBar = React.createClass({
    getInitialState() {
        return {
            forKey: "",
            keys: []
        }
    },
    filterSelected(event) {
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
    componentWillUnmount() {
        this.props.resetValues();
    },

    render() {
        var shouldShowMoreFilters = this.props.show ? "show" : "hide";
        return (
            <div className={shouldShowMoreFilters + " filter-by-options"}>
                <div className="col-md-12 filterOptions" onChange={this.filterSelected}>
                    <span className="col-md-4">
                        <input id="team" type="radio" name="filterEmployee"/>
                        <label htmlFor="team">Team</label>
                    </span>

                    <span className="col-md-4">
                        <input id="position" type="radio" name="filterEmployee"/>
                        <label htmlFor="position">JobTitle</label>
                    </span>
                </div>

                <MultiSelect key={this.state.forKey}
                             keys={this.state.keys}
                             typeKey={this.state.forKey}
                    {...this.props}/>
            </div>
        )
    }
});

var MultiSelect = React.createClass({
    getInitialState() {
        return {
            selections: []
        };

    },

    createCheckBoxNodes(keys) {
        var nodes = [];
        keys.map(function(key) {
            nodes.push(this.getCheckBoxNode(key));
        }.bind(this));
        return nodes;
    },

    isChecked: function(name) {
        this.state.selections.indexOf(name) > -1;
    },

    toggleSelection(name) {
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
    getCheckBoxNode(name) {
        return (
            <div className="col-md-4 select-option">
                <input key={name}
                       id={name}
                       type="checkbox"
                       value={name}
                       onChange={this.toggleSelection.bind(this,name)}/>
                <label forName="{name}">{name}</label>
            </div>
        );
    },
    render() {
        return (
            <div className="col-md-12 multi-select-view">
                {this.createCheckBoxNodes(this.props.keys)}
            </div>
        );
    },

    componentWillUnmount() {
        this.props.resetValues();
        this.setState({
            selections: []
        });
    }
});

React.render(<MainApp />, document.getElementById("reactAppContainer"));
