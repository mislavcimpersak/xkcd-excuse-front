$(document).on({
    ajaxStart: function() {$('.progress_bar_row').show();},
    ajaxStop: function() {$('.progress_bar_row').hide();}
});

$(document).ready(function() {

    var frm = $('#excuse_form');
    var error_class = "error left-align";

    var excuse_img_url_div = $("#excuse_img_url");

    Materialize.updateTextFields();

    // client side form validation
    frm.validate({
        errorClass: 'invalid',
        rules: {
            who: {
                required: true,
                maxlength: 49  // number of letters 'i' that can fit
            },
            why: {
                required: true,
                maxlength: 98
            },
            what: {
                required: true,
                maxlength: 32
            }
        },
        messages: {
            who: {
                required: "💔 This field is required.",
                maxlength: "💔 Text too long."
            },
            why: {
                required: "💔 This field is required.",
                maxlength: "💔 Text too long."
            },
            what: {
                required: "💔 This field is required.",
                maxlength: "💔 Text too long."
            }
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
                    var img_url = data["data"]["image_url"]
                    img.attr("src", img_url);

                    var img_url_label = $("#img_url");
                    img_url_label.text(img_url);

                    excuse_img_url_div.show();

                    new Clipboard('.btn_img_url');
                },
                error: function (data) {
                    excuse_img_url_div.hide();

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
