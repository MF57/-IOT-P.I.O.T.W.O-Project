/**
 * Created by mf57 on 21.04.2016.
 */

var myApp = angular.module('myApp', []);

myApp.controller('MainController', ['$scope', function ($scope) {
    
    $scope.width = 2;
    $scope.height = 3;

    $scope.board = [];
    $scope.selectedNode = {};



    $scope.refreshBoard = function() {
        $scope.board = {};
        $scope.board.columns = [];
        for (var i = 0; i < $scope.width; i++) {
            var column = {};
            column.nodes = [];
            for (var j = 0; j < $scope.height; j++) {
                var node = {};
                node.ip = '';
                node.animation = [];
                node.column = i;
                node.row = j;
                column.nodes.push(node);
            }
            $scope.board.columns.push(column);
        }
        $scope.selectedNode = $scope.board.columns[0].nodes[0];
        console.log($scope.board);
        console.log($scope.selectedNode);
    };

    $scope.selectNode = function(node) {
        $scope.selectedNode = node;
        console.log(node);
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
