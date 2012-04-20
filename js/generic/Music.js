define(function() {
    var Music = function() {
        this.name = 'music';

        var self = this;
        var music = ['music/music.mp3', 'music/music.ogg'];

        var audio = document.createElement('audio');
        audio.volume = 1;

        var songLength = 4*60 + 24.90;
        var numBars = 24*4*4;
        var barLength = songLength/numBars;

        var barCounter = 1;
        var miniBarCounter = 1;
        var barCounterTimeId = 0;


        for(var i=0; i<music.length;i ++ ) {
            var source = document.createElement('source');
            source.src = music[i];
            audio.appendChild(source);
        }

        this.play = function() {
            audio.play();
        }

        this.barCounterTimer = function() {
            console.log(barCounter+'/'+(miniBarCounter-(barCounter*4)+4)+' (' +miniBarCounter+')');
            if (barCounter >= numBars) {
                console.log('aborting');
                clearTimeout(barCounterTimeId);
                return;
            }

            if (miniBarCounter++ % 4 == 0) {
                barCounter++;
            }

            barCounterTimeId = setTimeout(self.barCounterTimer, parseInt(barLength*4*1000));
        };

        this.getBarCounter = function() {
            return barCounter;
        }

        this.getSongLength = function() {
            return songLength;
        };

        this.getNumBars = function() {
            return numBars;
        };

        this.getBarLength = function() {
            return barLength;
        };

        return this;
    };

    return Music;
});

