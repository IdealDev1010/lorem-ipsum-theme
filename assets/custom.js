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