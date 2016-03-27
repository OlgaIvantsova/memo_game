
$(document).ready(function () {

	init();       
				
});

function init() {
	loadData();
 	checkClicks ();            
 }

function loadData () {
	$.ajax({
    	url: 'https://kde.link/test/get_field_size.php',             
   	 	async: false,
    	dataType : "json",  
    	type: "GET",                   
    	success: function (data) { 
    		var images = [];
			var fieldSize = data;
    		// if(fieldSize.width>8 && fieldSize.height>8) {location.reload();};//if size of field is more than 8, reload data
			var imagesAmount = fieldSize.width*fieldSize.height;
			if(imagesAmount>64) {imagesAmount=64};//define size of game field
			console.log(fieldSize);	
			loadImages(imagesAmount,fieldSize,images);//load images from server
			return imagesAmount;
		}  
 	});  
}

function checkClicks () {
	var compareArr=[];//array for compare opened images
    var timer;
    var flag = true;
    $('.image-wrap').click(function(event) {
 		event.preventDefault();
 		if(flag) {
 			if (!timer) { // startTimer
				var sec = 0;
				var timerWrap = document.getElementById('timer');
				timer = setInterval(function() {
					sec++;
					timerWrap.innerHTML = sec + 'сек';
				}, 1000);
			} 
 			var imageWrap = $(this);
 			// if(imageWrap.hasClass('image-wrap-active')) return;//only 2 images can be open
 			imageWrap.addClass('image-wrap-active');//open image
 			compareArr.push(imageWrap);
 			// console.log(compareArr.length);
 			if (compareArr.length==2) {	
 				flag = false;//only 2 images can be open
 				if (compareArr[0].attr('id') == compareArr[1].attr('id')) {//if pictures match, close them
 					setTimeout(function (argument) {
 						for (var i = 0; i < compareArr.length; i++) {
 						compareArr[i].removeClass('image-wrap').addClass('image-wrap-hidden');
 						compareArr[i].find('.image-shadow').show().css({background:'#ccc'});
 					};
 					if(!($('div').is('.image-wrap'))) {//show result of the game
 						clearInterval(timer);
 						showResults();
 					}
 					compareArr.length = 0; 
 					flag = true;
 					}, 300);
 					// compareArr[compareArr.length-1].removeClass('image-wrap-active').find('.image-shadow').show();
 				} else {
 						setTimeout(function () {
 							for (var i = 0; i < compareArr.length; i++) {
 							compareArr[i].removeClass('image-wrap-active');
 						}
 						compareArr.length = 0; 
 						flag = true;
 					}, 300);
 				};
 			}
 		}
 	});  
}

function startTimer (timer) {
		var sec = 0;
		var timerWrap = document.getElementById('timer');
		timer = setInterval(function() {
			sec++;
			timerWrap.innerHTML = sec + 'сек';
		}, 1000);
}

function showResults () {
	 	var timerWrap = document.getElementById('timer');
 		var result = parseInt(timerWrap.innerHTML);
 		timerWrap.innerHTML = 'Поздравляем! Твой результат составил ' +result+ ' сек';
 		var button = document.createElement('div');
 		button.id = "button";
 		button.innerHTML = "Новая игра"; 
 		document.body.insertBefore(button, document.body.lastChild);
 		$('#button').on('click', function () {//start new game
			location.reload();
		});
 			
}

function random(min, max) {
	var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function loadImages(amount,fieldSize) {
	$.ajax({
    	url: 'https://api.myjson.com/bins/ptse',             
   	 	async: false,
    	dataType : "json",  
    	type: "GET",                   
    	success: function (data) { 
    		createGameField(fieldSize);
    		images = data;
    		if(amount<20) {
    			images = images.slice(0, amount*0.5);
    		}
			else {
				for (var i = 0; images.length<amount*0.5; i++) {
					images.push(images[i]);
				}
			}
			images = images.concat(images);
			// var randomArr = images.slice();
			images = images.slice().map(function() {
				return images.splice(random(0,images.length-1), 1)[0];
				// randomArr.unshift(element1)
				// return arr[random(i, images.length-1)];
			});
			addImages();//add images on page
			// console.log(images);
		}  
 	});
}

function createGameField(fieldSize) {
	var IMAGE_LENGTH = 70;
	var wrapper = document.createElement('div');
	var wrapWidth = fieldSize.width*IMAGE_LENGTH;
	wrapper.style.width = wrapWidth +'px';
	wrapper.id = 'game-wrap';
	wrapper.className = "clearfix";
	document.body.appendChild(wrapper);
	var timerWrap = document.createElement('div');
	timerWrap.id = "timer";
	timerWrap.innerHTML = '0 сек';
	document.body.insertBefore(timerWrap, document.body.firstChild);
}

function addImages() {
	var gameWrap = document.getElementById('game-wrap');
	for (var i = 0; i < images.length; i++) {
		var elem = createImagesGrid(images, i);
		gameWrap.appendChild(elem);
	};
	return gameWrap;
}
function createImagesGrid(arr, i) {
		var imageWrap = document.createElement('div');
		imageWrap.className = 'image-wrap';
		var image = document.createElement('img');
		var imageShad = document.createElement('div');
		imageShad.className = "image-shadow";
		imageWrap.appendChild(imageShad);  
		imageWrap.id = arr[i].id;
		image.setAttribute('src',arr[i].url);
		imageWrap.appendChild(image); 
	return imageWrap;
}