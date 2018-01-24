$('a[href="#"]').click(function(e) {
    e.preventDefault();
});

$(function(){
  
  $(document).on('click',".select_contry li a",function(){
    
	var cur_name = $(this).find(".currency-shortname").text().replace(/\s/g,'');
    var cur_name = cur_name.toLowerCase();
    $(".currency-di-text").text(cur_name);
    if(cur_name == 'btc') {
        cur_name = 'btc-mono';
    }
    $(".currency-symbol img").attr('src','assets/currency-svg/'+cur_name+'.svg');
  });

});
function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function select_contry() {
    document.getElementById("mySidenav").style.width = "0";
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
setTimeout(function(){ 
    $('.loading').fadeOut();
}, 2000);

function topFunction() {
    $('html, body').animate({scrollTop:0}, 'slow');
}

$('.sing-up-link').click(function(){
    $('#sign-in').modal('toggle');
    $('#sing-up').modal('toggle');
});

$('.sing-in-link').click(function(){
    $('#sing-up').modal('toggle');
    $('#sign-in').modal('toggle');
});

$('.forgot-link').click(function(){
    $('#sign-in').modal('toggle');
    $('#forgot-pass').modal('toggle');
});


//menu
$('ul.nav li.dropdown').hover(function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
}, function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
});


//chart

var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),
		width = canvas.width = 800,
		height = canvas.height = 400;

var stats = [40, 65, 72, 120, 250, 87, 100, 42];

context.translate(0, height);
context.scale(1, -1);

context.fillStyle = 'rgba(0,0,0,0.0)';
context.fillRect(0, 0, width, height);

var left = 0,
		prev_stat = stats[0],
		move_left_by = 100;

for(stat in stats) {
	the_stat = stats[stat];
    context.rect(0, 0, canvas.width, canvas.height);
    var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);

    grd.addColorStop(0, '#000');  
    grd.addColorStop(1, '#000');
    context.fillStyle = grd;
	context.beginPath();
	context.lineWidth = 3;
	context.beginPath();
    context.lineCap = "round";
    context.moveTo(left, prev_stat);
    context.lineTo(left+move_left_by, the_stat);
    context.shadowColor='rgba(0,0,0,0.5)';
    context.shadowOffsetY=10;
    context.shadowBlur=50;

	if(the_stat < stats[stat-1]) {
		context.strokeStyle = '#ff8033';
	} else {
		context.strokeStyle = '#ff8033';
	}
	context.stroke();
	prev_stat = the_stat;
	left += move_left_by;
}

 
$(function(){

$(document).on('click','#dropdownMenuButton',function(){
    $('#crypto-currency-menu').slideToggle();
});
  
  $(document).on('click','.currency-list li div',function(){

	var cur_name = $(this).text();
    var cur_val = $(this).attr('value');
    $('#dropdownMenuButton').val(cur_name);
    $("#icon-currency img").attr('src','assets/images/'+cur_val+'.svg');
    $('#crypto-currency-menu').slideToggle();
  });

});
  
$(function(){
$(document).on('click','#currency-dropdownMenuButton',function(){
    $('#currency-menu').slideToggle();
});
  
  $(document).on('click','#addQuote li div',function(){

	var cur_name = $(this).text();
    var cur_val = $(this).attr('value');
    $('#currency-dropdownMenuButton').val(cur_name);
    $("#addQuote-icon img").attr('src','assets/images/'+cur_val+'.svg');
    $('#currency-menu').slideToggle();
  });

});

$('#datepicker').datepicker();

