$(window).resize(function() {
   toggleSearchInputField();
});

toggleSearchInputField();

function toggleSearchInputField(){
    if ($(window).width() > 748){
        $('body').addClass('show-search');
   } else{
    $('body').removeClass('show-search');
   }
};

$(document).ready(function() {
   if ($('.announcement-bar').length) {

       if (localStorage.getItem('barDismissed')) {
           $(".announcement-bar").remove();
       } else {
           $('.announcement__close-icon').click(function() {
               $(".announcement-bar").remove();
               localStorage.setItem('barDismissed', true);
           });  
       }
   }
});