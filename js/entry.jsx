React = require('react/addons');

var Main = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});

React.render(<Main />, document.getElementById('content'));