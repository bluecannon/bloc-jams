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
      { name: 'Blue',    length: 163.38, audioUrl: '/music/placeholders/blue' },
      { name: 'Green',   length: 105.66, audioUrl: '/music/placeholders/green' },
      { name: 'Red',     length: 270.14, audioUrl: '/music/placeholders/red' },
      { name: 'Pink',    length: 154.81, audioUrl: '/music/placeholders/pink' },
      { name: 'Magenta', length: 375.92, audioUrl: '/music/placeholders/magenta' }
   ]};  // end albumPicasso.


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
 }]);  // end of blocJams.controller('Landing.controller') 

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
     SongPlayer.isMuted = false;
   };
 
   $scope.pauseSong = function(song) {
      SongPlayer.pause();
      SongPlayer.isMuted = false;
   };

   $scope.muteSong = function(song) {
      SongPlayer.mute();
      SongPlayer.isMuted = true;
   };
 }]); // Album.controller //

 // #40 - Create Song Player Service Tied to Playerbar. 1-13-2015 //
 blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.songPlayer = SongPlayer;

    // #47 - volume control. 1-26-2015
    $scope.volumeClass = function() {
     return {
        'fa-volume-off':  SongPlayer.isMuted == true, 
        'fa-volume-down': SongPlayer.volume <= 70 && SongPlayer.volume > 0 && SongPlayer.isMuted == false,
        'fa-volume-up': SongPlayer.volume > 70 && SongPlayer.isMuted == false,
     }
    }

    SongPlayer.onTimeUpdate(function(event, time){
       $scope.$apply(function(){
          $scope.playTime = time;
       });
    });
 }]); // blocJams.controller('PlayerBar.controller',

 blocJams.service('SongPlayer', ['$rootScope', function($rootScope) {
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
       volume: 90, // default volume. #47 - volume control. 1-26-2015
       isMuted: false,

 
       mute: function(){
         if (this.isMuted === false){
            this.isMuted = true;
            currentSoundFile.mute(); 
         }
         else {
            currentSoundFile.unmute();   
            this.isMuted = false;
         }
       },

       play: function() {
         this.playing = true;
         currentSoundFile.play();  // #42 //
       },
       pause: function() {
         this.playing = false;
         currentSoundFile.pause();  // #42 //
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
       }, // previous 

         // #45, Making the Seek Bar Work with Music. 1-25-2015;
       seek: function(time) {
         // Checks to make sure that a sound file is playing before seeking.
         if(currentSoundFile) {
         // Uses a Buzz method to set the time of the song.
            currentSoundFile.setTime(time);
         }
       },  // seek

       onTimeUpdate: function(callback) {
          return $rootScope.$on('sound:timeupdate', callback);
       },

       // #47 - volume control. 1-26-2015
       setVolume: function(volume) {
         if(currentSoundFile){
           currentSoundFile.setVolume(volume);
         }
         this.volume = volume;
        },

       setSong: function(album, song) {
          // #42 - Playing Music. 1-13-2015 
          if (currentSoundFile) {
            currentSoundFile.stop();
          }  // end of currentSoundFile //
          this.currentAlbum = album;
          this.currentSong = song;

          // #42 - Playing Music. 1-13-2015 //
          currentSoundFile = new buzz.sound(song.audioUrl, {
             formats: [ "mp3" ],
             preload: true
          }); // currentSoundFile //

          // #47 - volume control. 1-26-2015
          currentSoundFile.setVolume(this.volume);
          currentSoundFile.bind('timeupdate', function(e){
              $rootScope.$broadcast('sound:timeupdate', this.getTime());
          }); // end of bind('timeupdate',
  
          this.play();
        } // setSong: 
    };    // return 
  }]);    // end blocJams.service('SongPlayer',) 
  
  // define the custom directive, 'slider' here. #43, Harry. 01-20-2015 // 
  blocJams.directive('slider', ['$document', function($document){
    // Returns a number between 0 and 1 to determine where the mouse event happened along the slider bar.
    var calculateSliderPercentFromMouseEvent = function($slider, event) {
        var offsetX =  event.pageX - $slider.offset().left; // Distance from left
        var sliderWidth = $slider.width(); // Width of slider
        var offsetXPercent = (offsetX  / sliderWidth);
        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(1, offsetXPercent);
        return offsetXPercent;
    }

    // #45, Making the Seek Bar Work with Music. 1-25-2015;
    var numberFromValue = function(value, defaultValue) {
     if (typeof value === 'number') {
       return value;
     }
     if(typeof value === 'undefined') {
       return defaultValue;
     }
     if(typeof value === 'string') {
       return Number(value);
     }
    }  // numberFromValue = function()
 
    return {
       templateUrl: '/templates/directives/slider.html', 
       replace: true,
       restrict: 'E',
         // Creates a scope that exists only in this directive.
         // #45, Making the Seek Bar Work with Music. 1-25-2015;
         scope: {
           onChange: '&'
         },
       link: function(scope, element, attributes) {
          // #44, Angular Slider Drag with Scope. 1-23-2015 
          // These values represent the progress into the song/volume bar, and its max value.
          // For now, we're supplying arbitrary initial and max values.

          scope.value = 0;
          // #44 - Switch to a more sensible default max
          scope.max = 100;
          var $seekBar = $(element);
          
          attributes.$observe('value', function(newValue) {
             scope.value = numberFromValue(newValue, 0);
          });
 
          attributes.$observe('max', function(newValue) {
             scope.max = numberFromValue(newValue, 100) || 100;
          });
 
          var percentString = function () {
             // #45, Making the Seek Bar Work with Music. 1-25-2015;
             var value = scope.value || 0;
             var max = scope.max || 100;
             percent = value / max * 100;
             return percent + "%";
          } 
          scope.fillStyle = function() {
             return {width: percentString()};
          } 
          scope.thumbStyle = function() {
             return {left: percentString()};
          }
          scope.onClickSlider = function(event) {
             var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
             scope.value = percent * scope.max;
             notifyCallback(scope.value);  // #45, Making the Seek Bar Work with Music. 1-25-2015; 
          }

          scope.trackThumb = function() {
             $document.bind('mousemove.thumb', function(event){
                var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
                scope.$apply(function(){
                  scope.value = percent * scope.max;
                  notifyCallback(scope.value); // #45, Making the Seek Bar Work with Music. 1-25-2015; 
                });
              }); // end of document.bind('mousemove.thumb',
 
              //cleanup
             $document.bind('mouseup.thumb', function(){
                $document.unbind('mousemove.thumb');
                $document.unbind('mouseup.thumb');
             });  // end bind('mouseup.thumb')
          };      // end scope.trackThumb

          // #45, Making the Seek Bar Work with Music. 1-25-2015; 
          // #45, Place this as the last function defined in the 'link' function of the directive.
          var notifyCallback = function(newValue) {
             if(typeof scope.onChange === 'function') {
                scope.onChange({value: newValue});
             }
          }; // end notifyCallback = function(newValue)
       }     // end link 
    };       // end return
 }]);        // Make sure to close out the parentheses and brackets

 // #46 - Adding a Timecode to the Music Player. 1-25-2015
 blocJams.filter('timecode', function(){
   return function(seconds) {
      seconds = Number.parseFloat(seconds);
      // Returned when no time is provided.
      if (Number.isNaN(seconds)) {
         return '-:--';
      }
      // make it a whole number
      var wholeSeconds = Math.floor(seconds);
      var minutes = Math.floor(wholeSeconds / 60);
      remainingSeconds = wholeSeconds % 60;
      var output = minutes + ':';
 
      // zero pad seconds, so 9 seconds should be :09
      if (remainingSeconds < 10) {
          output += '0';
      }
      output += remainingSeconds;
      return output;
   } // end of return function(seconds)
 })  // end of blocJams.filter('timecode'
