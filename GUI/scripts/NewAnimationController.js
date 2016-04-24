/**
 * Created by mf57 on 24.04.2016.
 */
angular.module('myApp').controller('NewAnimationController', ["$scope", function ($scope) {
    
        var self = this;

        self.animation = {};
        self.animation.off = false;

        self.addAnimation = function () {
            $scope.closeThisDialog(self.animation);
        }
}]);