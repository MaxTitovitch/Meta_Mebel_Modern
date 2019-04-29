

jQuery(function($) {
    $('#save-pass').click(onSaveSettings);
    $('.remove-user').click(onRemoveUser);
    $('.update-user').click(onUpdateUser);
    $('.create-user').click(onCreateUser);
    $('#add-save-user').click(onSaveOrAddUser);
    $('#pay-tshirt').click(onPayTshirt);
    $('#delivery-type div input').click(onChangeDelivery);
    $('#delete-this-tshirt').click(onRemoveTshirt);
    $('#user_ranking input').click(onSaveRanking);
    $('#new-tag').keyup(onAddTag);
    $('#add-comment').click(onAddComment);
    $('.comment-like').click(onAddLike);
    $('#search').click(onSearch);
    $('#add-text-img').click(onAddTextImg);
    $('#gender-tshirt div input').click(onChangeGender);
    $('#save-tshirt').click(onSaveTshirt);
    $('#color').change(onChangeColor);
    $('#myfile').change(onDragEnter);
    addPulsComment();
    disableLink();
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
    if($("#user-address").val() == '' || $("#user-phone").val() == '') return;
    var order = {
        userID: $("#user-index").val(),
        address: $("#user-address").val(),
        phone: $("#user-phone").val()
    }

    var orderTshirt = {
        tshirtID: location.pathname.split('/')[2],
        orderID: null, 
        gender: $("#payed-gender div input:checked").val(), 
        size: $("#payed-size div input:checked").val(), 
        color: $("#payed-color").val()
    }
    addAjaxQuery('/addorder', order, 'post', onOrderAdded(orderTshirt), function(){})  
}

var onOrderAdded = function (orderTshirt) {
    return function (data) {
        orderTshirt.orderID = data.id;
        addAjaxQuery('/addordertshirt', orderTshirt, 'post', addMailMessage(orderTshirt.orderID), function(){});
    }
}

var addMailMessage = function (id) {
    return function (data) {
        window.location.replace('/'); 
        addAjaxQuery('/addmail', {id: id}, 'post', updateSettingSuccess, function(){});
    }
}
var onChangeDelivery = function (event) {
    var addressInput = $('#user-address');
    if($(this).val() == 'deliv') {
        addressInput.val('');
        addressInput.attr('disabled', false);
    } else {
        addressInput.val('САМОВЫВОЗ');
        addressInput.attr('disabled', true);

    }
}

var onRemoveTshirt = function (event) {
    addAjaxQuery('/removetshirt', {id: location.pathname.split('/')[2]}, 'post', function(){
        window.location.replace('/'); 
    }, function(){});
}

var onRemoveTshirt = function (event) {
    addAjaxQuery('/removetshirt', {id: location.pathname.split('/')[2]}, 'post', function(){
        window.location.replace('/'); 
    }, function(){});
}

var onSaveRanking = function (event) {
    var value = $(this).val()
    var ranking = {
        value: value,
        userID: $("#user-index").val(),
        tshirtID: location.pathname.split('/')[2],
    }
    addAjaxQuery('/saveranking', ranking, 'post', updateSettingSuccess, function(){});
}


var onAddTag = function (event) {
    if(event.which == 13) {
        $(this).before($('<a>', {href: 'href="/search?value=' + $(this).val(), class: "badge badge-pill badge-dark"}).append($(this).val()));
        $(this).val('');
    }
}

var onAddComment = function (event) {
    var text = $('#new-comment').val();
    if(text != '') {
        var comment = {
            userID: $("#user-index").val(),
            tshirtID: location.pathname.split('/')[2],
            text: text
        }
        $('#new-comment').val("");
        addAjaxQuery('/addcomment', comment, 'post', updateSettingSuccess, function(){});
    }
}

var addPulsComment = function () {
    if(location.pathname.split('/')[1] == "tshirt") {
        var currentSize = $("#count-comment").val();
        var timerId = setInterval(function() {
            addAjaxQuery('/isneedupdate', {id: location.pathname.split('/')[2]}, 'post', isUpdateWindow(currentSize), function(){});
        }, 5000);
    }
}

var isUpdateWindow = function (currentSize) {
    return function (data) {
        if(data.size != currentSize) {
            updateSettingSuccess();
        }
    }
}


var onAddLike = function () {
    var like = {
        userID: $("#user-index").val(),
        commentID: $(this).parent().parent().attr('id').split('-')[1]
    }
    if($(this).attr('class').split(' ')[1] == 'liked'){
        addAjaxQuery('/removelike', like, 'post', updateSettingSuccess, function(){}); 
    } else {
        addAjaxQuery('/addlike', like, 'post', updateSettingSuccess, function(){}); 
    }
}

var disableLink = function () {
    var pages = $('.page');            
    if(location.search == '')
        $(pages[0]).attr('disabled', true); 
    else {
        for (var i = 0; i < pages.length; i++) {

            if($(pages[i]).text() == location.search.split('=')[1]) {
                $(pages[i]).attr('href', "javascript: void(0)");
                $(pages[i]).attr('class', "text-dark");
            }
        }            
    }   

}

var onSearch = function (event) {
    event.preventDefault();
    window.location.replace('/search?value=' + $('#search-value').val()); 
}

 var onChangeColor = function (event) {
    $("#clippedDiv").attr('style', 'background-color: ' + $(this).val() + ';');
    $("#miniPolygon").attr('style', 'background-color: ' + $(this).val() + ';');
 }

var onAddTextImg = function (event) {
    var text = $('<p contentEditable="true">' + $('#added-text').val() + '</p>', {});
    text.css({
        'font-size': $('#added-size').val() + "px",
        'color': $('#added-color').val(),
        'padding-top': '60px',
        'padding-left': '160px',
    });
    $('#clippedDiv').append(text);
    $(text).draggable();
    $('#addTextModal').modal('hide');
}

var onDragEnter = function (event) {
    $.ajax({
        url: "/saveimg",
        method: "post",
        contentType: false, 
        processData: false,
        data: new FormData($("#my-form").get(0)),
        success: checkFile
    });
}

var checkFile = function (data) {
    var img = $('<img>', {"src": data});
    img.css({
        'width': "300px",
    });
    $('#clippedDiv').append(img);
    $(img).draggable();
}


var onChangeGender = function (event) {
    if($(this).val() == "M") {
        $("#clippedDiv").addClass("men-poly");
        $("#clippedDiv").removeClass("women-poly");
        $("#miniPolygon").addClass("men-mini");
        $("#miniPolygon").removeClass("women-mini");
    } else {
        $("#clippedDiv").removeClass("men-poly");
        $("#clippedDiv").addClass("women-poly");
        $("#miniPolygon").removeClass("men-mini");
        $("#miniPolygon").addClass("women-mini");

    }
}

var onSaveTshirt = function (event) {
    var tags = '';
    for (var i = 0; i < $(".badge-dark").length; i++) {
        tags += $(".badge-dark").eq(i).text ();
        if(i+1 < $(".badge-dark").length) tags += ',';
    }
    var tshirt = {
        id: location.pathname.split('/')[2],
        name: $("#name").val(),
        image: "",
        html: $(".img-container").html(),
        shortText: $("#shortText").val(),
        price: $("#price").val(),
        ranking: 0,
        userID: $("#user-index").val(),
        color:  $("#clippedDiv").css('background-color'),
        tags: tags
    }
    addAjaxQuery('/addtshirt', tshirt, 'post', doRedirecr, function(){}); 
}

var doRedirecr = function (data) {
    window.location.replace('/tshirt/' + data);
}


































































