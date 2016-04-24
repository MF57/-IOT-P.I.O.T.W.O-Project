/**
 * Created by mf57 on 21.04.2016.
 */

var myApp = angular.module('myApp', []);

myApp.controller('MainController', ['$scope', function ($scope) {


    var client  = mqtt.connect('ws://localhost:3000');

    client.on('connect', function () {
        client.subscribe('presence');
        client.publish('presence', 'Hello mqtt');
    });

    client.on('message', function (topic, message) {
        // message is Buffer
        console.log(message.toString());
        client.end();
    });

}]);
