

jQuery(function($) {
    $('#save-pass').click(onSaveSettings);
    $('.remove-user').click(onRemoveUser);
    $('.update-user').click(onUpdateUser);
    $('.create-user').click(onCreateUser);
    $('#add-save-user').click(onSaveOrAddUser);
    $('#pay-tshirt').click(onPayTshirt);
});


function addAjaxQuery(path, data, method, success, error) {
    $.ajax({
      url: path,
      type: method,
      data: data,
      success: success,
      error: error
    });
}


var onSaveSettings = function (event) {
    // event.preventDefault();
    var user = {
        id: location.pathname.split('/')[2],
        language: $("#language div input:checked").val(),
        theme: $("#theme div input:checked").val(),
        fullName: $("#fullName").val(),
        date: $("#date").val(),
        password: $("#password").val(),
    }
    addAjaxQuery('/savesetting', user, 'post', updateSettingSuccess, function(){})
}

var updateSettingSuccess = function () {
    window.location.reload();
}

var onRemoveUser = function (event) {
    event.preventDefault();
    addAjaxQuery('/removeuser', {id: $(this).attr('id').split('-')[1]}, 'post', updateSettingSuccess, function(){}) 
}

var onUpdateUser = function (event) {
    event.preventDefault();
    var rowColumns = $(this).parent().parent().children('td');
    $('#fullName1').val(rowColumns.eq(1).text());
    $('#role1').val(rowColumns.eq(4).text());
    $('#date1').val(rowColumns.eq(5).text());
    $('#email1').val(rowColumns.eq(2).text());
    $('#password1').val(rowColumns.eq(3).text());
    $('#userIdSave').val(rowColumns.eq(0).text());

    $('#add-save-user').text('Сохранить');
    $('#updateUserModal').modal('show');
}

var onCreateUser = function (event) {
    event.preventDefault();
    $('#fullName1').val("");
    $('#role1').val("");
    $('#date1').val("");
    $('#email1').val("");
    $('#password1').val("");
    $('#userIdSave').val("0");

    $('#add-save-user').text('Добавить');
    $('#updateUserModal').modal('show');
}

var onSaveOrAddUser = function (event) {
    var user = {
        id: $("#userIdSave").val(),
        email: $("#email1").val(),
        password: $("#password1").val(),
        role: $("#role1").val(),
        fullName: $("#fullName1").val(),
        date: $("#date1").val(),
    }
    addAjaxQuery('/saveuser', user, 'post', updateSettingSuccess, function(){}) 
}

var onPayTshirt = function (event) {
    var order = {
        userID: userID,
        address: address,
        phone: phone,
    }
    var orderTshirt = {
        tshirtID: tshirtID,
        orderID: orderID, 
        gender: $("#language div input:checked").val(), 
        size: $("#language div input:checked").val(), 
        color: $("#language div input:checked").val()
    }
    addAjaxQuery('/addorder', {order: order, orderTshirts: [orderTshirt]}, 'post', updateSettingSuccess, function(){}) 
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
