/**
 *
 * @param inputSelector a jquery style selector on which tiny mce is applied
 */
function setupTinyMCE(inputSelector){

  tinymce.init({
    selector: inputSelector,
    height: 500,
    theme: 'modern',
    plugins: [
      'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code fullscreen',
      'insertdatetime media nonbreaking save table contextmenu directionality',
      'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
    ],
    toolbar1: 'undo redo | forecolor backcolor | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
    image_advtab: true,
    templates: [
      { title: 'Test template 1', content: 'Test 1' },
      { title: 'Test template 2', content: 'Test 2' }
    ]
  });
}

function handleNavigationForActive(){
  // this function adds the active class to the currently selected list item
  $('#sidebar_List > li > a').each(function() {
    if (this.href == window.location.href) {
      $(this).addClass("mm-active");
      return ;
    }
  });
}
handleNavigationForActive() ;

function makeToast(toastStyle, toastMessage) {
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  } ;
  toastr[toastStyle](toastMessage) ;
}

$(".td-link").click(function() {
  window.location = $(this).data("href");
});
$(".tr-link").click(function() {
  window.location = $(this).data("href");
});

$(".addon-link").click(function() {
  window.location = $(this).data("href");
});


function handleBrowseButton_Preview(ButtonId, HiddenInputId, previewImageId){
  $('#'+ButtonId).click(function (event) {
    event.preventDefault() ; // prevents the form from automatically submitting
    $('#'+HiddenInputId).click(); // actually clicks the file upload browse button


    $('#'+HiddenInputId).change(function(event){
      // this function is run when file is successfully selected by user
      $('#' + previewImageId).attr('src', URL.createObjectURL(event.target.files[0]));
      $('#'+HiddenInputId).valid();
      return false ;
    });


  }) ;
}

function setupCheckboxToggleButton(PresentationToggleInputId, HiddenInputId){

  $('#' + PresentationToggleInputId).on('change', function() {
    if(this.checked){
      $('#' + HiddenInputId).val('1') ;
    } else {
      // this is necessary if user checked it and then unchecked it.
      $('#' + HiddenInputId).val('0') ;
    }
  });
}


function showLoadingSpinner(element){
  element.children('span').hide() ;
  element.children('div').remove() ;
  element.prepend(`
      <div class="spinner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
      </div>
  `) ;
}


function hideLoadingSpinner(element){
  element.children('span').show() ;
  element.children('div').hide() ;
}

function redirectBack(defaultRedirection){
  // check if there is query paramter called redirect like      https://www.rest.com?redirect=checkout
  // if there is , then go there, else go to argument given function parameter

  let searchParams = new URLSearchParams(window.location.search) ;
  if(searchParams.has('redirect')){
    window.location.href = "/" + searchParams.get('redirect') ;
  }else{
    window.location.href = defaultRedirection ;
  }
}

