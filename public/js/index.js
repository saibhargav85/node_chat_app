var socket = io()

socket.on('connect', function () {
    console.log('connected to server');

});

socket.on('disconnect', function () {
    console.log('disconnected from server')
});

socket.on('newMessage', function (message) {
    formatedTime = moment(message.createdAt).format('h:mm a')
    console.log('newMessage', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formatedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    formatedTime = moment(message.createdAt).format('h:mm a')
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from} ${formatedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});

var locationButon = jQuery('#send-location');
locationButon.on('click', function () {
    if (!navigator.geolocation) {
        return alert('geo location not supported by browser');
    }

    locationButon.attr('disabled', 'disabled').text('Sending location...')

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButon.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButon.removeAttr('disabled').text('Send location');
        alert('Unable to reach geo location');
    })
});


