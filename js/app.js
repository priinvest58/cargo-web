var priApp = angular.module('priApp', ['angularMoment']);

priApp.run([
    '$rootScope',
    '$window',
    function($rootScope, $window) {
        var firebaseConfig = {
            apiKey: "AIzaSyDOPOvzqM-9mcc9LusEVgVGLjOSbPtznD0",
            authDomain: "cargo-b06db.firebaseapp.com",
            projectId: "cargo-b06db",
            storageBucket: "cargo-b06db.appspot.com",
            messagingSenderId: "347536480650",
            appId: "1:347536480650:web:51081fac316e7db1ee5073",
            measurementId: "G-9ERFDC3CWQ"
        };
        // Initialize Firebase
        try {
            $window.firebase.initializeApp(firebaseConfig);
            $window.firebase.analytics();
            $rootScope.db = firebase.firestore();
            $rootScope.storage = firebase.storage();
        } catch (error) {}
    },
]);

priApp.controller('MainController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {
    $scope.trackingNumber = "";
    $scope.percels = [];
    $scope.parcel = null;
    $scope.isFound = false;
    $scope.tn = "";
    $scope.isLoading = true;

    loadTracker();
    loadParcels();

    $scope.searchParcel = function() {

        $scope.isLoading = true;
        $scope.parcel = null;
        $scope.isFound = false;


        try {
            $rootScope.db.collection('Parcels').where("trackingNumber", "==", $scope.trackingNumber).get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.parcel = data[0];
                    $timeout(function() {
                        $scope.isLoading = false;
                        if (data.length > 0) {
                            $scope.isFound = true;
                        } else {
                            $scope.isFound = false;
                        }

                        console.log($scope.isFound, $scope.isLoading);
                    }, 2000);



                });
            });

        } catch (error) {

        }

    }



    function loadTracker() {
        var trackID = $window.localStorage.getItem("trackid");
        $scope.trackingNumber = trackID;
    }




    function loadParcels() {

        try {
            $scope.isLoading = true;
            $scope.isFound = false;

            var trackid = $window.localStorage.getItem("trackid");
            $scope.trackingNumber = trackid;
            $rootScope.db.collection('Parcels').where("trackingNumber", "==", trackid).get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {

                    if (data.length > 0) {
                        $scope.parcel = data[0];
                        console.log(data[0]);
                        $scope.isLoading = false;
                        $scope.isFound = true;

                    } else {
                        $scope.parcel = null;
                        $scope.isLoading = false;
                        $scope.isFound = false;

                    }



                });
            });

        } catch (error) {

        }

    }

});

priApp.controller('LoginController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {


    $scope.user = {};

    $scope.login = function() {
        console.log($scope.user);

        if ($scope.user.username === "admin" || $scope.user.password === "12345") {

            $window.localStorage.setItem("user", "1");
            $window.location.href = "./dashboard.html";

        } else {

            alert("Invalid username or password");

        }


    }


    function loadCategoriesFromServer() {
        try {
            $rootScope.db.collection('categories').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                $scope.$apply(function() {
                    $scope.categories = data;

                });
                console.log('All numbers in collections', data);
            });
        } catch (error) {

        }
    };

    $scope.checkCatItems = function(cat) {

        $window.localStorage.setItem("currentCat", JSON.stringify(cat));
        console.log(cat);
        $window.location.href = "./main_cat.html";

    }


    $scope.submitForm = function() {

        var guid = createGuid();

        $rootScope.db
            .collection('categories')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                name: `${$scope.form.name}`,
            })
            .then(() => {
                $scope.form.name = "";
                loadNumbersFromServer();
                alert(`Created!`);

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });


    };



    function loadProducts() {
        try {
            $rootScope.db.collection('products').where("categoryID", "==", $scope.cat.id).get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.products = data;

                });
                console.log('All numbers in collections', data);
            });
        } catch (error) {

        }
    };

    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

});