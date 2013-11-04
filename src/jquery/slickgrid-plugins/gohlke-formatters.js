(function ( $ )
{
	// register namespace
	$.extend( true, window, {
		"Slick":{
			"Formatters":{
				"FileSize":FileSizeFormatter,
				"ElapsedTime":ElapsedTimeFormatter,
				"Percentage":PercentageFormatter,
				"DecimalPercentage":DecimalPercentageFormatter,
				"PercentageError":PercentageErrorFormatter,
				"Bit":BooleanFormatter,
				"Boolean":BooleanFormatter,
				"Integer":IntegerFormatter,
				"Decimal":DecimalFormatter,
				"Numeric":NumericFormatter,
				"String":StringFormatter,
				"DateTime":DateFormatter,
				"IsoDateTime":IsoDateFormatter,
				"URL":UrlFormatter,
				"DailyInterval":DailyIntervalFormatter,
				"TimeSinceLastImport":TimeSinceLastImportFormatter
			}
		}
	} );

	function getDefault( columnDef )
	{
		if( typeof( columnDef ) === "undefined" || typeof( columnDef["default"] ) === "undefined" )
			return "-";
		else
			return columnDef["default"];
	}

	function FileSizeFormatter( row, cell, value, columnDef, dataContext )
	{
		var filesize = parseInt( value );
		var text;
		if( value == null || value === "" || isNaN( filesize ) )
		{
			text = getDefault( columnDef );
		}
		else
		{
			text = humanizeFileSize( filesize );
			if( text == null || text == "null" || text == "" )
				text = getDefault( columnDef );
            return "<div style='width: 100%; height: 100%; text-align: right;'>" + text + "</div>";
		}
	}

	function DailyIntervalFormatter( row, cell, value, columnDef, dataContext )
	{
		var elapsed = parseInt( value );
		var text;
		if( value == null || value === "" || isNaN( elapsed ) )
		{
			text = getDefault( columnDef );
		}
		else
		{
			if( elapsed == 0 )
			{
				text = "Sporadic";
			}
			else if( elapsed == 1 )
			{
				text = "Daily";
			}
			else if( elapsed == 7 )
			{
				text = "Weekly";
			}
			else if( elapsed == 14 )
			{
				text = "Biweekly";
			}
			else if( elapsed == 30 )
			{
				text = "Monthly";
			}
			else if( elapsed == 60 )
			{
				text = "Bimonthly";
			}
			else if( elapsed == 182 || elapsed == 183 )
			{
				text = "Semiannually";
			}
			else if( elapsed == 365 )
			{
				text = "Annually";
			}
			else if( elapsed == 730 )
			{
				text = "Biannually";
			}
			else if( elapsed % 30 == 0 )
			{
				if( ( elapsed / 30 ) > 1 )
					text = "Every " + Math.ensureInteger( elapsed / 30 ) + " months";
				else
					text = "Monthly";
			}
			else if( elapsed % 7 == 0 )
			{
				if( ( elapsed / 7 ) > 1 )
					text = "Every " + Math.ensureInteger( elapsed / 7 ) + " weeks";
				else
					text = "Weekly";
			}
			else
			{
				if( elapsed > 1 )
					text = "Every " + Math.ensureInteger( elapsed / 7 ) + " days";
				else
					text = "Daily";
			}
		}
		return "<div style='width: 100%; height: 100%; text-align: left;'>" + text + "</div>";
	}

	function ElapsedTimeFormatter( row, cell, value, columnDef, dataContext )
	{
		var elapsed = parseInt( value );
		var text;
		if( value == null || value === "" || isNaN( elapsed ) )
		{
			text = getDefault( columnDef );
		}
		else
		{
			text = humanizeDurationAbbreviated( elapsed );
			if( text == null || text == "null" || text == "" )
				text = "<1s";
		}
		return "<div style='width: 100%; height: 100%; text-align: right;'>" + text + "</div>";
	}

	function PercentageFormatter( row, cell, value, columnDef, dataContext )
	{
		var percentage = parseInt( value );
		var text;
		if( value == null || value === "" || isNaN( percentage ) )
		{
			text = getDefault( columnDef );
		}
		else
		{
			text = ( Math.ensureInteger( percentage ) + "%" );
		}
		return "<div style='width: 100%; height: 100%; text-align: right;'>" + text + "</div>";
	}

	function DecimalPercentageFormatter( row, cell, value, columnDef, dataContext )
	{
		var percentage = parseFloat( value );
		if( value == null || value === "" || isNaN( percentage ) )
		{
			text = getDefault( columnDef );
		}
		else
		{
			var text = formatDecimal( percentage, 2 ) + "%";
		}
		return "<div style='width: 100%; height: 100%; text-align: right;'>" + text + "</div>";
	}

	function PercentageErrorFormatter( row, cell, value, columnDef, dataContext )
	{
		var percentage = parseFloat( value );
		if( value == null || value === "" || isNaN( percentage ) )
		{
			var text = getDefault( columnDef );
			return "<div style='width: 100%; height: 100%; text-align: right;'>" + text + "</div>";
		}
		else
		{
			var f = (percentage / 100);
			percentage = formatDecimal( percentage, 2 ) + "%";
			var easing = "easeInQuint";
			var bgColor = Color.toCss( 255, Math.ensureInteger( $.interp.calc( easing, 255, 0, f ) ), Math.ensureInteger( $.interp.calc( easing, 255, 0, f ) ) );
			var fgColor = Color.toCss( f > 0.21 ? Color.white : Color.black );
			var boxShadow = "-webkit-box-shadow: 1px 1px 8px " + bgColor + ", -1px -1px 8px " + bgColor + "; -moz-box-shadow: 0 0 3px " + bgColor + ", -1px -1px 8px " + bgColor + "; box-shadow: 0 0 3px " + bgColor + ", -1px -1px 8px " + bgColor + ";";
			return "<div style='width: 100%; height: 100%; text-align: right; " + boxShadow + " background-color: " + bgColor + "; color: " + fgColor + ";'>" + percentage + "</div>";
		}
	}

	function TimeSinceLastImportFormatter( row, cell, value, columnDef, dataContext )
	{
		var subscriptionInterval = Math.ensureInteger( dataContext["SUBSCRIPTION_INTERVAL"] ) * 24;
		var text = "";

		if( typeof( subscriptionInterval ) === "undefined" ||
			subscriptionInterval == null ||
			subscriptionInterval == "" )
			subscriptionInterval = 0;

		var boxShadow = "";
		var bgColor = Color.white;
		var fgColor = Color.black;

		if( value == null || value === "" )
		{
			text = getDefault( columnDef );

			if( dataContext["EFFORT"] == "Onboarding" )
			{
				bgColor = Color.toCss( "#d3d3d3" );
				fgColor = Color.black;
			}
			else
			{
				bgColor = Color.white;
				fgColor = Color.black;
			}

			boxShadow = "-webkit-box-shadow: 1px 1px 8px " + bgColor + ", -1px -1px 8px " + bgColor + "; -moz-box-shadow: 0 0 3px " + bgColor + ", -1px -1px 8px " + bgColor + "; box-shadow: 0 0 3px " + bgColor + ", -1px -1px 8px " + bgColor + ";";
			return "<div style='width: 100%; height: 100%; " + boxShadow + " background-color: " + bgColor + "; color: " + fgColor + ";'>" + text + "</div>";
		}
		else
		{
			value = Math.ensureInteger( value );
			//text = value;
			text = humanizeDurationAbbreviated( value * 60 * 60 );
			if( text == null || text == "null" || text == "" )
				text = "<1s";

			if( dataContext["EFFORT"] == "Onboarding" )
			{
				bgColor = Color.toCss( "#d3d3d3" );
				fgColor = Color.black;
			}
			else if( subscriptionInterval == 0 )
			{
				bgColor = Color.white;
				fgColor = Color.black;
			}
			else if( value < (subscriptionInterval * 1.025) )
			{
				bgColor = Color.toCss( "#b5d09a" );
				fgColor = Color.black;
			}
			else if( value >= (subscriptionInterval * 1.025) && value < ( (subscriptionInterval + 24) * 1.100 )  )
			{
				bgColor = Color.toCss( "#efe4b0" );
				fgColor = Color.black;
			}
			else if( value >= ( ( subscriptionInterval + 24 ) * 1.100 ) )
			{
				bgColor = Color.toCss( "#d99694" );
				fgColor = Color.black;
			}

			boxShadow = "-webkit-box-shadow: 1px 1px 8px " + bgColor + ", -1px -1px 8px " + bgColor + "; -moz-box-shadow: 0 0 3px " + bgColor + ", -1px -1px 8px " + bgColor + "; box-shadow: 0 0 3px " + bgColor + ", -1px -1px 8px " + bgColor + ";";
			return "<div style='width: 100%; height: 100%; " + boxShadow + " background-color: " + bgColor + "; color: " + fgColor + ";'>" + text + "</div>";
		}
	}

	function BooleanFormatter( row, cell, value, columnDef, dataContext )
	{
		value = value.toLowerCase();
		if( value === "true" )
			value = true;
		else if( value === "false" )
			value = false;
		else if( value === "1" )
			value = true;
		else if( value === "0" )
			value = false;
		else if( value === "y" )
			value = true;
		else if( value === "n" )
			value = false;
		else if( value === "yes" )
			value = true;
		else if( value === "no" )
			value = false;
		else
			return getDefault( columnDef );

		return value ? "Yes" : "No";
	}

	function IntegerFormatter( row, cell, value, columnDef, dataContext )
	{
		var integer = parseInt( value );
		var text;
		if( value == null || value === "" || isNaN( integer ) )
		{
			text = getDefault( columnDef );
		}
		else
		{
			text = Math.ensureInteger( integer );
		}
		return "<div style='width: 100%; height: 100%; text-align: right;'>" + text + "</div>";
	}

	function addCommas( nStr )
	{
		nStr += '';
		x = nStr.split( '.' );
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while( rgx.test( x1 ) )
		{
			x1 = x1.replace( rgx, '$1' + ',' + '$2' );
		}
		return x1 + x2;
	}

	function NumericFormatter( row, cell, value, columnDef, dataContext )
	{
		var number = parseFloat( value );
		var text;
		if( value == null || value === "" || isNaN( number ) )
		{
			text = getDefault( columnDef );
		}
		else
		{
			text = addCommas( number );
		}
		return "<div style='width: 100%; height: 100%; text-align: right;'>" + text + "</div>";
	}

	function DecimalFormatter( row, cell, value, columnDef, dataContext )
	{
		var decimal = parseFloat( value );
		var text;
		if( value == null || value === "" || isNaN( decimal ) )
		{
			text = getDefault( columnDef );
		}
		else
		{
			text = formatDecimal( decimal, 2 );
		}

		return "<div style='width: 100%; height: 100%; text-align: right;'>" + text + "</div>";
	}

	function StringFormatter( row, cell, value, columnDef, dataContext )
	{
		if( value == null || value === "" )
		{
			return getDefault( columnDef );
		}
		else
		{
			return value;
		}
	}

	function UrlFormatter( row, cell, value, columnDef, dataContext )
	{
		if( value == null || value === "" )
		{
			return getDefault( columnDef );
		}
		else
		{
			return "<a target='_blank' href='" + value + "'>" + value + "</a>";
		}
	}

	function DateFormatter( row, cell, value, columnDef, dataContext )
	{
		if( value == null || value === "" )
		{
			return getDefault( columnDef );
		}
		else
		{
            return moment( parseInt( value ) ).format( 'YYYY-MM-DD hh:mm:ss a' );
		}
	}

	function IsoDateFormatter( row, cell, value, columnDef, dataContext )
	{
		if( value == null || value === "" )
		{
			return getDefault( columnDef );
		}
		else
		{
            return value;
		}
	}

	function formatDecimal( number, precision )
	{
		var decimal = ( Math.round( number * 100 ) / 100 ).toFixed( precision );
		return ( decimal === 0 ) ? "0.00" : decimal;
	}
})( jQuery );