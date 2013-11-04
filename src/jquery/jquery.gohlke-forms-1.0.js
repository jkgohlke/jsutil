jQuery.fn.fillField = function()
{
    var value = undefined;
    if( arguments.length >= 1 )
        value = arguments[0];
    var field = $( this[0] );
    var type;
    if( $( field ).is( 'textarea' ) )
        type = "textarea";
    else if( $( field ).is( 'select' ) )
    {
        type = "select" + (($( field ).attr( "multiple" ) == "yes") ? ("-multiple") : ("-one") );
    }
    else
        type = field.attr( 'type' );

    // hidden, text, password
    if (type == 'text' || type == 'hidden' || type == 'password') {
        field.attr('value', value);
        return true;
    }
    // textarea
    else if(type == 'textarea') {
        field.text(value);
        return true;
    }
    // checkbox
    else if(type == 'checkbox') {
        if( field.val() == undefined )
        {
            if( value != undefined && value.length > 0 )
                field.attr("checked", "checked");
            else
                field.removeAttr( "checked" );
        }
        else
        {
            if( value == field.val() )
                field.attr("checked", "checked");
            else
                field.removeAttr( "checked" );
        }
        return true;
    }
    // radio button
    else if(type == 'radio') {
        if( value == undefined || (value != undefined && value.length > 0) )
            field.attr( "checked", "checked" );
        else
            field.removeAttr("checked");
        return true;
    }
    // select-one, select-multiple
    else if (type == 'select-one' || type == 'select-multiple') {
        field.find("option").each(function() {
            if( value == undefined )
            {
                if( $(this).attr("value") == undefined )
                {
                    $(this).attr("selected", "selected");
                }
                else
                {
                    $(this).removeAttr("selected");
                }
            }
            else
            {
                if($(this).text() == value || $(this).attr("value") == value) {
                    $(this).attr("selected", "selected");
                } else {
                    if( value.length <= 0 )
                        $(this).removeAttr("selected");
                }
            }
        });
        return true;
    } else {
        return false;
    }
};