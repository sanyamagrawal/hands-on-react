var MainApp = React.createClass({
    render() {
        return (
            <main className="well centerAligned">
                <h1>React Hands On Session</h1>
            </main>
        );
    }
});

React.render(<MainApp />, document.getElementById("reactAppContainer"));
