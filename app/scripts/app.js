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
        { name: 'Blue',    length: '4:26', audioUrl: '/music/placeholders/blue' },
        { name: 'Green',   length: '3:14', audioUrl: '/music/placeholders/green' },
        { name: 'Red',     length: '5:01', audioUrl: '/music/placeholders/red' },
        { name: 'Pink',    length: '3:21', audioUrl: '/music/placeholders/pink' },
        { name: 'Magenta', length: '2:15', audioUrl: '/music/placeholders/magenta' }
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
 }]); //end blocJams.config //

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

 blocJams.controller('Collection.controller', ['$scope','SongPlayer', function($scope, SongPlayer) {
   $scope.albums = [];
 
   for (var i = 0; i < 33; i++) {
     $scope.albums.push(angular.copy(albumPicasso));
   } 
   
   $scope.playAlbum = function(album){
      SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
   };
 }]); // end Collection.controller //

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
   }; // end getSongState //

   $scope.playSong = function(song) {
     SongPlayer.setSong($scope.album, song);
   };
 
   $scope.pauseSong = function(song) {
      SongPlayer.pause();
   };
 }]); // Album.controller //

 // #40 - Create Song Player Service Tied to Playerbar. 1-13-2015 //
 blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.songPlayer = SongPlayer;
 }]);

  blocJams.service('SongPlayer', function() {
    // #42 - Playing Music. 1-13-2015 //
    var currentSoundFile = null;
    // #41 - Functional Next and Previous Buttons. 1-13-2015 //
    var trackIndex = function(album, song) {
       return album.songs.indexOf(song);
    };

    return {
       currentSong: null,
       currentAlbum: null,
       playing: false,
 
       play: function() {
         this.playing = true;
         currentSoundFile.play();  // #42 //
       },
       pause: function() {
         this.playing = false;
         currentSoundFile.play();  // #42 //
       },
       // #41 - Functional Next and Previous Buttons. 1-13-2015 //
       next: function() {
          var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
          currentTrackIndex++;
          if (currentTrackIndex >= this.currentAlbum.songs.length) {
            currentTrackIndex = 0;
          }
          var song = this.currentAlbum.songs[currentTrackIndex];  // #42 //
          this.setSong(this.currentAlbum, song);                  /* #42 */
       }, // next //

       previous: function() {
         var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
         currentTrackIndex--;
         if (currentTrackIndex < 0) {
           currentTrackIndex = this.currentAlbum.songs.length - 1;
         }
 
         var song = this.currentAlbum.songs[currentTrackIndex];  /* #42 */
         this.setSong(this.currentAlbum, song);                  /* #42 */
       }, // previous //

       setSong: function(album, song) {
         // #42 - Playing Music. 1-13-2015 //
         if (currentSoundFile) {
           currentSoundFile.stop();
         }  // end of #42 //
         this.currentAlbum = album;
         this.currentSong = song;

         // #42 - Playing Music. 1-13-2015 //
         currentSoundFile = new buzz.sound(song.audioUrl, {
         formats: [ "mp3" ],
         preload: true
         }); // currentSoundFile //
 
         this.play();
       } // setSong: //
     };  // return //
  });    // end blocJams.service('SongPlayer',) //
  
  // define the custom directive, 'slider' here. #43, Harry. 01-20-2015 // 
  blocJams.directive('slider', function() {
       var updateSeekPercentage = function($seekBar, event) {
       var barWidth = $seekBar.width();
       var offsetX =  event.pageX - $seekBar.offset().left;
       var offsetXPercent = (offsetX  / $seekBar.width()) * 100;
       
       offsetXPercent = Math.max(0, offsetXPercent);
       offsetXPercent = Math.min(100, offsetXPercent); 
       var percentageString = offsetXPercent + '%';
       $seekBar.find('.fill').width(percentageString);
       $seekBar.find('.thumb').css({left: percentageString});
      } // end var updateSeekPercentage //

      return {
        templateUrl: '/templates/directives/slider.html', 
        replace: true,
        restrict: 'E',
        link: function(scope, element, attributes) {
          var $seekBar = $(element);

          $seekBar.click(function(event) {
             updateSeekPercentage($seekBar, event);
          });
 
          $seekBar.find('.thumb').mousedown(function(event){
             $seekBar.addClass('no-animate');

             $(document).bind('mousemove.thumb', function(event){
                updateSeekPercentage($seekBar, event);
             });
 
             //cleanup
             $(document).bind('mouseup.thumb', function() {
               $seekBar.removeClass('no-animate');
               $(document).unbind('mousemove.thumb');
               $(document).unbind('mouseup.thumb');
             }); // end bind('mouseup.thumb') //
         });     // end mousedown //
        }        // end link //
      };         // end return //
  });            // end blocJams.directive('slider',) //