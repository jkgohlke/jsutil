var Color = {};
Color.__private__ = {};

Color.white = { r:255, g:255, b:255 };
Color.gray = { r:127, g:127, b:127 };
Color.black = { r:0, g:0, b:0 };

Color.__private__.rgbToHexAllowShorthand = true;

Color.blend = function( left, right, leftToRightRatio )
{
    if( typeof(left) === "undefined" || left === null ||
        typeof(right) === "undefined" || right === null )
        return null;
        
    if( typeof(leftToRightRatio) === "undefined" || leftToRightRatio === null )
        leftToRightRatio = 0.5;
     
    leftToRightRatio = Math.clamp( leftToRightRatio, 0, 1 );
     
    if( leftToRightRatio == 0 )
        return left;
    
    if( leftToRightRatio == 1 )
        return right;    
        
    var processed = null;
    if( Object.prototype.toString.call( left ) === '[object Object]' && "r" in left && "g" in left && "b" in left &&
        Object.prototype.toString.call( right ) === '[object Object]' && "r" in right && "g" in right && "b" in right )
    {
        processed = {};
        processed.r = Color.__private__.parseByte( Math.clamp( ( ( left.r * ( 1 - leftToRightRatio ) ) + ( right.r * leftToRightRatio ) ), 0, 255 ) );
        processed.g = Color.__private__.parseByte( Math.clamp( ( ( left.g * ( 1 - leftToRightRatio ) ) + ( right.g * leftToRightRatio ) ), 0, 255 ) );
        processed.b = Color.__private__.parseByte( Math.clamp( ( ( left.b * ( 1 - leftToRightRatio ) ) + ( right.b * leftToRightRatio ) ), 0, 255 ) );
    }
    if( Object.prototype.toString.call( left ) === '[object Object]' && "h" in left && "s" in left && "v" in left &&
        Object.prototype.toString.call( right ) === '[object Object]' && "h" in right && "s" in right && "v" in right )
    {
        processed = {};
        processed.h = Math.clamp( ( ( left.h * ( 1 - leftToRightRatio ) ) + ( right.h * leftToRightRatio ) ), 0, 1 );
        processed.s = Math.clamp( ( ( left.s * ( 1 - leftToRightRatio ) ) + ( right.s * leftToRightRatio ) ), 0, 1 );
        processed.v = Math.clamp( ( ( left.v * ( 1 - leftToRightRatio ) ) + ( right.v * leftToRightRatio ) ), 0, 1 );
    }
    return processed;
}

Color.getLoudestColorFor = function ( element, defaultColor )
{
    var color = defaultColor;
    if( typeof(element) === "undefined" || element === null )
        return color;

	var imageElement = $(element).is( "img" ) ? $(element) : $(element).find("img");
    if( imageElement.length > 0 )
    {
        var palette = createPalette( imageElement[0], 25 );
	    var loudest = null;
        for( var i = 0; i < palette.length; i++ )
        {
            if( typeof( palette[ i ] ) === "undefined" || palette[ i ] === null )
                break;

	        if( loudest == null )
	            loudest = palette[ i ];
	        else
	        {
		        var loudestColor = Color.toHsv( loudest.color );
		        var paletteColor = Color.toHsv( palette[ i ].color );
				if( loudest["score"] * loudestColor.s < palette[ i ]["score"] * paletteColor.s )
				{
					loudest = palette[ i ];
				}
	        }
        }

	    if( loudest != null )
		    color = {r: loudest.color[0], g: loudest.color[1], b: loudest.color[2]};
    }

	return color;
};

Color.getBestColorFor = function( element, callback )
{
    var color = Color.toRgb( "#EBEBEB" );
    if( typeof(element) === "undefined" || element === null )
        return color;

	var imageElement = $(element).is( "img" ) ? $(element) : $(element).find("img");
	console.log( imageElement.attr("src") );
    if( imageElement.length > 0 )
    {
        var palette = createPalette( imageElement[0], 7 );
        var hsvColor = null;
        var thisHsvColor = null;
        var dominantColor = null;
        
        var allAchromatic = true;
        
        var bestAchromatic = null;
        var firstChromatic = null;
        for( var i = 0; i < 10; i++ )
        {
            console.log( palette[ i ] );
            if( typeof( palette[ i ] ) === "undefined" || palette[ i ] === null )
                break;
            dominantColor = Color.toRgb( palette[ i ].color );
            console.log( dominantColor );
            if( typeof( dominantColor ) === "undefined" || dominantColor === null )
                break;
            thisHsvColor = Color.toHsv( dominantColor );

            //if( thisHsvColor.s < 0.1 )
            //    thisHsvColor.s = 0.1;
            //thisHsvColor.v = 0.98 * ( 0.5 / thisHsvColor.s );
            //console.log( thisHsvColor );
            
            var isAchromatic = ( thisHsvColor.v === 0 || thisHsvColor.s <= 0.01 );
            
            if( isAchromatic )
            {
                if( bestAchromatic == null )
                    bestAchromatic = thisHsvColor;
                else
                {
                    //bestAchromatic.v = Math.min(  );
                    //achromaticAvg = Math.clamp( (achromaticAvg + thisHsvColor.v) / 2.0, 0, 1 );
                }
                //console.log( "REJECTED: isAchromatic" );
                //console.log( "achromaticAvg: " + achromaticAvg );
                continue;
            }
            
            if( allAchromatic )
            {
                //First chromatic...
                if( firstChromatic === null )
                    firstChromatic = thisHsvColor;
            }
            allAchromatic = false;
            
            var isSimilar = false;
            var red = (dominantColor.r) / 255.0;
            var green = (dominantColor.g) / 255.0;
            var blue = (dominantColor.b) / 255.0;
            var max = Math.max(red, green, blue);
            var min = Math.min(red, green, blue);
            
            var similarity = (max - min);
            isSimilar = ( (max - min) < (firstChromatic ? 0.01 : 0.1) );
            
            if( isSimilar )
            {
                //console.log( "REJECTED: isSimilar" );
                continue;
            }
                
            //console.log( "ACCEPTED: old=" + Color.toRgb( hsvColor ) + ", new=" + thisHsvColor );
            hsvColor = thisHsvColor;
        }
        
        //console.log( "allAchromatic: " + allAchromatic );
            
        if( allAchromatic )
        {
            //hsvColor = { "h":0, "s":0, "v":achromaticAvg };
            hsvColor = bestAchromatic;
            //console.log( hsvColor );
        }
        else if( firstChromatic !== null )
        {
            hsvColor = firstChromatic;
        }
        
        if( hsvColor !== null )
        {
            color = Color.toRgb( hsvColor );
        }
        
        if( hsvColor == null || color == null )
        {
            if( typeof( palette[ i ] ) !== "undefined" && palette[ i ] !== null )
            {
                dominantColor = palette[ i ].color;
                if( typeof( dominantColor ) !== "undefined" && dominantColor !== null )
                    color = Color.toRgb( dominantColor );
            }
        }
        
        if( color == null )
        {
            color = Color.toRgb( getDominantColor( imageElement[ 0 ] ) );
        }
    }
    //console.log( "final color: " + color );
    callback.call( element, color );
}

Color.luminance = function( first, second, third, fourth )
{
    var luminance = 0;
    
    if( typeof(first) === "undefined" )
        first = null;
    if( typeof(second) === "undefined" )
        second = null;
    if( typeof(third) === "undefined" )
        third = null;
    if( typeof(fourth) === "undefined" )
        fourth = null;
        
    if( fourth !== null )
        luminance = fourth;
    else if( third !== null )
        luminance = third;
    else if( second !== null )
        luminance = second;
        
    return Color.process( first, second, third, Color.__private__.rgbToMapLuminance( luminance ) );
};

Color.toRgb = function( first, second, third )
{
    if( typeof(first) === "undefined" )
        first = null;
    if( typeof(second) === "undefined" )
        second = null;
    if( typeof(third) === "undefined" )
        third = null;
    return Color.process( first, second, third, Color.__private__.rgbToMap );
};

Color.toHsv = function( first, second, third )
{
    if( typeof(first) === "undefined" )
        first = null;
    if( typeof(second) === "undefined" )
        second = null;
    if( typeof(third) === "undefined" )
        third = null;
    return Color.process( first, MathProxy.ensureFloat( second ), MathProxy.ensureFloat( third ), Color.__private__.rgbToHsvMap );
};

Color.toHex = function( first, second, third )
{
    if( typeof(first) === "undefined" )
        first = null;
    if( typeof(second) === "undefined" )
        second = null;
    if( typeof(third) === "undefined" )
        third = null;
    return Color.process( first, second, third, Color.__private__.rgbToHex );
}

Color.toCss = function( first, second, third )
{
    if( typeof(first) === "undefined" )
        first = null;
    if( typeof(second) === "undefined" )
        second = null;
    if( typeof(third) === "undefined" )
        third = null;
    return Color.process( first, second, third, Color.__private__.rgbToCss );
}

Color.process = function( first, second, third, processor )
{
    var processed = null;
    
    if( typeof(first) === "undefined" || first === null ||
        typeof(processor) === "undefined" || processor === null )
        return null;
        
    if( typeof(second) !== "undefined" && second !== null &&
        typeof(third) !== "undefined" && third !== null
      )
    {
        r = Color.__private__.processElement( first );
        g = Color.__private__.processElement( second );
        b = Color.__private__.processElement( third );
        
        var numInts = 0;
        var numFloats = 0;
        
        if( Math.isNumeric( r ) )
        {
            numInts += Math.isInteger( r ) ? 1 : 0;
            numFloats += Math.isFloat( r ) ? 1 : 0;
        }

        if( Math.isNumeric( g ) )
        {
            numInts += Math.isInteger( g ) ? 1 : 0;
            numFloats += Math.isFloat( g ) ? 1 : 0;
        }

        if( Math.isNumeric( b ) )
        {
            numInts += Math.isInteger( b ) ? 1 : 0;
            numFloats += Math.isFloat( b ) ? 1 : 0;
        }
        
        if( numInts > 1 && numInts >= numFloats )
            processed = processor( Color.__private__.parseByte( r ), Color.__private__.parseByte( g ), Color.__private__.parseByte( b ) );
        else if( numFloats > 1 )
            processed = processor( Color.__private__.parseByte( r * 255 ), Color.__private__.parseByte( g * 255 ), Color.__private__.parseByte( b * 255 ) );
        else
            processed = processor( r, g, b );
    }
    else if( Math.isString( first ) )
    {
        var processedArray = [];
        var workingString = first;
        var rgbaRegex = /(?:\s*)(?:,?)(?:\s*)(?:rgba?)\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*,?\s*(\d+%?)?\s*\)(?:\s*)(?:,?)(?:\s*)/i;
        var hexRegex = /(?:\s*)(?:,?)(?:\s*)(([a-fA-F0-9]{1})([a-fA-F0-9]{1})([a-fA-F0-9]{1})([a-fA-F0-9]?)([a-fA-F0-9]?)([a-fA-F0-9]?)([a-fA-F0-9]?)([a-fA-F0-9]?))(?:\s*)(?:,?)(?:\s*)/i;
        var regexTests = [ rgbaRegex, hexRegex ];
        var regexFound = [];
        var currentRegex = null;
        var currentFound = null;
        var i;
        var myRegex;
        var myFound;
        do
        {
            regexFound = [];
            
            if( currentRegex && currentFound )
            {
                if( currentFound.length > 0 )
                {
                    if( currentRegex === rgbaRegex )
                    {
                        processed = Color.process( currentFound[1], currentFound[2], currentFound[3], processor );
                    }
                    else if( currentRegex === hexRegex )
                    {
                        currentFound = Color.__private__.hexToRgbMap( currentFound[1] )
                        processed = Color.process( currentFound.r, currentFound.g, currentFound.b, processor );
                    }
                    
                    if( processed !== null )
                    {
                        processedArray.push( processed );
                        processed = null;
                    }
                }
                workingString = workingString.replace( currentRegex, "" );
                currentRegex = null;
                currentFound = null;
            }

            for( i = 0; i < regexTests.length; i++ )
            {
                myRegex = regexTests[ i ];
                myFound = myRegex.exec( workingString );
                
                if( myFound )
                {
                    if( !currentFound ||
                        !currentRegex ||
                         myFound.index < currentFound.index )
                    {
                        currentRegex = myRegex;
                        currentFound = myFound;
                    }
                }
            }
            
        } while( currentRegex && currentFound );
        if( processedArray.length > 0 )
            processed = processor( processedArray );
    }
    else if( Object.prototype.toString.call( first ) === '[object Array]' && first.length >= 3 )
    {
        processed = Color.process( first[0], first[1], first[2], processor );
    }
    else if( Object.prototype.toString.call( first ) === '[object Object]' && "r" in first && "g" in first && "b" in first )
    {
        processed = Color.process( first.r, first.g, first.b, processor );
    }
    else if( Object.prototype.toString.call( first ) === '[object Object]' && "h" in first && "s" in first && "v" in first )
    {
        first = Color.__private__.hsvToRgb( first.h, first.s, first.v );
        processed = Color.process( first.r, first.g, first.b, processor );
    }
    return processed;
}


Color.__private__.hexToRgbMap = function( first, second, third ) {
    if( Object.prototype.toString.call( first ) === '[object Array]' )
    {
        if( first.length > 1 )
            return first;
        else if( first.length == 1 )
            return first[ 0 ];
        else
            return null;
    }
    else
    {
        first = first + "";
        
        if( first.startsWith( "#" ) )
            first = first.substr( 1 );
            
        var r = null;
        var g = null;
        var b = null;
        var tmp;
            
        if( Color.__private__.rgbToHexAllowShorthand === true && first.length == 3 )
        {
            var tmp = first.substr( 0, 1 ) + "";
            r = MathProxy.hexToInteger( tmp.concat( tmp ) );
            tmp = first.substr( 1, 1 ) + "";
            g = MathProxy.hexToInteger( tmp.concat( tmp ) );
            tmp = first.substr( 2, 1 ) + "";
            b = MathProxy.hexToInteger( tmp.concat( tmp ) );
        }
        else if( first.length == 6 )
        {
            var tmp = first.substr( 0, 2 );
            r = MathProxy.hexToInteger( tmp );
            tmp = first.substr( 2, 2 ) + "";
            g = MathProxy.hexToInteger( tmp );
            tmp = first.substr( 4, 2 ) + "";
            b = MathProxy.hexToInteger( tmp );
        }
        else if( first.length == 8 )
        {
            //ignore alpha, 0xFF000000
            var tmp = first.substr( 2, 2 );
            r = MathProxy.hexToInteger( tmp );
            tmp = first.substr( 4, 2 ) + "";
            g = MathProxy.hexToInteger( tmp );
            tmp = first.substr( 6, 2 ) + "";
            b = MathProxy.hexToInteger( tmp );
        }
            
        if( r != null && g != null && b != null )
        {
            return Color.__private__.rgbToMap( r, g, b );
        }
    }
    return null;
}

Color.__private__.rgbToHex = function( r, g, b ) {
    if( Object.prototype.toString.call( r ) === '[object Array]' )
    {
        var first = r;
        if( first.length > 1 )
            return first;
        else if( first.length == 1 )
            return first[ 0 ];
        else
            return null;
    }
    else if( ( Color.__private__.rgbToHexAllowShorthand === true ) &&
             ( r & 0x0F ) === ( ( r & 0xF0 ) >> 4 ) &&
             ( g & 0x0F ) === ( ( g & 0xF0 ) >> 4 ) &&
             ( b & 0x0F ) === ( ( b & 0xF0 ) >> 4 ) )
        return "#" + Math.integerToHex( ( ( r & 0x0F ) << 8 | ( g & 0x0F ) << 4 | ( b & 0x0F ) ), 12 );
    else
        return "#" + Math.integerToHex( ( r << 16 | g << 8 | b ), 24 );
}

Color.__private__.rgbToMap = function( first, second, third ) {
    if( Object.prototype.toString.call( first ) === '[object Array]' )
    {
        if( first.length > 1 )
            return first;
        else if( first.length == 1 )
            return first[ 0 ];
        else
            return null;
    }
    else
        return { "r":Color.__private__.parseByte(first), "g":Color.__private__.parseByte(second), "b":Color.__private__.parseByte(third) };
}

Color.__private__.rgbToMapLuminance = function( luminance ) {
    return function( first, second, third ) {
        luminance = luminance || 0;  
        if( Object.prototype.toString.call( first ) === '[object Array]' )
        {
            if( first.length > 1 )
                return first;
            else if( first.length == 1 )
                return first[ 0 ];
            else
                return null;
        }
        else
            return { "r":Color.__private__.parseByte( Math.clamp( first + (first * luminance), 0, 255 ) ), "g":Color.__private__.parseByte( Math.clamp( second + (second * luminance), 0, 255 ) ), "b":Color.__private__.parseByte( Math.clamp( third + (third * luminance), 0, 255 ) ) };
    }
}

Color.__private__.rgbToHsvMap = function( first, second, third ) {
    if( Object.prototype.toString.call( first ) === '[object Array]' )
    {
        if( first.length > 1 )
            return first;
        else if( first.length == 1 )
            return first[ 0 ];
        else
            return null;
    }
    else
        return Color.__private__.rgbToHsv( first, second, third );
}

Color.__private__.rgbToCss = function( first, second, third ) {
    /*console.log( first + ", " + second + ", " + third );*/
    if( Object.prototype.toString.call( first ) === '[object Array]' )
    {
        var val;
        var str = "";
        for( var i = 0; i < first.length; i++ )
        {
            val = first[ i ];
            if( Math.isString( val ) )
                str += val;
            else if( Object.prototype.toString.call( val ) === '[object Array]' )
                str += Color.__private__.rgbToCss( val[ 0 ], val[ 1 ], val[ 2 ] );
            else if( Object.prototype.toString.call( val ) === '[object Object]' )
                str += Color.__private__.rgbToCss( val.r, val.g, val.b );
            if( str.length > 0 && i < first.length - 1 )
                str += ", ";
        }
        return str;
    }
    else if( typeof( second ) !== "undefined" && second != null &&
             typeof( third ) !== "undefined" && third != null )
    {
        var r = Math.ensureInteger( first );
        var g = Math.ensureInteger( second );
        var b = Math.ensureInteger( third );
        if( r != null && g != null && b != null )
            return "rgb( " + r + ", " + g + ", " + b + " )";
    }
    else
        return null;
}

Color.__private__.rgbToHsv = function(r, g, b){
    if( Object.prototype.toString.call( r ) === '[object Array]' )
    {
        var rgbColor = r;
        if( rgbColor.length >= 3 )
        {
            r = Color.__private__.parseByte( rgbColor[ 0 ] );
            g = Color.__private__.parseByte( rgbColor[ 1 ] );
            b = Color.__private__.parseByte( rgbColor[ 2 ] );
        }
        else
            return null;
    }
    else if( Object.prototype.toString.call( r ) === '[object Object]' )
    {
        var rgbColor = r;
        if( "r" in rgbColor &&
            "g" in rgbColor &&
            "b" in rgbColor )
        {
            r = Color.__private__.parseByte( rgbColor.r );
            g = Color.__private__.parseByte( rgbColor.g );
            b = Color.__private__.parseByte( rgbColor.b );
        }
        else
            return null;
    }
    
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max === min) {
        h = 0; // achromatic
    } else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Color.__private__.parseFloatNormal( h );
    s = Color.__private__.parseFloatNormal( s );
    v = Color.__private__.parseFloatNormal( v );

    return { "h":h, "s":s, "v":v }; //[h, s, v]
}

Color.__private__.hsvToRgb = function(h, s, v){
    if( Object.prototype.toString.call( h ) === '[object Array]' )
    {
        var hsvColor = h;
        if( hsvColor.length >= 3 )
        {
            h = Color.__private__.parseFloatNormal( hsvColor[ 0 ] );
            s = Color.__private__.parseFloatNormal( hsvColor[ 1 ] );
            v = Color.__private__.parseFloatNormal( hsvColor[ 2 ] );
        }
        else
            return null;
    }
    else if( Object.prototype.toString.call( h ) === '[object Object]' )
    {
        var hsvColor = h;
        if( "h" in hsvColor &&
            "s" in hsvColor &&
            "v" in hsvColor )
        {
            h = Color.__private__.parseFloatNormal( hsvColor.h );
            s = Color.__private__.parseFloatNormal( hsvColor.s );
            v = Color.__private__.parseFloatNormal( hsvColor.v );
        }
        else
            return null;
    }

    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    r = Color.__private__.parseByte( r * 255 );
    g = Color.__private__.parseByte( g * 255 );
    b = Color.__private__.parseByte( b * 255 );

    return { "r":r, "g":g, "b":b };
}

Color.__private__.parseByte = function( n ) {
    if( typeof( n ) === "undefined" || n === null )
        return null;
    return Math.ensureInteger( Math.clamp( Math.integerToBase( Math.round( n ), 10, 8 ), 0, 255 ) );
}

Color.__private__.parseFloatNormal = function( n ) {
    if( typeof( n ) === "undefined" || n === null || !Math.isNumeric( n ) )
        return null;
    return Math.ensureFloat( Math.clamp( n, 0, 1 ) );
}

Color.__private__.processElement = function( o ) {
    if( typeof( o ) === "undefined" || o === null )
        return null;
        
    var percent = Math.ensurePercentage( o );
    if( percent !== null )
        return Color.__private__.parseByte( ( percent / 100.0 ) * 255 );
    return o;
}