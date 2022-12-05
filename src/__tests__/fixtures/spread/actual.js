const Button = React.createClass({
  render: function ({ testID, objToSpread }) {
    return (<button testID={testID} {...objToSpread} />)
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
