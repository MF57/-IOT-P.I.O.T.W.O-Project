/**
 * Created by mf57 on 21.04.2016.
 */

var myApp = angular.module('myApp', []);

myApp.controller('MainController', ['$scope', function ($scope) {
    
    $scope.width = 2;
    $scope.height = 3;

    $scope.nodes = [];



    $scope.refreshBoard = function() {
        $scope.nodes = [];
        for (var i = 0; i < $scope.height; i++) {
            var row = [];
            for (var j = 0; j < $scope.width; j++) {
                var node = {};
                node.ip = '';
                node.animation = [];
                node.row = i;
                node.column = j;
                row.push(node);
            }
            $scope.nodes.push(row);
        }
        console.log($scope.nodes);
    };


    // var client  = mqtt.connect('ws://localhost:3000');
    //
    // client.on('connect', function () {
    //     client.subscribe('presence');
    //     client.publish('presence', 'Hello mqtt');
    // });
    //
    // client.on('message', function (topic, message) {
    //     // message is Buffer
    //     console.log(message.toString());
    //     client.end();
    // });


    $scope.refreshBoard();

}]);
