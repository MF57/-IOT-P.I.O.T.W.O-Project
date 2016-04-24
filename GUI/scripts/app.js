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
        for (var i = 0; i < $scope.width; i++) {
            for (var j = 0; j < $scope.height; j++) {
                var node = $scope.board.columns[i].nodes[j];
                if(node.animations.length > 0) {
                    var animation = node.animations[0];
                    if(animation.off == true) {
                        node.style = {
                            "background-color": "none"
                        };
                    } else {
                        node.style = {"background-color": "rgb("+animation.color.r+","+animation.color.g+","+animation.color.b+")"};
                    }
                    $timeout(callAtTimeout, node.animations[0].time, true, node, 0);
                }
            }
        }


    };


    function callAtTimeout(node, i){
        if(i == node.animations.length-1) {
            node.style = {
                "background-color": "none"
            };
            return;
        }
        if(node.animations[i+1].off == true) {
            node.style = {
                "background-color": "none"
            };
        } else {
            var animation = node.animations[i+1];
            node.style = {
                "background-color": "rgb("+animation.color.r+","+animation.color.g+","+animation.color.b+")"
            };
        }
        $timeout(callAtTimeout, node.animations[i+1].time, true, node, i+1);
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
