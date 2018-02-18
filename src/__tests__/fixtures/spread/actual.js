const Button = React.createClass({
  render: function ({ testID }) {
    return (<button testID={testID} />)
  }
});

const Main = React.createClass({
  render: function (props) {
    return (<Button {...props} />)
  }
});

React.createElement(Main, {
  testID: 'foo'
});
