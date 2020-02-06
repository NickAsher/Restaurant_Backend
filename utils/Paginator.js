class Paginator {
  constructor(_totalNoOfItems, _itemsPerPage, _currentPageNo ){

    this.totalNoOfItems = _totalNoOfItems ;
    this.itemsPerPage = _itemsPerPage ;
    this.currentPageNo = _currentPageNo ;

    if(this.totalNoOfItems == 0){
      this.maxPageNo = 1 ;
    } else {
      if(this.totalNoOfItems%this.itemsPerPage == 0){
        // 20%10 = 0   so two pages (20/10)
        this.maxPageNo = this.totalNoOfItems/this.itemsPerPage ;
      }else{
        // 21/10 = 1  so three pages (21/10 + 1)
        this.totalNoOfItems = parseInt(this.totalNoOfItems/this.itemsPerPage)+1 ;
      }
    }

    this.currentPageNo = _currentPageNo || '1' ; // checks if currentPageNo is undefined or not
    this.currentPageNo = parseInt(_currentPageNo) || 1; // checks if currentPageNo is an integer
    if(this.currentPageNo < 1){
      this.currentPageNo = 1 ;
    }
    if(this.currentPageNo > this.maxPageNo){
      this.currentPageNo = this.maxPageNo ;
    }


    this.offset = (this.currentPageNo - 1)*this.itemsPerPage ;






  }


  getPageNo(){
    return this.currentPageNo ;
  }

  getOffset(){
    return this.offset ;
  }

  getEntriesLine(){
    let startingItemNo = this.offset + 1 ;
    let endingItemNo = this.offset + this.itemsPerPage;
    return `Showing ${startingItemNo} to ${endingItemNo} of ${this.totalNoOfItems} entries` ;
  }

  getPaginatedHTML(_pageURL){

    let pageNo = this.currentPageNo ;

    let nextPage = this.currentPageNo + 1 ;
    let prevPage = this.currentPageNo - 1 ;

    let firstPageNo = 1 ;
    let lastPageNo = this.maxPageNo;

    let pageName = _pageURL ;






    if( pageNo == 1 && pageNo == lastPageNo){
      // case when there is only one page. We show   | 1 |

      return `
      <!--<div style='display:inline-block;float: right'>-->
        <ul class='pagination justify-content-center' >
            <li class='page-item active'><a class='page-link' href='${pageName}?page=${pageNo}'>${pageNo}</a></li>
        </ul>
      <!--</div>-->
      ` ;
    }

    else if( pageNo == 1 && pageNo != lastPageNo){
      // case we are at first page and there are more pages, we show    | 1 | Next | Last |

      return `
      <!--<div style='display:inline-block;float: right'>-->
        <ul class='pagination justify-content-center' >
            <li class='page-item active'><a class='page-link' href='${pageName}?page=${pageNo}'>${pageNo}</a></li>
            <li class='page-item'><a class='page-link' href='${pageName}?page=${nextPage}'>Next</a></li>
            <li class='page-item'><a class='page-link' href='${pageName}?page=${lastPageNo}'>Last</a></li>
          </ul>
      <!--</div>-->
      ` ;
    }



    else if(pageNo > 1 && pageNo < lastPageNo) {
    //                                                               | First | Prev | cur | Next | Last |
      return `          
      <!--<div style='display:inline-block;float: right'>-->
        <ul class='pagination justify-content-center'>
          <li class='page-item'><a class='page-link' href='${pageName}?page=${firstPageNo}'>First</a></li>
          <li class='page-item'><a class='page-link' href='${pageName}?page=${prevPage}'>Prev</a></li>
          <li class='page-item active'><a class='page-link' href='${pageName}?page=${pageNo}'>${pageNo}</a></li>
          <li class='page-item'><a class='page-link' href='${pageName}?page=${nextPage}'>Next</a></li>
          <li class='page-item'><a class='page-link' href='${pageName}?page=${lastPageNo}'>Last</a></li>
        </ul>
      <!--</div>-->


      ` ;
    }

    else if(pageNo == lastPageNo){
      //                                                               | First | Prev | cur |
      return `
      <!--<div style='display:inline-block;float: right'>-->
        <ul class='pagination justify-content-center'>
          <li class='page-item'><a class='page-link' href='${pageName}?page=${firstPageNo}'>First</a></li>
          <li class='page-item'><a class='page-link' href='${pageName}?page=${prevPage}'>Prev</a></li>
          <li class='page-item active'><a class='page-link' href='${pageName}?page=${pageNo}'>${pageNo}</a></li>
        </ul>
      <!--</div>                    -->
      ` ;
    }








  }

}

module.exports = Paginator ;