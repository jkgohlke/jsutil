if( !Array.prototype.indexOf )
{
    Array.prototype.indexOf = function ( elt /*, from*/ )
    {
        var len = this.length >>> 0;

        var from = Number( arguments[1] ) || 0;
        from = (from < 0)
             ? Math.ceil( from )
             : Math.floor( from );
        if( from < 0 )
            from += len;

        for( ; from < len; from++ )
        {
            if( from in this &&
                this[from] === elt )
            return from;
        }
        return -1;
    };
}

if( !Array.prototype.deleteAll )
{
    Array.prototype.deleteAll = function ( value )
    {
        var index;
        while ( (index = this.indexOf( value )) !== -1) {
            this.splice(index, 1);
        }
    };
}

if( !Array.prototype.deleteFirst )
{
    Array.prototype.deleteFirst = function ( value )
    {
        var index = this.indexOf( value );
        if (index !== -1) {
            this.splice(index, 1);
        }
    };
}

Array.prototype.clone = function ()
{
    return this.slice( 0 );
};

function stripHtml( str )
{
    var tmp = document.createElement( "DIV" );
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText;
}

function urlDecode( str )
{
   return decodeURIComponent( (str + '' ).replace( /\+/g, '%20' ) );
}

function objectToString( o )
{
    var parse = function ( _o )
    {
        var a = [], t;
        for( var p in _o )
        {
            if( _o.hasOwnProperty( p ) )
            {
                t = _o[p];
                if( t && typeof t == "object" )
                {
                    a[a.length] = p + ":{ " + arguments.callee( t ).join( ", " ) + "}";
                }
                else
                {
                    if( typeof t == "string" )
                    {
                        a[a.length] = [ p + ": \"" + t.toString() + "\"" ];
                    }
                    else
                    {
                        var s = "";
                        if( t == null )
                        {
                            s = "null";
                        }
                        else if( t == undefined )
                        {
                            s = "undefined";
                        }
                        else
                            s = t.toString();
                        a[a.length] = [ p + ": " + s];
                    }
                }
            }
        }
        return a;
    };
    return "{" + parse( o ).join( ", " ) + "}";
}