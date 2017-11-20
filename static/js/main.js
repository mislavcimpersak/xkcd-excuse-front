$(document).ready(function() {

    var frm = $('#excuse_form');
    var error_class = "error left-align";

    Materialize.updateTextFields();

    // client side form validation
    frm.validate({
        errorClass: 'invalid',
        rules: {
            who: "required",
            why: "required",
            what: "required"
        },
        errorElement : 'div',
        errorClass: error_class,
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });

    // form submiting
    frm.submit(function (e) {
        e.preventDefault();

        if (frm.valid()) {
            $.ajax({
                type: frm.attr('method'),
                url: frm.attr('action'),
                data: frm.serialize(),
                success: function (data) {
                    var img = $("#excuse_img");
                    img.attr("src", data["data"]["image_url"]);
                },
                error: function (data) {
                    var errors = data.responseJSON["errors"];

                    Array.prototype.forEach.call(errors, error => {
                        var error_code = error["code"].toString();
                        var error_message = "<div class=\"" + error_class + "\">" + error["message"] + "</div>"

                        if (error_code.startsWith("101")) {
                            $(".excuse_who_error").append(error_message);
                        } else if (error_code.startsWith("102")) {
                            $(".excuse_why_error").append(error_message);
                        } else if (error_code.startsWith("103")) {
                            $(".excuse_what_error").append(error_message);
                        }
                    });
                }
            });
        }
    });
});
