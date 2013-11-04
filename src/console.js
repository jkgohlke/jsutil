if (!window.console) console = {};
console.log = console.log || function(){};
console.warn = console.warn || function(){};
console.error = console.error || function(){};
console.info = console.info || function(){};

window.alert = window.alert || function( message ){ console.log( "ALERT: " & message ) };