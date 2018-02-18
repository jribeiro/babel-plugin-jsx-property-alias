
React.createClass({
  render: function ({ testID }) {
    return (<button testID={testID} foo="foo" />)
  }
});

React.createClass({
  render: function () {
    return (<Foo testID="bar" />)
  }
});
