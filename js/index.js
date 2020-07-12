var socket = io();

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = jQuery('li:last-child')
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        console.log('Scroll top down')
        messages.scrollTop(scrollHeight);
    }

}

socket.on("connect", function () {
    console.log("connected to server");
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = "/";
        } else {
            alert('welcome to Vizz Chat App');
            console.log('no error found')
        }

    })

});

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});


socket.on("disconnect", function () {
    console.log("diconnected from server");

});

/*
socket.on("newMsg",function(msg){
    console.log("New Message",msg);
    var li = jQuery('<li></li>');
    li.text(msg.text);
    jQuery('#messages').append(li);


});


jQuery('#message-form').on('submit',function(e){
    var messageTextbox = jQuery('[name=message]');
    e.preventDefault();
    socket.emit('createMsg',{
        text:messageTextbox.val()
    },function(){
        messageTextbox.val('')
    });

});

*/
socket.on('newMsg', function (message) {
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,

    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMsg', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('')
    });
});