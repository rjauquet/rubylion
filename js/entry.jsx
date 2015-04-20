var React   = require('react/addons'),
    marked  = require('marked');

var Main = React.createClass({
    getDefaultProps: function (){
        return {
            style: {
                width: '100px',
                height: 'auto',
            }
        };
    },
    getInitialState: function (){
        return {
            markup: '### Hello, me'
        };
    },
    render: function() {
        var markup = marked(this.state.markup, {sanitize: true});
        return (
            <div className="main" style={this.props.style}>
                <span dangerouslySetInnerHTML={{__html: markup}} />
            </div>
        );
    }
});

React.render(<Main />, document.getElementById('content'));