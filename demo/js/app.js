var MidiPlayer = MidiPlayer;
var loadFile, loadDataUri, Player;
var AudioContext = window.AudioContext || window.webkitAudioContext || false; 
var ac = new AudioContext || new webkitAudioContext;
var eventsDiv = document.getElementById('events');
var serverUrl = "https://app.lepouletdudimanche.com/metronomic/"

var changeTempo = function(tempo) {
	Player.tempo = tempo;
}

var play = function() {
	Player.play();
	$('#play-action').toggleClass('fa-play-circle fa-pause-circle');
}

var pause = function() {
	Player.pause();
	$('#play-action').toggleClass('fa-pause-circle fa-play-circle');
}

var stop = function() {
	Player.stop();
	if($('#play-action').hasClass('fa-play-circle'))
		$('#play-action').toggleClass('fa-pause-circle fa-play-circle');
}

var buildTracksHtml = function() {
	Player.tracks.forEach(function(item, index) {
		var trackDiv = document.createElement('div');
		trackDiv.id = 'track-' + (index+1);
		var h5 = document.createElement('h5');
		h5.innerHTML = 'Track ' + (index+1);
		var code = document.createElement('code');
		trackDiv.appendChild(h5);
		trackDiv.appendChild(code);
		eventsDiv.appendChild(trackDiv);
	});
}
//FluidR3_GM, MusyngKite
// http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/
//https://cindyjs.org/dist/v0.8.7/soundfonts/   https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/
Soundfont.instrument(ac, 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/acoustic_grand_piano-mp3.js').then(function (instrument) {
	document.getElementById('loading').style.display = 'none';

	loadFile = function() {
		var file    = document.querySelector('input[type=file]').files[0];
		var reader  = new FileReader();
		if (file) reader.readAsArrayBuffer(file);

		eventsDiv.innerHTML = '';

		reader.addEventListener("load", function () {
			Player = new MidiPlayer.Player(function(event) {
				if (event.name == 'Note on') {
					instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
					//document.querySelector('#track-' + event.track + ' code').innerHTML = JSON.stringify(event);
        		}

				document.getElementById('tempo-display').innerHTML = Player.tempo;
				// document.getElementById('file-format-display').innerHTML = Player.format;
				document.getElementById('play-bar').style.width = 100 - Player.getSongPercentRemaining() + '%';
			});

			Player.loadArrayBuffer(reader.result);
			
			document.getElementById('play-button').removeAttribute('disabled');

			//buildTracksHtml();
			play();
		}, false);
	}

	loadDataUri = function(dataUri) {
		Player = new MidiPlayer.Player(function(event) {
			if (event.name == 'Note on' && event.velocity > 0) {
				instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
				//document.querySelector('#track-' + event.track + ' code').innerHTML = JSON.stringify(event);
				//console.log(event);
      		}
      		document.getElementById('tempo-display').innerHTML = Player.tempo;
			// document.getElementById('file-format-display').innerHTML = Player.format;	
			document.getElementById('play-bar').style.width = 100 - Player.getSongPercentRemaining() + '%';
		});

		Player.loadDataUri(dataUri);

		document.getElementById('play-button').removeAttribute('disabled');

		//buildTracksHtml();
		// play();
	}

  loadDataUri(mario);
  updateState (Player.tempo);
  
});

function updateState( index ) {
	$(document).ready(function(){
		$.get(serverUrl + index,
			function(data, status){
				if(status = "success" ){
					$('.play-state').text(data.name);
					$('.speed-range').text(data.name);
					$('.speed').text(index);
					$('.slider-bar').val(index);
				}
				else
					return;
			}
		);
	});
}


var mario = 'data:audio/midi;base64,TVRoZAAAAAYAAAABAeBNVHJrAABBmAD/Awhkw6lnYWfDqQD/BBRTdGVpbndheSBHcmFuZCBQaWFubwD/WAQEAhgIAP9ZAgAAAP9UBSEAAAAAAP9RAwZFT4QHkCpIA5A2NQWQMUMhgDZACYAqQASAMUCCWpA9OgGQOiIDgDpABpA/HAWAP0ADkEIuAYBCQAaAPUCCS5AxTQOQNi8QgDZAB4AxQAaQKjAAgCpAgmSQOkwZkD8dAYA6QASQPTUBgD9AAZBCMwSAPUAFgEJAgmOQKjAHkDY1DYAqQASQMTABgDFAIIA2QIIhkDpMB5A9RAqQQigIgDpABYBCQAKAPUCCTZA2RAuQKkQNgDZACIAqQAWQMS4BgDFAgkKQRkoWkFJIApA9QxaAPUABkDo2B4A6QAqQTioCgEZAAYBOQBKAUkBokFJBBJBGQxaQTgkGgEZAA4BOQA2AUkCBJJBSRwKQKkEBkEY8C4AqQAyARkAYkE4aAYBOQAGAUkCCPZBSTAOQRkwNkDooAZA2RAGQPTgLgD1AAoA6QASQThMIgEZAAYBOQBGANkAAUkBokEZHG5BSPxmARkAFgFJAgQ2QUmEBkEZID5AqShqAKkAMgEZAGIBSQIIkkEZEFpBSRBCQPRoBkDZBAYA9QAmQThMDkDozC4A6QAGATkAEgEZAEIBSQAaANkBskEZDApBSRhaQThAXgEZAAYBOQASAUkCBBJAsVQSQTkMBkFNJAZBHTw6QIBsBgCBAE4AsQBCAR0AGgE5ABoBTQGOQUz0FkEc6BZBOPxSAR0AFgFNAG4BOQIEFkDhAC5BQFgOQNSADkDssAYA7QAaANUABgFBAAoA4QAqQRCcBgERAglSQGS0BgBlAgmOQO0oGkEFaBJA4TABNTgKQNUkLkElHAYA7QBSAOEAPgDVAAoBBQAeATUAEgElAb5BNRwaQQUsOkEkwFIBBQA6ATUAEgElAgQGQRFUEkFBOA5AsRg2QIBsAgCBAEoBEQAGALEABgFBAglCQNUoBkE1NApBBUAWQOEYMkDsvAYA7QAmAOEAJkEksBoBJQASANUABgE1AAYBBQG+QQUgakE00G4BBQAOATUALkEkaAYBJQHmQTWATkBkZAZBBSgGAGUAKkCUyAYAlQAaQSQ0FgElAC4BBQAWATUCCM5A/TAqQSz8BkDhHDJA1MgA7NASAO0AKgDhAAYA/QAGAS0ABkEYpAYBGQAyANUCBE5BNNAKQQRkBgEFAA4BNQIEMkEJRApBOTA2QKkICkB4gB4AeQAeAQkABgE5ADIAqQHaQRE4GkFBEFYBEQAuAUECBHZBSWAGQRlgHkD0pB5A2RQeQOjoDgD1AEoA6QBKANkCCPZAlRwuQGSsBgBlAD4AlQIFhgEZACIBSQGuQUlMCkD9TAZBGTBeAP0AJkDYUBIA2QAWQTjADkDosAIA6QAqARkADgE5AF4BSQG6QUkAekEYnBJBOIwKAUkABgEZAAYBOQHmQUk4BkEZJEJAqQASQHjALgB5AB4AqQBWQTiICgEZAAYBOQBSAUkCCOpBSSgKQRlAGkDZMBpA6KwWQPTUCgD1ACoA6QAmQTiwLgE5AAYBGQAeANkAKgFJAYZBSRAKQRjwhkE4nC4BGQAGATkABgFJAgQSQUksBkCVNB5BGSAAZGgGQTjUHgBlACoAlQBSATkAEgEZAAoBSQIECkEZEG4BGQIEnkEZPApBSQwmQNkUEkE5AHIBOQAGARkAFgFJADIA2QE2QRkUKkE5JBpBSRzKARkAGgE5AAYBSQHmQU0kCkEdNBJBOPQaQI0oIkC9PGIBHQAKAI0ADgE5AB4BTQBWAL0BYkFVWApBJTSaASUACgFVAgRaQS1sJkFdMBZA/TwGQUkcCkDtLFZA4QAaAP0AQgDtAK4A4QIIbkCNBB5AvTR+AI0AigC9AgQmAV0AhgEtAFoBSQHaQP0sAO0kHkEtVAZBXVAiQOEsCkFJKC4A/QBaAO0AFgEtABYBSQAyAV0ATgDhAP5BSTA2QS08AV1IzgEtAE4BXQAGAUkBlkCA/B5AsTAaQS1QBkFdUCZBSRAeAIEALgCxALIBSQAGAS0AmgFdAe5BXFiGAV0BckEtjCpBCVAKQV1gNkFJEApA/RAWQPEAKgEJAEIBSQAmAS0ANgD9AFYA8QAaAV0AkkFdNE5BSWAmQS0wxgEtAA4BSQA+AV0B0kFVVApBJVgOQLEIbgCxABpBQMgaAUEACgElAHYBVQIIskEhYBJBUTwKQUE4FkEJJBJA/SBKAQkAAkDw2DoBIQAGAVEAQgFBACoA/QAiAPEBekEk9BJBVQhSASUAHgFVAA5BQJAeAUEB2kFdZA5BLWgeQMVcKkCU3FoBLQAaAMUACgCVAFoBXQHWQVU0KkEk/E4BVQASASUCBFJBITA2QVEAAUDAVgEhAEIBUQAiAUEBpkFdWFpBLRBWAS0AFgFdAgRGQSV8CkFVZBpAxVgGQO1YBkDhaAZA1UQWQUEeBZoBVQAqASUAYgFBARZBGVQqQUksckE4YC4BOQAaARkABgDtAC4BSQBOAOEAIgDVAKoAxQEeQRkoBkFJMLYBGQAKAUkB6kEZNCJAeWgiQUk8IkCpSDoAeQA+AKkAVgEZAF4BSQIIVkFI+BJA/UQuQRk4LkDY+AZBLQQ6AP0AIkDoyA5BOLgyARkABgDpABIBOQAOAS0AMgDZAFYBSQFOQRjcBkFJGDZBLLCOARkACgEtAB4BSQAmQThIBgE5AcZBGTwyQUk8DkCVTCpBLOQuQGRYBgBlAE4AlQAGQTiIPgE5ABoBGQAqAS0BzgFJAgSiQRk8BkFJKDJBLPwKQPVEPkDZHB5A6QgSQTiwJgE5AAYBLQAGARkAOgFJAEoA9QBKAOkAogDZAG5BLSBCQRjkEkFJCI4BGQAKAUkAIkE4mEIBOQAaAS0BvkFBLBJBETROQLE4KkE4SCJBLKwGQIDICgCBAA4BEQAGATkACgEtABIBQQAAsQHmQUkoFkEZHL4BSQA+ARkB2kDtTBpBHTwGQPzwIkFM9ApBOQRCQODYBgD9ACZBRIg+AO0AagDhAAYBRQIIkkCVVBpAZJw2AGUAHgCVAVoBTQAuAR0ADgE5AgWOQNUgRkDtJCpA4SwWQUEkEkERGCYA7QAGQS0EXgDhAAERADoBQQAiANUAAS0BikERJC5BQQxKQSzIkgFBABYBEQASAS0BqkFBOE5BEUgKQLFAEkEs7EZAgGwGAIEAOgCxADoBLQABEQCSAUECBBZBQGQGAUECBEpBQUgOQOFQBkERRApA7SgWQNUgIkEtECoA7QBeAS0ADgERAADhAFYA1QAGAUEBVkEtOCpBQTwGQREssgFBAC4BEQBSAS0BdkCJLB5AuVAmQQlkBkE5SC4AiQAuQSToDgC5AJYBCQAuASUAigE5AXpBOCBKATkCBAZBJTBCQQU8FkE1EADhUDZAyQgWQLj4EkDU5CoBBQAKAOEABgE1AE4A1QBeASUAKgDJAMIAuQByQQj8NkE46FoBCQAeATkCBDpBBVwGQTUwBkCddCpBJSwKQGycRgBtAB4AnQAuAQUAUgElAAYBNQG+QTjYNgE5AApBCLgKAQkAKkEkiAYBJQIEXkDpRBpBSUwGQRlYIkDNEAZA2ShGAOkAZgDZABpBOHQmAM0CCJpAnWAiwQEAKsEBKCrBAWQuwQH8DgCdAJoBOQBCARkACgFJAghmQOkgAQlkFkDZJAZAzRQOQTkkBkElIC4A6QB2ANkAKgEJAAE5AD4AzQAGASUBVkE5NBpBCRAmwQFkDkEk9A7BASgywQAAVgEJAGoBJQAGATkBkkCxJB5BQVAWQKhwCkERTAIAqQASQICgBgCBACoAsQACQSzwqgEtACIBEQB+AUECCDZA7TAOQRFwDkFBSCJA4TQA/RAOQS0cbgD9AEoBEQA6AUEADgEtAB4A7QCyAOEAmkFBLC5BERg2QSzspgERACYBQQB6AS0BTkFFRApBFUwKQS1AMkCU7ADFULYAxQASAJUAMgEVAA4BLQB2AUUCCDJA7UQBRVAKQNU0DkDhTAZBFVgOQS04dgDtAF4BFQAiAS0AGgDhACIBRQAqANUA+kFFHEJBFPwiQS0MZgEVAGYBRQCGAS0BWkCpbCpBSVQWQRlIHkB4wCIAeQAmAKkAVkE4rBoBOQAaARkAUgFJAVJBTRwGQR0YDkE48FYBHQA+ATkAGgFNAgQqQVFUGkEhTAZA9IwGQNkYBkDpHCJBQRwGAPUAVgDpACYBIQAWAUEALgFRAAoA2QGSQUEYJkFVNA5BJSw6AUEANgFVAAYBJQIELkFdWAZAnWQGQS1gCsEBKFpAbGgCwQH8IgCdABJBSNQqAUkAJgBtADIBLQB2AV0CCEpBJWgOQNkoBkFVWBpBQTwWQMzwJkDovAoA6QAuANkATgElAAYBQQAuAVUAmgDNAPpBGUgOQUkgakE4bCIBGQAqAUkABgE5AgQOQLFABsEBuApBCWAeQTkICkCAfCIAgQAyALEAFsEAABYBCQBiATkCCLJA/UQGQO00IkEJZFpA4OAKQTiMDgD9ADYBOQAGAQkAKgDtABJBJKgGASUAugDhAL5BOSwiQQlIygEJAApBJJgGASUAOgE5AeZA/VAiQS0QJkCU0DJAxPQOAP0AGgCVABIAxQBCAS0CCO5BBWwOQNUkAOE8AO0kBkE1UGYA7QA+QSTEKgElACYBBQAA4QAWATUAGgDVAgh+QTlgFkEJWAZA2XAAqVROQST0fgDZAC4AqQIIxkCVZBJAxXzSAMUAQgCVAggGASUAZkCVlApAxYAmwQEoJsEB/CoBOQCmQJCqBHYBCQAyAJECBAZBCWQGQSVo6gDFACoBCQAAlQBGASUBXkEJOAZBJTyiwQG4OsEBKCrBAAASASUABgEJAbJBCVgAqXgKQHkUBkElTHoAeQAeQRTMBgCpAEYBFQBOAQkARgElAW5BFEgSQQhYFgEJACYBFQASQSR4FgElAgRCQQkcPkElPCZA5TAKQRTYSkDZFF4BFQA2AQkABgDlAFoBJQBGANkBjkEk0BJBCMw+AQkASgElAbpBJTASQQkodkCVVDZAZHQeAGUALgCVAFIBCQBmASUCCEJBJbg2QQlIGkD1RADlRDZA2RwWQRTgOgD1ADIBFQAaAOUAFgEJAFIBJQAyANkAkkElEF5BFPwWQQkM7gEVAGIBCQBCASUBjkEFRBJBHSASQMVENkCU3F4AlQAaAMUAcgEFAE4BHQFSQST4IkEENAYBBQCqASUBnkEdLCJA7RwKQNUoAQUoDkEpLAZA4RxCAO0AbgDhAB4A1QII8kCVTBZAxZS+AJUABgDFAMZAnCACAJ0CBJYBBQASAR0ALgEpARJA7TwiQQUwFkDVKCJBHSQGQRE0LgDtAKYA1QAKAREAHgEdAC4BBQF+QQUoDkERDApBHP0CAREABgEdAC4BBQGKQIFMCkCxdAZBBUQSQR0MCkERMLYAsQAiAIEAVgERACYBHQAGAQUCCDZBBUwSQR0sFkEROApAjYAWQL1w7gERAA4AvQAGAQUAAR0AIgCNAaZBBPQaQRzwDkEQ5JoBEQAqAR0AEgEFAZZBHSAWQMl0FkCZVCZBBSgeQREIygDJAACZAGIBBQAKAREAKgEdAgXSQQVUDkEdMApBEUwWQMV4EkCVOMIAlQAOAMUAHgEFAGYBHQCGARECBZpAqVAWQNlcHkEVNA5BCUSyANkAGgCpACIBCQBSARUCCF5AtWQGQOVgCkEJUApBJVgyQRUcogDlAB4AtQIIdsEBeDbBAfwWQKlQCkDZYPIA2QAWAKkBigEVAAoBCQDWASUBzkEJOAZBFRgyQJVsBkDFfJ4BFQBCAMUASgEJABoAlQIIYkD5UAZAjXwKQQlICkC9dBJBFTRqwQEUDsEAAFoAjQASAL0ABgD5AC4BCQBCARUBOkEU8D5BCPQGQPjgfgD5ADYBCQAuARUBmkEJDAZBFTAGQMlEBkDtOCJA+MAeQNkUWgDtAA4A+QASANkAYgEJACIAyQAKARUCCLpBCVAKQI1UBkD5TAC9VBpBFSCyAI0ATgD5AAYAvQAaAQkAEgEVAUpBCRgaQRUcJkD48HoA+QAuAQkAEgEVAXpA+RgOQRUQMkDtQApAyUQSQQkoNkDZCEYA7QAiANkAPgD5AFYBCQAGAMkAUgEVAgheQPVYBkCpWAERRFpAeCAaAHkAQgCpAgQCQRUkngERAEoA9QFSARUAbkDFNCpA9VAGQR1IFkDk9BZA2QA6AOUAMgDZAFpBCEhKAMUCCG5AqUhiQHikBgB5ABLBAVAOAKkAEsEB/gQ+APUAHgEdAVIBCQE2QRVUDkD1UApAxVgGQOUsIkDZQEIA5QA6ANkA2gDFAR4BFQAeAPUAJkEJFLoBCQGGwQH0NsEBUB7BAQAKQRFQBkDxXCJAsUguQIDwCsEAADoAgQAOALEAZgDxAC4BEQIItkCxPAZA8SwA4VQKQP08QkEJFGYA4QCGAPEADgEJAA4AsQBGAP0CCB5AgRQKQRVYCkD9UAZAsVQKQPE4mgDxABYAgQAGALEAngD9AD4BFQIIAkDhUB5A8TQA/UguQQksakDYUAIA2QAiAOEApgDxAAoBCQBKAP0CBeJBFVAuQJVoCkDtMBJA+SQSQMVYjgDFADIAlQAqAPkATgDtAOIBFQIFOkERTBJA7TAOQKVQCkDVYBJA+QC6ANUAIgClADIA7QAqAPkBEgERAgUGwQDYFkDtVB7BAfwWQMV4DkEFNEZAlPh2QPSoAgCVABYA9QAAxQBSAO0AcgEFAggGQO04CkDVTAZA4WiOAO0APgDhAA4A1QDawQH8YsEBuG5BJSgSQRUUIkEJCJbBAVAewQEALsEAAH4BFQBSAQkAbgElAM5AqZQWQHkodgCpABYAeQHqQSU0DkEVFDJBCPiKAQkAGgEVAYZAtXAKQIVoMgElAHYAtQASAIUCBEpBCUQSQSUoHkEVDKoBCQASARUAWgElAW5AxXgOQJVMZgDFACIAlQIESkEVHApBJSgaQQkQygEJAOoBJQBaARUAmkC1gAZAhXC2ALUAFgCFASbBAOxOQRVMXsEB/A5BCTgiQSUMsgEVAILBAdR+AQkA1gElACJAsXg+QQVACkCBBA5BHSBOAIEACgCxAgRyQSUlMgEFAB4BHQCSwQEUCgElACbBAOwmwQDYOsEAABZA1QgmQO1EKkDhRBZBHRASQSlQCkEFPD4A7QBmAOEADgDVAgj2wQDYCkCVRApAxXA+wQFQFsEB/F4AlQBGAMUCBOIBBQCmAR0A7kDtMBZA1SwGQOE8UgDtAFIA4QAqANUBCgEpANJBHVAeQQUoQkERETYBEQAiwQFQIsEA7BYBHQASAQUACsEAALpAsXQiQIDYTgCBAEYAsQIETkERTBZBBSQGQR0smgEFAIYBEQASAR0BhkDtNBJA1SQmQOEYMgDtACYA4QBCANUB0kERNA5BBQQiQRz4lgEFABIBEQASAR0B2kCVeBpAZNxyAGUAEgCVAgQ2QREYHkEc9C5BBNAqAQUAGgERABYBHQIECkDVTD5A4SwGQO0gVgDtAF4A4QAiANUBRkEFEApBHQyOAQUBMgEdAUpBCTgGQKlQBkEVJJIAqQH2QR0UzgEVAEoBCQF6AR0AlkD1RBpA5TgSQNkwKkEJSBpBJUAeAPUADkEU/DYA5QCaANkCCHbBAQACQJVoLsEB/DYBFQAqAJUACkBkqAYAZQByAQkACgElAgiyQOU0FkD0lAZA2ThSAPUAPgDlAK4A2QFmQPUwUkEVFApBCRlmAPUAJgEVAFYBCQB+wQFQLkCNgAbBAQAeQL1wLsEAAIIAvQAAjQIEGkD5JBpBCSAKQRUYhgD5AOoBFQAqAQkA8kDJOADtSDJA2SB+AO0AKgDZAJYAyQGSQRUcDkD5FBJBCTjOAPkAmgEVAAYBCQEyQL1gCkCNaMYAvQAGAI0B1kEVHFpBCSxCQPj8egD5AJoBCQAiARUBEkDJRAZA7TAmQNk0cgDtAE4A2QCOAMkBUkEVMAZA+SQmQQlAegD5AJIBCQBiARUBbkCpgJoAqQAGQHjABgB5AgSeQQjoCkEU5DJA9MQGAPUAVgEJAAYBFQIEEkDlGApA7JgGQNk0CgDtAAZAxQRCANkACgDlABIAxQIETkD1BA5BFOwqQQjUPgD1AEYBCQBSARUBpkCVbEJAZORSAGUABgCVAgR6QRUwFkD1KF5BCHR+AQkBdkDlVCZAxTQSQNlEVgDlAGIA2QA+APUAUgDFAR4BFQBuQQksIkD1JgQSAQkAMgD1ACpAxVguwQDYAkCVAApBJPhCQQjABsEBUA7BAfwKAJUABgElAA5A8TguAMUBVgDxAGoBCQFKQSUkCkD1HMIA9QAmASUA+kDtICJA4TQWQNUYSgDtABJBKVwA+VxmAOEALgDVAEoA+QBSASkBQkD9SA5BLVzeAP0ATgEtAVpBMWwWQQFgCkCVTApAxXyaAQEARgCVAAoBMQBSAMUBMkE1eAZBBWzqAQUAFgE1AMrBAfxGwQFQJsEA1CrBAABaQOFgBkDVJBJA7LBqAO0APgDVAAoA4QB+QMR8BgDFAgXyQKlcBkE5YApBCWwGQNl4LkElOFrBAfzWAKkADgEJAA4A2QBqASUAATkCCBJAsdg2QUFUBkDhmAERfCpBLTYFggDhAF4BEQAeALEAGgFBAFIBLQE2QLV4BkDlhAZBRXQaQRVwMkEtOPIBLQBmAOUAJgEVABYAtQAyAUUCBSZAuWwSQOlsIkFJgAZBGYROQTkYJgDpAIbBAVAGwQEUZgC5AB4BGQBGwQDYDgFJACbBAAA2ATkCBTLBAOwywQFkLsEB/CJAeGBSQKjMKgB5ABJBVRwGAKkAXkEk4AE4rgQWASUAJgFVAV4BOQIEAkD04EJA6O4FWgD1AZIA6QDKQMTkTkFdSDZBLRBqQUjACgEtABYBSQAmAV0CBfoAxQCmQPTgqkDogEZBODw2QWg4HgDpAB4BOQCqAWkCBD5BaPhOQTikCsEBeA4BaQAWQVScBgFVAEbBAAAuQWmQFkDhIHYA9QDiATkAMsEA7CrBAVAqwQH8RgFpAgg6QPScEkDsrgiaAPUASgDhAIpA1PQqAO0CCWZBZYASQPVQBkE1bBJBVVgmQO0YxgDVAVIBNQAqAWUBLgFVAYIA9QBCAO0AOkFdMCJBLQhSQOEALgEtAJYBXQIIqkFVHBJBJRA+QPT4KkDs2IYBJQCaAVUCCCoA4QAaQV1IBkEtUBJA1QSuAPUASgDtADIBLQA6AV0CBc5BNUAGQWVQcgDVAA5A9RhGQOz8YgE1AAZA4OQuAWUCBKbBAfQmwQE8KsEA2DbBAADWAO0AlkFdKBYA4QAyQS0IBkDY6BbBAQBOwQH8TgD1AC4BLQCmAV0CCBJBJOQSQVTQUgDZAAJA6Mx6QPRwRgFVAF4BJQIFJgD1ANIA6QBOQMTiCZ5A9QAGAMUAEkDpBgXCwQFkJsEBFCbBAAD2AOkAFkFJcBJA2RwKQRlkRgD1AQYBGQAGwQE8MsEB/gXeAUkAtkDo+KYA2QAyQPSCCE4A6QBCQNkADkFVZCpBJSwKAPUBugFVABIBJQIFOkDpBAD0dFYA9QAiANkApgDpAgTGwQH0JkFcsAYBXQAGwQEoBkEssAYBLQBuwQAAekCw3DZBXSwmQS0IagCxAF7BARQGAS0AIgFdABbBAWQqwQH+CFpBTOwSQRzcCkD8/L4BHQAaQOyUQgFNAggeAP0AKgDtAAZA2RIJXgDZAB5BQWwOQRFoOkD9LCJA7QRKQOBIYgERABoA4QBmAUECCBpA2SQSAO0ACkFJaDZBGTAiAP0A3gEZAJ4BSQIFLkDhLEYA2QAWQU1QFkEdJM4BHQCCAU0CCCJA/RwOQOzwKkFdOA5BLTTCAS0ADgFdAboA/QIEQgDtAH5A2PgaQVU4CkElOBIA4QD2ANkCBCrBAWQqwQEAJsEAAC4BJQAGAVUBKkCo0QYAqQA+wQDsDkFI8B5BGQAywQFkDsEB/gi6QPTYLkDpFaIA9QIFSgDpAG5AxQ12AMUCCDpA6QwGQPT0LgEZAJYBSQHmwQG4KsEBKCbBANgmwQACBEpBVWQiAOkAEkElPCrBAQAWwQFkCkDY8DbBAfyGAPUABgElAGoBVQIITgDZABJA6QyWQPSmBfIA9QCqAOkACkDFBEJBXVRGQS0cvgEtAJoBXQIFngDFADZA9IwWQOkMQgD1AIYA6QIE4sEBUA5BaRw2wQDsBkE5BDbBAAAKAWkAKgE5AMpAgEQGAIEABkE5XApAsRweQWkwdgCxAG7BAQAmwQFkLsEB/TYBaQBmATkCBDZA4RB2QTUAAWUY4gFlACIBNQIIPgDhAAZA/PQA7QoEmgD9AgSmQOEgAPzcMgD9AFYA7QDOAOEB5kFdJCJBLRQ2wQF4KsEBKDrBAACqAS0AFgFdAHpAiHQeQLk0DkEpMAZBWUQiAIkAlgC5AALBAQA6wQF4NsEB/UYBKQAWAVkCBSZA4TBCQMj4OkFJTBJBGSymARkALgFJAY4A4QHOAMkAxkC5KKZBSUQOQRk4ngEZACYBSQF6ALkAYkFBMDZBERiiAREAFgFBARpAuSCGQODQKgDhAMYAuQIEZsEBeCrBASgmwQDYNsEAAX5AnRw+QTkQIkEJFBoAnQB+wQE8LsEB/gi2QOkYhkDYyKoA2QBSAOkCBaZAzSRKATkB6gEJAWIAzQFuQOkUANkoOkEJRBpBOUwWAOkAjgDZAHoBCQBSATkCBI5BQDQWAUEAKsEBeBrBARQqwQAA6kC9GBpBQSQyQREgpgC9AFLBATwywQH8GgFBADoBEQIIUkD9NC5A7SAGQREwBkFBRgUuAP0ABgERAKoBQQFKQNkgNgDtACJBFTgOQUU1RgEVAC4BRQGOANkCBBJA4SgSQPzcMgD9AAZBRTweQRUwrgDhAG4BFQAKAUUCBIrBAXgmwQEUPsEAAOZAqUSCQUlgARlQOgCpAD7BANguwQE8LsEB9C7BAf4EKgEZAKoBSQGKQR1IBkFNRDJA9UBeQOkABkDY5NoBHQAWAOkAPgDZABoA9QBiAU0CBS5BUVgKQSFgDkD1QCpA6SQKQNkM6gEhAK4BUQDuAPUCBHYA6QA2QSVUCkFVWGYA2QDeASUAUgFVAghOQIE8FkCxiCJBLWAGQV1cNkFJIEbBAOwSwQAABgCBABIAsQDqwQDYJsEA7CrBARQ2wQFQJsEBuCrBAfymAS0ABgFJANIBXQHiQS1wEkFdXA5BCVAWQUk4JkDw3DJA/PWWAQkABgEtAB4A/QBOAV0AEgFJAJYA8QIEjkEJYAZA/VAaQWVoBkE1ZAZA4RwmQPD8BkFVUXYBNQA+AWUAPgEJAFIA4QAiAVUAIgD9AB4A8QIEakD9IEZBOUwSQWlYFgD9AAZBVVAGQPCEOkDhAA4A8QBiAOEAagE5AE4BaQIFtgFVANJBQWwGQMWIBkCVdCJBcThSwQE8CgFxACYAxQAKwQEoHgCVAAYBQQACwQEAMsEA7BbBAAII9kD1eCpA7VgWQOFQBkDVKCpAxSCyAO0APgDhAAoA9QASANUAGgDFAgiaQPU8BkDhhApA7WgKQNU8IkDFRLIA9QFeANUAQgDtAFIA4QD+AMUCBDJBGWwOQUk4IkE5HQIBGQAWAUkAIgE5AY5BGTQSQUkgIkE5AKoBSQAeARkAcgE5AV5AeVAeQKl4KkEZOAZBSWB6AKkACgB5AHIBGQCCAUkCCBpBGQAKQUkkBkD0lADZFCIA9QAGQOiQMgDpAAZBLNwmQThQRgE5ABoBLQAGANkABgEZAFIBSQFCQS0AlkFIyCpBGLAiAUkAJkE4fAoBGQAuATkAMgEtATJAZRBGQUkMARk0OkCVOCpBLOAyAGUADgCVAF4BLQAWQThwBgE5AAYBGQCmAUkCBfpBGUQWQPUwAUkcJkDZKAZBLPwSQOkQKgD1AAZBONA6AOkALgE5ABIBGQASAS0ADgFJAGYA2QDyQRkQOkFJBD5BLMCyQThkAgFJAC4BGQAKATkALgEtAbpBTSAGQLE8CkEdHA5BLRB2ALEAWgEtABpBOFwGATkADgFNAAYBHQIISkDVcC5A7TAKQOFMUgDtABJBTSwuQR0cOgDhABoA1QAWAR0AOgFNAgiKQGTACgBlAArBAOw6wQH+CNJA7UgaQRF0BkDVNA5A4UASQUEwIkEtID4A7QCGAUEAAOEACgEtAAYBEQAiANUBZkFBHBZBERw+QSzYYsEBZAoBEQAWAUEAHsEA2C7BAAASAS0BikEFTBZBNSwiQLE4CkEk/GIAsQBSATUABgEFAAYBJQIIokD1XCpA4TgGQSScCkDVKApBEQASQOzwLgElABoA7QAqAOEABgD1AAoBEQA6ANUBmkEk9DpBELwaQPSQAgD1AEYBJQBKARECBBZBSTAeQJzgEkEZCBIAnQAOQGyoAgBtACIBSQAiARkCCMJA7VASQUFIBkERWB5A1RAyQOEIOgDVAADtAAERAAoBQQAiAOECCMJBGVAWQUksCkCpCApAeHwyAHkAJgCpAKZBOIYIZkD9RCJA6SQuAP0AEkDY6CIA6QBmANkCCLrBAOwWQGRAAgE5AA4AZQAOwQG4LkCUwAYAlQAKwQH8BgEZAAoBSQII2kD1PBpA1SgSQQl4IkE5SA5A6RAGQSU0LgD1ACoA6QBSANUAQgEJAB4BOQAmASUBRkEJDAZBORwuQSUIqgEJABYBOQA6ASUBQsEB9CpBOTgCwQFQBkEJTAZAnWRKQGx4BgBtABoAnQA6wQAAjgEJADYBOQIISkEJWB5A6QgGQRkYATkUEkDNEAZA2RAmQSUALgDpABYA2QBWAQkAFgDNABIBOQAGASUANgEZAUZBCPQGQTj0ARkQMkEk1IYBOQAKAQkASgElAAoBGQEewQDsKsEBZDrBAfwSQJ18BkEJOAZBOTBCQRkMGkElBEYAnQDuAQkAQgElACYBOQAKARkCBcJBBSwGQRk4HkDpFApA2SQSQTT8EkElCApAzQAmAOkAGgEFAD4BNQASANkAXgEZAAYBJQAGAM0BVkEJQDpBORQuQRhkMkEkRE4BGQAGAQkAOgElAF4BOQEyQLFIMkCA7ApBQUQGwQH0DkERRA4AgQBSwQDsBgCxADIBEQAKwQAALgFBAgieQP1MBkFBYAZA7TgSQRFIGkElLB5A4SBGAP0AWgDtAJoA4QIFtgElAA4BQQAiAREALsEBKCrBAfxKQLD8PgCxAgkWQP2ADkDtMC5A4ThqAO0ArgDhAPIA/QBuQPlJdgD5AWpA/VAiwQG4CkCxMDbBAVAWwQEoLgCxAAbBAQAuwQDsLsEA2BrBAAIFpgD9AFpA7URmQOFMpgDhAW4A7QBKQP0yBI4A/QAawQDsKsEB9CrBAfwGQPk0DkDpVAZAuVw6QIicgkEEVAYAiQAKALkAdgEFAgQyAOkBkkD42EZA6WQWQRFECkDJVM4AyQByAPkABgD5AUrBAXgmwQE8MsEA7CbBAABiAOkAKgERAcZA/UQKQQlEBkDpQAZAnUhyAJ0CCTJA2UwqQM0kYgDZAGYAzQIFrgDpAFLBARQqwQH8HkCdeB4A/QBuAQkAMgCdAgiqQUlgHkEZUBpA6SQWQNkgBkDNIEIA6QBOANkAMgDNABJBNCwyQSiYIgE1AB4BKQBCARkANgFJAQ5BGPRKQUjAFkEs/BJBOOiqARkAFgFJAC4BLQAKATkBXkEZGAZBSSgKQS0cCkE5CBZAnXhWQGzUGgCdAAYAbQBKwQEANsEA2AYBGQAiwQAAPgEtAAYBOQASAUkA1kEs9AoBLQBWQUjAQkE4wBZBGMhuARkACgFJAFIBOQGWQRkcKkFJLApA6VAKQS0cFkE49EJA2PgmAOkAEkDM1D4A2QBeAM0AFgEZAB4BOQAKAS0ASgFJALJBSNBGQRjsJkEs8CpBONS2ARkARgFJABoBOQAqAS0BFsEA2DLBAVAmQUlUBsEB/AZAnYQWQRkgLkEtJApBOPRWAJ0A3gEZAAoBOQBqAUkAFgEtAgWGQRFYEkDpNBJAzRAGQS0wJkDZDBJBQQwOAOkATgDZACZBOKxCAREAEgFBABYAzQAOATkAegEtASJBSSQKQRjwOkEs2JYBGQBmAS0AIgFJASJBLTgGQU1MCkEdTAZBOOwOwQF4BkCxSCpAgNQeAIEAbgCxAALBAOwSwQDYTsEAAEYBOQASAR0AIgEtAAYBTQE6QSzAZkE43DJBTGQyAU0AjgE5ACIBLQEeQP1ADkDtRB5BHSwKQS0wBkE5FAZBTRxCQODgDgD9AJYA7QBOAR0ANgDhABIBOQAGAS0ArkFM7IpBHLwBLPAOQTjkogEdAHYBTQAGAU0AQgEtACYBOQEKwQE8KsEB/B5BTSwBHTQaQS04DkCxOAZBOSA6QIDEMgCBABoAsQBmAR0AWgFNAJ4BLQIEVgE5ASpBQUQGQRFcDkDtJDZA4TQKQPzoEkEtBC4A/QA+AO0AKgERAB4BQQAaAS0APgDhAWpBORAOQQkkjkEkvJIBCQAWASUABgE5ANbBAbgqwQFQOsEBACrBANgKQSU8BkE1SApBBUgGQJVsTkBkXAIAZQAyAJUANsEAAHYBBQAqATUAGgElATJBBNQKQST0BkE08LIBBQAKATUAggElAQZBNQxKQQUYFkElCB5A7SQOQNUkGkDhLGYA7QBmANUABgDhAAYBBQAWATUALgElAaZBNOQOQST4NgE1AN4BJQFOQLFQakFVIApBJRgeALEACkCAmAYAgQAmAVUABgElAgjmQNUkFkFNPApBHUAaQOz0BkDhDC4A7QAmANUAEgDhAC4BHQAWAU0CCPpAqUwBSUwKQRlIPkB4eCYAqQASAHkAHgEZAFYBSQIIrkD1TAZBGVwSQUlMJkDpIB5BOQQqQNhsBgDZAAYA9QAOAOkCCLbBATwKATkAKsEB/BIBGQBOAUkAykCUlAYAlQII2kD1WDJA1TAGQQl4BkE5hEJBJSASQOjkDgD1ACoA6QBmANUAEgEJAF4BJQAaATkAvsEBZCrBARQWQTkMKsEAAEJBJPguQQjMhgEJABoBOQA2ASUBhsEBFDbBAfwWQTlAFkEJOBZAnSQWQSUQGkBs2CIAbQAyAJ0AugElABoBCQCiATkCBbZA6TAaQQlIFkE5KCpAzNwKQSUICgDpAApA2Ox6ANkAHgEJAAoAzQAOASUABgE5AZpBCSAOQTkQLkEk3JYBCQAOATkAEgElAYZBCSQeQJ1gCkE5EE5BJOxSAJ0AGgElAAYBCQBuATkCCEpAzXAeQOksJkDZHCoA6QBmANkAQgDNAVbBAXg2wQEALsEAAIZBCUQKQTksNkEk+E4BCQAyATkADgElAYbBAVAmwQH8CkCxZAZBEXwWQUFIPkEtHH4AsQAKAS0AIgERAIYBQQD2QS0wNkFBMAZBETjGAREADgEtAAoBQQG+QSzoBkFBQAERTDpA7TAA/USiAREACgEtAFoBQQAaAP0BXkFJTApBGTBuQTjUHgDtAIYBGQAyATkACgFJAaJA7SwKQOEgEkFNUAZBHXAGQNkELkE5ALYBOQAiAR0AGgDZADoA4QAaAU0BVgDtAgQqQP1UMkDtABpA4RiWAP0AGkDYyBYA7QDmAOEAGgDZAV5BTVwKQR1QOkE5FE7BATwawQAADgEdAEYBTQAGATkBkkC5jGJBSXQGwQFQBkEZYA5AiNAGAIkASkE43CIAuQAGwQH8agEZABYBOQBeAUkBCkEZIA5BSUwuQTjwtgEZACYBOQAKAUkBrkFJTA5A4WASQRk8NkE42A5AyQhyATkAEgEZADZA1JAOAUkATgDVAEYA4QCSQUlMCkE5BEZBGNyCARkAjgFJABoAyQAyATkBGkC5cJZBKWwKQVlsHkFJMJYBSQBCASkAHgFZATpBSTQeQVlgNkEpFEoAuQBaASkAGgFJABoBWQF+QUkMEkFZUBZBKVwiQOFYLkDVCAZAyRCGAUkAPgEpAC4BWQA6AOEA3kFJFA5BWVCuANUAFkEorAYBKQBiAVkAdgDJADYBSQDeQLlwTkE1mApBZYQiQVVMogFVADYBNQBCAWUBekFVMBJBZVwiQTU80gE1ABoBVQAOAWUALgC5AXJAyTASQWVgBkDhTApBNVQGQNUQDkFVJMYA4QAGAVUAFgE1AB4BZQB2ANUA/kFVLBZBZUwaQTUsmgE1ABYBZQDuAVUAPkDI9FJA4WgOQLk8CkFVNBpA1QgGQTlwCkFpbNYA4QEaANUAUgC5ABoAyQAAyQBeAWkAfgE5AKYBVQGCQLk4ATVsCkFVgApBZWQSQNT4CkDJCAZA4QgyAOEAMgDVAA4AyQB2wQAAFgC5AA4BNQCCAWUBAgFVAgSywQE8JkCdnA7BAfwaQWVgATVwGkFVUB5AbIg6AJ0AOgBtAJIBNQA6wQG4FgFVAB7BASgKAWUAKsEAAgXSQOk0GkEtSApBXSwGQM0kDkDZGApBSSgeAOkAQgDZAHYAzQBWAS0ArgFdAD4BSQIFNkFZaBZBKVgOQUlUDkCdrJYAnQDCASkAOgFZAMYBSQIFLkDNMB5A6VAuQV1UBkEtbApA2SQqQUk8JgDpAFIA2QBeAM0AfgEtAQoBSQByAV0CBGZBSVQGQTVICkFlaBJAsXw6QICoBsEB/EYAgQAyALEA8gFlACYBNQIEtgFJAL5A/VAaQO0wBkEtTBZA4SASQV0gGkFI1AYA/QBWAO0AkgDhAD4BXQA+AS0AHgFJAgV6QR1QBkFNTEZAsVRqALEAEkCIYB5BOKQGATkAEgEdADIBTQAKAIkCCDZA/WgKQO1EIkDhUGYA/QB6AO0AfgDhAbpBLVA2QV0gEkFJAMoBLQAGAV0AtkEpUAZBWVBeQJT8CkDFaDrBAVAmwQEACgCVADbBAAAGAMUAUgEpACoBWQAaAUkCCBZA7UQSQS1sBkDhXBpA1SgBXVgmQUkcOgDtAGoBSQAqAOEAANUAFgEtAIYBXQIF2kCVXBpBJWwWQVVYBkDFTE5BQQQOwQH8tgCVACoAxQFqASUBAgFVALYBQQDKQUGEBkDtOB5BIWAGQNUQBkDhRA5BUUhqAO0AbgDhABYA1QBWASEAnsEBuCrBATwWAVEAEsEA7DLBAAEmAUEB0sEBFA5AqWQOQSVcBkFVZApBQShawQH8DgCpAM4BQQAeAVUAKgElAgXyQPU0BkE5QAZBHTgOQU0YDkDpHBpA2RAOAPUAOgDpAAYBTQASAR0ACgDZAMoBOQFGQUloGkEZPGpBONkGATkBIkCpBFIAqQD2QHhQBgB5AboBGQIEFkD1TAZA1UQuQOkoOgD1AB4A6QAuANUA5gFJAWpBGUQmQUkoZkEs3EpBOKwmATkACgEZAAoBLQAiAUkAskCdkCJBRVwGQRVsBkEtWD5BOSgqAJ0AMsEA7A7BAADSARUAJgFFAFoBOQASAS0CBZZA6SgGQNk8ARlQCkFJSBpAzRABLSQyAOkAFgDZAFJBOEACATkAHgDNAGoBLQBGARkBwgFJAgRiQJ2IGkEdQApBLUg6QTkMKkFMeAoAnQA+AU0ARgEdADIBOQB+AS0CBcJBGVwqQOikANkkBkFJLBJAzOQGQS0wIgDpACYA2QBqQTigAgE5ABIAzQAuAS0AWgEZAHoBSQIFikCxWBLBAOwGQRlMCkFJTBZAgIAGAIEAGkEtKEpBONwWwQH8IgCxALoBGQDqAUkAzgEtANoBOQFSQTlEFkERXAZA/VwWQO0oAUEkBkEtHQIA/QAuAREABgFBAEYBOQA2AS0A+kFBSBJBEVAuQS0QIgDtAFpBOMGaQNlAbkDgiEpA7EgKAOEATgDtAAYBEQA2AUEAIgE5ADIA2QAqAS0BbkFBPA5BEVgGQS0wmgERAAoBQQDSAS0AZkDhNGJA7GQaQPywBgD9AA5BCWAKAO0ABkE5JBpBJSyaAOEA8gElAFoBCQAyATkAesEBeAZBBTQKQST8EkE1EE7BAABiAQUAEgE1AF4BJQD6QLlsBkElLAZBNZguQQVIZgC5AA7BAf1iAQUAbgE1ACoBJQIE6kEFUAE1VCZA4VAGQSUwSkDJGBZA1PwaAQUAsgE1AHIBJQA6AOEB9gDVAI4AyQCyQLk4RkFJVAZBGWBiQTjgKgEZADYBSQABOQGGALkAOkFBUCJBEVDCQSy0XgEtASJAuTAWQOCgHkDI7A5A1GwuAUEABgDhABIA1QBCAMkANgERAIYAuQAaQSxdfsEBuCbBASg2wQAAngEtAQJAnWg2QRlcBkFJaCJAbMwCAG0ACkEtJBYAnQBWwQEAKsEB/M4BLQASARkASgFJAgWSQOk8HkDNLgVmAOkBOgDNAH5A6WwmQNlQ+kDMIAYAzQHWAOkA3gDZAVpBOZwGQWlwBkDpPADZIAZBVYAaQM0kMgDpAJoA2QBGAM0CBSIBOQAeAWkAegFVANJBVRwSQTVUDkCdhAZBZWRWAJ0AKsEBUBrBAQAmwQAAHgE1AF4BVQA2AWUCCDpA6TwOQNksCkE5OA5BaVAOQVUsVgDpACYBOQAOANkAIgFVAB4BaQIIckDNPBrBAfwWQWVQDkE1PA5BVTiaATUAKgFlAC4BVQCOAM0CBVJA2TQA6SwSQM0QBkFdWApBLVA6AOkABkFJEHoA2QA+AS0AFgFJABIAzQB6AV0BusEB9DbBATwmwQAB0kE5YApBaWgKQLFUHkFVNFLBAfwyALEAmgFpANoBOQByAVUCBMZA/TwGQO0oGkFlZA5BNTiOATUABgFlAF4A/QGuAO0ARkFMvBJBHSBOAR0AFgFNAdZA2TIEcgDZAgTaQQlkBkDtMF5A4QgGQNkAhgEJAI4A7QBaAOEApgDZANZBNTgOQWU8GkFJHD7BAXgWwQEoFgFJABIBZQAeATUAFsEAAMZBZWgOQTVQBkFJKDJAxXxKQJUMUsEBKCYAlQAGwQH8HgDFAPIBNQABZQCWAUkCBSZBXVQGQS1QEkDVLA5A7QwWQUkgSgDtAJYBSQAGAS0AwgFdAHIA1QIEpkCxSaoAsQBmQNSQigDVAgT6QNTMIkDhUAZA7TBKQVV8CkElfBIA7QAWQUE8VgDhAD4A1QIEHsEBPC7BAAAKAVUABgFBABIBJQIEBsEA2AJAqTgiQSVUAVVUHsEB/BpBQRwSAKkAxgElADYBQQAeAVUCCApA9TA6QOkZ3gD1ASoA6QHKQNlWBfoA2QEaQPVUBkEZaApBSXAKQNVEBkDpPAZBLUA2QTksdgD1AEYA6QCSANUBrsEBeCrBASgmwQABUgEZAB4BOQABLQA2QUjsNgFJAAFJABpAnXgmQTjYBkEsyA5BFTAeQUUUPgCdAC7BAfySwQH0DgEVAAYBRQAuwQAAYgE5AB4BLQIFqkDpUBZBGVASQUlEBkDZQBJBLSg2QTjtAgE5AEoBGQA2AS0AagFJAgRywQE8JsEB/DZAzTRWANkADkEtWBZBHTQOAOkABkE5GBJBTQTKAR0ACgFNAgVWATkAFgEtAJJA2TgGQOkgBkEtHD5BSWgKQRk4CgDpAG5BOKwSANkAWgDNACoBGQAaATkAlgEtAAYBSQFuwQFkKsEA7CbBAAGWQVU0FkCxZCpAgNwOQSVUGkE5HCoAgQAawQF4HsEB/BoAsQF+AVUAASUAygE5AgReQO0sFkD9RAEdNBZBOSQKQU0EggEdACIBTQDiATkAjgD9AHJBSWASQRlU/kE4IAYBOQBCAO0ABgFJAQJA2TgGARkAdkDs1Z4A7QEGANkBYkDhIDZA7FwiAO0AOkEJjJoA4QACwQH8CgEJAFbBADh6wQA4NsEB/OpBBUj6wQFQJsEA7CYBBQAKwQAAukC5ZApAiPw6QQVoNgCJAE4AuQBGwQFkOsEB/eIBBQIEUkEFVBJA4UheQNUEUkDIyWIA4QIECgEFADoAyQAaANUAjkC5RFJBCWWaAQkBnkD5VNIAuQD6QLikFkDgsBJAyQROAOEASgDJAG4AuQD2wQFkKsEBFCrBANgiwQABqgD5AM5A/XwOQM1IIkCc2EIAnQAGwQE8PsEB/FIAzQIFUgD9ASpA6WAmQM1ECkDZQgl2QQWSCPoA6QCKANkAJkEJhEIAzQCuAQUBCsEBeCrBATwmwQDsKsEAAgSaQIBQBgEJABIAgQA6QLD0OkEdCBbBANgqALEAEsEBZCbBAf4JJkD85GpA2M4I3kDhBRZA7NSeAP0ArgDtAJIA2QAyAOECBAJA/RBOQOEATkDsfCIA/QAmAO0AngDhAgiCQMUk3kCUaAIAlQA6QRFMKgDFAFYBHQIFogERAJ5A7RAiQNTcGkD1ZgTeAO0BkgDVAB4A9QBuQMUUOkD9RgiyQMRcJkDg7AZA1OQ+QQUoKgDhACIA1QDaAMUABgDFAMrBAbgqwQEUKsEAAgRGAP0AXgEFAEpBGRQKQHikJkCo/DIAeQBmAKkAMsEA2DLBAXgqwQH+CJ5AxKxqQOiQbgDFAA4A6QIISkDY9AZA9OkOAPUCBLoA2QE+QNi8LkD9ADpA6QQuAP0AegDpAIoA2QIEksEBPCrBANgiwQABJkCdCAZBCThqAJ0AfgEZAFLBAOwWwQFQKsEB/gSiAQkBDkDo+C5AzPGCAOkBQkDtMI4AzQHKQMygNkDZCA5A9Uw+QOjMegDNACoA6QAmAO0BOkD9NgQeANkANkDMuCYA9QBGQQU4DgDNAZLBAXgmwQE8KsEA7CbBAABCAP0CBFYBBQA+QIDABkEJLAZAsRw6AIEAcsEBZAoAsQAmwQH+BBoBCQIE5kERLApA2NYI1kD9GEZA4QBKQOz8ngDZAFIA/QBSAOECBUoA7QBSQOEglgDhAgS6wQH0NsEBPCrBANgqwQABDkCIwBYBEQAKQLjIOgCJAJ4AuQAWwQDsLsEBZB7BAf2eQOkl9gDpAEZAuRWmQPEiBO5A+TRSALkAhkDgYDYA4QAKQMjArkDUdBoA8QEiQP08DgD5AW4A1QDGAMkAIkC5GMIA/QBKALkADkEFKgR6wQF4LsEBKCrBAAA2AQUBPkCdHB5BBQiGAJ0AfsEA2CrBAXgqwQH+CDJBCRC2QMyOCN5A2QgyQOjgPgDNAPYBCQIEfgDpAIoBBQBGANkAckDMuDoAzQIFvkCdSIoAnQIEIkD9fgQeAP0AtkEFcA5AzSUyAM0BBkEJUgSaQOlgQkDZHF5AzMgyAM0AHgDpABoA2QFqQRFspgEJAgRCQM0UGkEZRDpA2NAiANkAQgDNAR4BBQDKwQFQKsEA7CbBAAEyQIE4+gERAAoBGQBGAIEAGsEBABJAsUgywQH8nkEZQAYAsQIJFkDZFE4BGQII4gDZAApA/TAaQO0EHkEdTa4A/QIEWgDtAPZA4TTSAOECBLoBHQASwQE8MsEA2CrBAAD6QMVsVkCUpEIAlQBGwQEoNsEB9C7BAfwKAMUBVkD1Cc4A9QC6QP0kIkDU/IJA7PEKAP0AQgDtAN5BBU4EekDhRApA7SYE2kElcOIA7QF6QMU8NgDhAAoA1QD+AMUA2kEdREbBAWQ2wQEAKsEAADIBJQFOAQUAukCpNKrBAOwGQRlULgCpAALBAfxyAR0CCPpAxLAGQOiIHgDFAFoA6QIIWkDZGDJA9PUqAPUBrgDZAfZA2SziQOigAgDpAGoA2QIFSsEBeCbBASgywQDYKsEAAA5AnWjyARkAWsEA2CrBASgiwQF4KsEB/gRaAJ0BOkD1RFJAzPmGAPUAykD9HgQGAP0AlkDpGApA2SAeQQVk3gDNARYA6QAmQQlR4gDZADJAzMxyAM0ATkERTaIBBQDKQRlIDgEJAJIBEQCGwQFQPsEA2C7BAAAyQIFEJgEZAM5AsWRaQRFgosEBPCbBAf3GQQlIogERAKIAgQCeALEA9kCw3BYBCQAiQQVWBDpBCTWmALEA5gEFAAZBEUxaQP1kLkDtHApA4TQ6QNkN3kEZLBIBCQGWAREAagEZAAoA/QB+QR1M3gDtAOYA4QCCANkAUkElWN4BHQGSwQF4JsEBKC7BAABGASUABkCJEC5AuVCCQS1E2sEA2C7BATwmwQH9YkEpWBYBLQAOAIkATgC5AgRCQS10hgEpAAZAyU3yAS0ATkE1YgUCQTlESkDhTFpA1PoEKkFBXgSuQUksMgDhAAYBOQCSAUEAZgFJACYA1QCeAMkBWkFZEWIBWQGewQH0KsEBPCrBANgaQV0wHsEAABoBNQFGQJ0dYsEBFE7BAf1aAV0BYgCdAD5AuP4FkkDM9gS2ALkAlgDNAJpA2JwGANkCBI5A6P4FEgDpAApA/Ql+AP0B6kEtHKIBLQIF2kGNREpBXPA2AY0AQgFdAhyywQG4JsEBPDLBANgiwQACCC5AzKiGQJyUYkBscl2mAG0AIgCdABoAzQAD/LwA=';