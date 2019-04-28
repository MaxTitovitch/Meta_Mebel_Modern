jQuery(function($) {
    alert('Hello World')
});


function addAjaxQuery(path, data, functionSuccess) {
    $.ajax({
        url: path,
        method: "get",
        contentType: false, 
        processData: false,
        data: data,
        success: functionSuccess
    });
}


// function createAjaxRequest() {
//     $.ajax({
//         url: "/readFile",
//         method: "post",
//         contentType: false, 
//         processData: false,
//         data: new FormData($("#my-form").get(0)),
//         success: checkFile
//     });
// }
