React.createClass({
  render: function (props) {
    return <div className="bar" testID="appiumSelector" {...props} accessibilityLabel="foo">
    Hello Wold!
    </div>;
  }
});
