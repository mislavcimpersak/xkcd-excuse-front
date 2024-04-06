$(document).on({
    ajaxStart: function() {$('.progress_bar_row').show();},
    ajaxStop: function() {$('.progress_bar_row').hide();}
});

$(document).ready(function() {

    var frm = $('#excuse_form');
    var error_class = "error left-align";

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
            // Disable submit button
            $('#excuse_generate').prop('disabled', true);

            const who = $('#excuse_who').val();
            const why = $('#excuse_why').val();
            const what = $('#excuse_what').val();
            const result = get_excuse_image(who, why, what);
            Promise.race([result]).then(data => {
                // Enable submit button
                $('#excuse_generate').prop('disabled', false);

                if (typeof data === 'string') {
                    // Success
                    const img = document.getElementById("excuse_img");
                    img.src = `data:image/png;base64,${data}`;
                } else {
                    // Error
                    const errors = data.toJs();
                    Array.prototype.forEach.call(errors, error => {
                        var error_code = error.get("code").toString();
                        var error_message = "<div class=\"" + error_class + "\">" + error.get("message").toString() + "</div>"
                        if (error_code.startsWith("101")) {
                            $(".excuse_who_error").append(error_message);
                        } else if (error_code.startsWith("102")) {
                            $(".excuse_why_error").append(error_message);
                        } else if (error_code.startsWith("103")) {
                            $(".excuse_what_error").append(error_message);
                        }
                    });
                }
            }).catch(err => {
                // Enable submit button
                $('#excuse_generate').prop('disabled', false);
                
                console.error(err);
            });
        }
    });
});


async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
}

async function get_excuse_image(who, why, what) {
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("pillow");
    const scriptData = await fetchData("/app.py");
    const decoder = new TextDecoder('utf-8');
    const scriptText = decoder.decode(scriptData);
    const get_excuse_image_fn = await pyodide.runPython(scriptText);
    return get_excuse_image_fn(who, why, what);
};
