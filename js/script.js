var imagesAmount;
	var images = [];
	var fieldSize = {};

$(document).ready(function () {
	
	$.ajax({
    	url: 'https://kde.link/test/get_field_size.php',             
   	 	async: false,
    	dataType : "json",  
    	type: "GET",                   
    	success: function (data) { 
    		fieldSize = data;
			imagesAmount = fieldSize.width*fieldSize.height;
			if(imagesAmount>64) {imagesAmount=64};
			console.log(fieldSize);
		}  
 	});
 	addImages();
 	loadImages(imagesAmount);
 	createGameField();
 	addImages();
 	// console.log(images);	
 	// alert(1); 

 	var compareArr=[];

 	$('.image-wrap').click(function(event) {
 		event.preventDefault();
 		var imageWrap = $(this);
 		if(imageWrap.hasClass('image-wrap-active')) return;
 		imageWrap.addClass('image-wrap-active');
 		imageWrap.find('.image-shadow').hide();
 		// if(!($('div').is('.image-wrap'))) {alert("Ты выиграл!");}
 		
 		compareArr.push(imageWrap);
 		console.log($('.image-wrap').length);
 		if (compareArr.length==3)
 		{			
 			if (compareArr[0].attr('id') == compareArr[1].attr('id')) {
 				for (var i = 0; i < compareArr.length-1; i++) {
 					compareArr[i].removeClass('image-wrap').addClass('image-wrap-hidden');
 					compareArr[i].find('.image-shadow').css({background:'#ccc'}).show();
 				};
 				compareArr[compareArr.length-1].removeClass('image-wrap-active').find('.image-shadow').show();
 				if($('.image-wrap').length==2) {alert("Ты выиграл!");}
 				compareArr.length = 0;
 			} else {
 				for (var i = 0; i < compareArr.length; i++) {
 					compareArr[i].find('.image-shadow').show();
 					compareArr[i].removeClass('image-wrap-active');
 				};
 				compareArr.length = 0; 
 			}
 		}
 		
 	});            


		
});

function random(min, max) {
	var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function loadImages(amount) {
	$.ajax({
    	url: 'https://api.myjson.com/bins/ptse',             
   	 	async: false,
    	dataType : "json",  
    	type: "GET",                   
    	success: function (data) { 
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
			console.log(images);
		}  
 	});
}

function createGameField() {
	var IMAGE_LENGTH = 96;
	var wrapper = document.createElement('div');
	var wrapWidth = fieldSize.width*IMAGE_LENGTH;
	wrapper.style.width = wrapWidth +'px';
	wrapper.id = 'game-wrap';
	wrapper.className = "clearfix";
	document.body.appendChild(wrapper);
}

function addImages() {
	var gameWrap = document.getElementById('game-wrap');
	for (var i = 0; i < images.length; i++) {
		var elem = createImagesTable(images, i);
		gameWrap.appendChild(elem);
	};
	return gameWrap;
}
function createImagesTable(arr, i) {
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