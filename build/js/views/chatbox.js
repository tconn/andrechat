var socket = io();
var chatHistory = [];

var ChatBox = React.createClass({displayName: "ChatBox",
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function(){
    var that = this;
    socket.on('chat message', function(msg){
      chatHistory.push(msg);
      that.setState({data: chatHistory});
    });
  },
  render: function() {
    return (
      React.createElement("div", {className: "chatBox"}, 
        React.createElement(SendMessageForm, null), 
        React.createElement("h1", null, "Messages"), 
        React.createElement(MessageList, {data: this.state.data})
      )
    );
  }
});

var MessageList = React.createClass({displayName: "MessageList",
  render: function() {
    var messageNodes = this.props.data.map(function (message) {
      return (
        React.createElement(Message, {sender: message.sender}, 
          message.body
        )
      );
    });

    return (
      React.createElement("div", {className: "messageList"}, 
        messageNodes
      )
    );
  }
});

var Message = React.createClass({displayName: "Message",
  render: function() {
    return (
      React.createElement("div", {className: "message"}, 
        React.createElement("h2", {className: "messageSender"}, 
          this.props.sender
        ), 
        this.props.children
      )
    );
  }
});

var SendMessageForm = React.createClass({displayName: "SendMessageForm",
  handleSubmit: function(e) {
    e.preventDefault();

    var messageDom = this.refs.message.getDOMNode();


    var user = this.refs.user.getDOMNode().value.trim();
    var message = messageDom.value.trim();

    if(!user || !message){
      return;
    }

    messageDom.value = '';
    messageDom.focus();

    socket.emit('chat message', {"sender": user, "body":message});

  },
  render: function() {
    return (
      React.createElement("form", {className: "newMessageForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", ref: "user", placeholder: "Your name..."}), 
        React.createElement("input", {type: "text", ref: "message", placeholder: "Say something..."}), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});


React.render(
  React.createElement(ChatBox, null),
  document.getElementById('content')
);