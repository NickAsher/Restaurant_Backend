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