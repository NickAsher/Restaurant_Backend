function openNav() {
    $('.t3-sidebar').css('width', '250px') ;
    $('.t3-push').css('margin-left', '250px') ;

}

function closeNav() {
    $('.t3-sidebar').css('width', '0px') ;
    $('.t3-push').css('margin-left', '0px') ;
}

function openAndCloseNav(){
    /*
     * This function handles the opening and closing of the Nav
     * There are two cases, one is opening the nav when it is closed
     * Second is to close the nav when it is open
     *
     * We check whether the nav is open or close by giving it a class called is-close and is-open
     * At a time, only one of these two classes is present on the nav.
     * If is-close is present, it means that the navbar is closed. If is-open is present, then navbar is open
     * By default, is-close is there.
     *
     *
     */
    $('.t3-btn').html("<span></span><span></span><span></span>")



    $('.t3-btn').click(function () {

        $(this).toggleClass('open');

        // When the sidebar is closed
        if($(this).hasClass("is-close")){
            openNav() ;
            $(this).addClass("is-open") ;
            $(this).removeClass("is-close") ;
            return false ;
        }
        // When the sidebar is open
        else if($(this).hasClass("is-open") ){
            closeNav() ;
            $(this).addClass("is-close") ;
            $(this).removeClass("is-open") ;
            return false ;
        }



    }) ;

}






function handleNavigationForActive(listClass){
    // this function adds the active class to the currently selected list item

    var CorrectAnchorElementId = '' ;

    $(listClass + " > li > a").each(function() {
        var anchorElement = this ;

        var currentUrl = location.protocol + '//' + location.host + location.pathname ;

        if (anchorElement.href == currentUrl) {
            console.log("this.href = " + anchorElement.href + " & window location href = " + window.location.href) ;
            $(this).addClass("active");
            CorrectAnchorElementId = this.id ;
            console.log(CorrectAnchorElementId) ;
        }
    });
    return CorrectAnchorElementId ;

}

function handleNestedListNavigationForActive(listClass, nestLevel){
    switch (nestLevel){
        case 0:
            break ;
        case 1:
            var anchorElementId = handleNavigationForActive(listClass) ;
            var ParentDiv = $("#" + anchorElementId).parent().parent().parent() ;
            ParentDiv.collapse("show") ;
            var ParentListAnchorId = "link_sublist_" + ParentDiv.attr('id') ;
            //console.log(ParentListAnchorId) ;
            $('#' + ParentListAnchorId).addClass("active-sub") ;
            break ;
    }


}


openAndCloseNav() ;
handleNavigationForActive(".t3-list") ;
var anchord = handleNestedListNavigationForActive(".t3-sublist", 1) ;