/** Trims the white space from the string
 */
if( !String.prototype.trim )
{
    String.prototype.trim = function ()
    {
        return (this.replace( /^[\s\xA0]+/, "" ).replace( /[\s\xA0]+$/, "" ));
    };
}

if( !String.prototype.replaceAll )
{
    String.prototype.replaceAll = function ( replace, with_this )
    {
      return this.replace( new RegExp( RegExp.escape( replace ), 'g' ), with_this );
    };
}

if( !RegExp.prototype.escape )
{
    RegExp.escape = function ( text )
    {
      return text.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
    }
}
/** Returns true if the string starts with the provided substring
 * @param {String} subString   Required. The string to search for;
 */
if( !String.prototype.startsWith )
{
    String.prototype.startsWith = function ( subString )
    {
        if( typeof( subString ) === "undefined" || !subString.length )
            return false;
        return (this.match( "^" + subString ) == subString);
    };
}

/** Returns true if the string ends with the provided substring
 * @param {String} subString   Required. The string to search for;
 */
if( !String.prototype.endsWith )
{
    String.prototype.endsWith = function ( subString )
    {
        if( typeof( subString ) === "undefined" || !subString.length )
            return false;
        return (this.match( subString + "$" ) == subString);
    };
}

/** Counts the occurrences of substring within a string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 */
String.prototype.occurrences = function( subString, allowOverlapping )
{
    if( typeof( subString ) === "undefined" || !subString.length )
        return 0;

    var str = this;

    str += "";
    subString += "";
    if( subString.length <= 0 ) return str.length + 1;

    var n = 0, pos = 0;
    var step = (allowOverlapping) ? (1) : (subString.length);

    while( true )
    {
        pos = str.indexOf( subString, pos );
        if( pos >= 0 )
        {
            n++;
            pos += step;
        }
        else break;
    }
    return(n);
};

String.prototype.stripHtml = function()
{
    var str = this;
    if( typeof(jQuery) !== "undefined" )
        return $( '<div />' ).html( str ).text();
    else
    {
        var tmp = document.createElement( "div" );
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText;
    }
};

function humanizeFileSize(bytes) {
    var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = 0;
    while(bytes >= 1024) {
        bytes /= 1024;
        ++i;
    }
    return bytes.toFixed(1) + ' ' + units[i];
}

function humanizeDuration( seconds )
{
    if( seconds <= 0 )
      return null;

    // Calculate the number of days left
    var days = Math.floor( seconds / 86400 );
    // After deducting the days calculate the number of hours left
    var hours = Math.floor( (seconds - ( days * 86400 )) / 3600 );
    // After days and hours, how many minutes are left
    var minutes = Math.floor( (seconds - ( days * 86400 ) - ( hours * 3600 )) / 60 );
    // Finally how many seconds left after removing days, hours and minutes.
    var secs = Math.floor( (seconds - ( days * 86400 ) - ( hours * 3600 ) - ( minutes * 60 )) );

    var x = "";
    if( days > 0 )
      x = x + days + " days ";
    if( days > 0 || hours > 0 )
      x = x + hours + " hours ";
    if( days > 0 || hours > 0 || minutes > 0 )
      x = x + minutes + " minutes ";
    if( days > 0 || hours > 0 || minutes > 0 || secs > 0 )
    {
      if( days > 0 || hours > 0 || minutes > 0 )
        x = x + "and ";
      x = x + secs + " seconds";
    }
    x = x.trim();

    return x.length > 0 ? x : null;
}

function humanizeDurationAbbreviated( seconds )
{
    if( seconds <= 0 )
      return null;

    // Calculate the number of days left
    var days = Math.floor( seconds / 86400 );
    // After deducting the days calculate the number of hours left
    var hours = Math.floor( (seconds - (days * 86400 )) / 3600 );
    // After days and hours, how many minutes are left
    var minutes = Math.floor( (seconds - (days * 86400 ) - (hours * 3600 )) / 60 );
    // Finally how many seconds left after removing days, hours and minutes.
    var secs = Math.floor( (seconds - (days * 86400 ) - (hours * 3600 ) - (minutes * 60)) );

    var x = "";
    if( days > 0 )
      x = x + days + "d ";
    if( days > 0 || hours > 0 )
      x = x + hours + "h ";
    if( days > 0 || hours > 0 || minutes > 0 )
      x = x + minutes + "m ";
    if( days > 0 || hours > 0 || minutes > 0 || secs > 0 )
      x = x + secs + "s";
    x = x.trim();

    return x.length > 0 ? x : null;
}

function humanizeDurationShort( seconds )
{
    if( seconds <= 0 )
      return null;

    var minutes = Math.floor( seconds / 60 );
    var secs = Math.floor( (seconds - (minutes * 60)) );

    var x = "";
    x = x + minutes + ":";
    if( secs > 0 && secs < 10 )
      x = x + "0" + secs;
    if( secs <= 59 )
      x = x + secs;
    else
      x = x + "00";
    x = x.trim();

    return x.length > 0 ? x : null;
}