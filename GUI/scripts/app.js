/**
 * Created by mf57 on 21.04.2016.
 */

var myApp = angular.module('myApp', ['ngDialog']);

myApp.controller('MainController', ['$scope', 'ngDialog', '$timeout', function ($scope, ngDialog, $timeout) {
    
    $scope.width = 2;
    $scope.height = 3;

    $scope.board = [];
    $scope.selectedNode = {};


  //  var client  = mqtt.connect('ws://localhost:3000');



    $scope.refreshBoard = function() {
        $scope.board = {};
        $scope.board.columns = [];
        for (var i = 0; i < $scope.width; i++) {
            var column = {};
            column.nodes = [];
            for (var j = 0; j < $scope.height; j++) {
                var node = {};
                node.ip = '';
                node.animations = [];
                node.column = i;
                node.row = j;
                node.style={"background-color":"none"};
                column.nodes.push(node);
            }
            $scope.board.columns.push(column);
        }
        $scope.selectedNode = $scope.board.columns[0].nodes[0];
    };

    $scope.selectNode = function(node) {
        $scope.selectedNode = node;
    };



    $scope.openNewAnimationPopup = function() {
        var dialog = ngDialog.open({
            template: "new_animation.html",
            controller: 'NewAnimationController',
            controllerAs: "ctrl"
        });
        dialog.closePromise.then(function (animation) {
            $scope.addAnimation(animation.value);
        });
    };

    $scope.addAnimation = function(animation) {
        $scope.selectedNode.animations.push(animation);
    };


    $scope.animate = function() {
        if($scope.selectedNode.animations.length === 0) {
            return;
        }
        var animation = $scope.selectedNode.animations[0];
        $scope.selectedNode.style = {"background-color": "rgb("+animation.color.r+","+animation.color.g+","+animation.color.b+")"};
        $timeout(callAtTimeout, $scope.selectedNode.animations[0].time, true, 0);
    };


    function callAtTimeout(i){
        if(i == $scope.selectedNode.animations.length-1) {
            $scope.selectedNode.style = {
                "background-color": "none"
            };
            return;
        }
        if($scope.selectedNode.animations[i+1].off === true) {
            $scope.selectedNode.style = {
                "background-color": "none"
            };
        } else {
            var animation = $scope.selectedNode.animations[i+1];
            $scope.selectedNode.style = {
                "background-color": "rgb("+animation.color.r+","+animation.color.g+","+animation.color.b+")"
            };
        }
        $timeout(callAtTimeout, $scope.selectedNode.animations[i+1].time, true, i+1);
    }

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
