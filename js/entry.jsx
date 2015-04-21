var React   = require('react/addons'),
    marked  = require('marked');

var Main = React.createClass({
    getDefaultProps: function (){
        return {
            style: {
                width: 'auto',
                height: 'auto',
            }
        };
    },
    getInitialState: function (){
        return {
            markup: '## Hello, me\n## Hello, you'
        };
    },
    render: function() {
        var text = '';
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          text = marked(this.state.markup, {sanitize: true});
        } else {
            text = 'File reading not supported by this browser';
        }
        return (
            <div className="main" style={this.props.style}>
                <span dangerouslySetInnerHTML={{__html: text}} />
            </div>
        );
    }
});

React.render(<Main />, document.getElementById('content'));