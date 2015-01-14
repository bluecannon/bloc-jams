 //require('./landing');    // #35 Angularizing the Landing Page. // 
 //require('./album');
 //require('./collection');
 //require('./profile');

  // #37 Angularize Collection Page. 1-08-2015 //
  // Example Album
 
 var albumPicasso = {
   name: 'The Colors',
   artist: 'Pablo Picasso',
   label: 'Cubism',
   year: '1881',
   albumArtUrl: '/images/album-placeholder.png',
   songs: [
       { name: 'Blue', length: '4:26' },
       { name: 'Green', length: '3:14' },
       { name: 'Red', length: '5:01' },
       { name: 'Pink', length: '3:21'},
       { name: 'Magenta', length: '2:15'}
     ]
 };

 // #36, Single Page App. 1-08-2015. Here's how it looks when we include ui-router in Bloc Jams //
 blocJams = angular.module('BlocJams', ['ui.router']); 

 blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   // #36 - Starting a Single Page Architecture. 12/20/2014 //
   $locationProvider.html5Mode(true);
   $stateProvider.state('landing', {
     url: '/',
     controller: 'Landing.controller',
     templateUrl: '/templates/landing.html'
   });
   // #37 - Angularize Collection Page. 1-08-2015 //
   $stateProvider.state('collection', {
     url: '/collection',
     controller: 'Collection.controller',
     templateUrl: '/templates/collection.html'
   });

   // #38 - Angularize Album Page. 1-12-2015 //
   $stateProvider.state('album', {
     url: '/album',
     templateUrl: '/templates/album.html',
     controller: 'Album.controller'
   });

 }]);

 // This is a cleaner way to call the controller than crowding it on the module definition. //
 blocJams.controller('Landing.controller', ['$scope', function($scope) { 
     $scope.subText = "Turn the music up, Harry!";

     $scope.subTextClicked = function() {
         $scope.subText += '!';
     };

     $scope.albumURLs = [
     '/images/album-placeholders/album-1.jpg',
     '/images/album-placeholders/album-2.jpg',
     '/images/album-placeholders/album-3.jpg',
     '/images/album-placeholders/album-4.jpg',
     '/images/album-placeholders/album-5.jpg',
     '/images/album-placeholders/album-6.jpg',
     '/images/album-placeholders/album-7.jpg',
     '/images/album-placeholders/album-8.jpg',
     '/images/album-placeholders/album-9.jpg',
     ];
 }]);  // end of Landing.controller //

 blocJams.controller('Collection.controller', ['$scope', function($scope) {
   $scope.albums = [];
 
   for (var i = 0; i < 33; i++) {
     $scope.albums.push(angular.copy(albumPicasso));
   } 
 }]);

 // #38 - Angularize Album Page. 1-12-2015 //
 blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
   $scope.album = angular.copy(albumPicasso);

   var hoveredSong = null;
    
   $scope.onHoverSong = function(song) {
     hoveredSong = song;
   };
 
   $scope.offHoverSong = function(song) {
     hoveredSong = null;
   };

   $scope.getSongState = function(song) {
     if (song === SongPlayer.currentSong && SongPlayer.playing) {
       return 'playing';
     }
     else if (song === hoveredSong) {
       return 'hovered';
     }
     return 'default';
   };

   $scope.playSong = function(song) {
     SongPlayer.setSong($scope.album, song);
     SongPlayer.play();
    };
 
    $scope.pauseSong = function(song) {
      SongPlayer.pause();
    };
 }]);

 blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;
}]);
 
 // #40 - Create Song Player Service Tied to Playerbar. 1-13-2015 //
 blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
   $scope.songPlayer = SongPlayer;
 }]);
 
 blocJams.service('SongPlayer', function() {
   return {
     currentSong: null,
     currentAlbum: null,
     playing: false,
 
     play: function() {
       this.playing = true;
     },
     pause: function() {
       this.playing = false;
     },
     setSong: function(album, song) {
       this.currentAlbum = album;
       this.currentSong = song;
     }
   };
 });