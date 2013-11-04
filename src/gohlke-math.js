var MathProxy = Math;

MathProxy.deg2rad = function( degrees )
{
    return degrees * .017453292519943295; // (degrees / 180) * Math.PI;
};

MathProxy.rad2deg = function ( radians )
{
    return radians * 57.29577951308232; // (radians / 180) * Math.PI;
};

MathProxy.intersects = function ( x, y, rect )
{
    return ( x >= rect.x && y >= rect.y && x <= rect.x + rect.width && y <= rect.y + rect.height );
};

MathProxy.lerp = function( a, b, f )
{
    a = Math.ensureFloat( a );
    b = Math.ensureFloat( b );
    f = Math.ensureFloat( f );
    return Math.ensureFloat( (1 - f) * a + f * b );
};

MathProxy.integerToBase = function(number, radix, bits)
{
    if( typeof( radix ) === "undefined" || radix === null )
        radix = 10;
    if( typeof( bits ) === "undefined" || bits === null )
    {
        return parseInt( number, radix );
        //bits = 32;
    }
    
    number = parseInt( Math.floor( number ) );
        
    radix = Math.clamp( radix, 2, 36 );
    
    var max = ( Math.pow( 2, bits ) - 1 );
    var bitsPerByte = 8;
    var numBytes = (radix / bitsPerByte) * (bits / bitsPerByte);
    
    while( number < 0 ) {
        number = number + max + 1; //overflow...
    }
    
    while( number >= (max + 1) ) {
        number = number - max; //underflow...
    }

    return Math.padWithZeros( number.toString(radix).toUpperCase(), numBytes );
}

MathProxy.integerToHex = function(number, bits)
{
    return Math.integerToBase(number, 16, bits);
}

MathProxy.hexToInteger = function(number, radix)
{
    return parseInt(number, 16);
}

MathProxy.padWithZeros = function(number, length)
{
    if( typeof(length) === "undefined" || length === null || typeof(number) === "undefined" || number === null || !Math.isNumeric( length ) )
        return null;
        
    var padded = ("" + number);
    while (padded.length < length) {
        padded = "0" + padded;
    }
    
    return padded;
}

MathProxy.clamp = function( value, min, max ) {
    return Math.max( min, Math.min( max, value ) );
}

MathProxy.isNumeric = function( n ) {
    return !isNaN( n );
}

MathProxy.isString = function( s ) {
    return typeof( s ) === "string";
}

MathProxy.ensureFloat = function( n ) {
    var s = n + "";
    if( n===+n && n!==(n|0) )
        return s;
    n = parseFloat(n) + "";
    if( isNaN( s ) || isNaN( n ) || n.length == 0 )
        return null;
    if( n.indexOf(".") < 0 )
        n += ".0";
    if( !/^[-]?[0-9]+([.][0-9]*)?$/.test( n ) )
        return null;
    return parseFloat( n );
}

MathProxy.isFloat = function( n ) {
    /*if(isNaN(n) || n.indexOf(".")<0){
        return false;
    } else if( n===+n && n!==(n|0) ) {
        return true;
    } else if(parseFloat(n)) {
        return true;
    } else {
        return false;
    }*/
    return parseFloat( MathProxy.ensureFloat( n ) ) === parseFloat( n );
}

MathProxy.ensureInteger = function( n ) {
    var s = n + "";
    if( n===+n && n===(n|0) )
        return s;
    n = parseInt(n) + "";
    if( isNaN( s ) || isNaN( n ) || n.length == 0 )
        return null;
    if( n.indexOf(".") > 0 )
        return null;
    if( !/^[-]?[0-9]+$/.test( n ) )
        return null;
    return parseInt( n );
}

MathProxy.isInteger = function( n ) {
    //return n===+n && n===(n|0);
    return parseInt( MathProxy.ensureInteger( n ) ) === parseInt( n );
}

MathProxy.ensurePercentage = function( n ) {
    var m = /^([-]?[0-9]+([.][0-9]*)?)[%]$/.exec( n );
    if( !m )
        return null;  
    return MathProxy.ensureFloat( m[1] );
}