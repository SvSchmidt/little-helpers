/**
 * SimpleGeoLocation takes usage of HTML5 navigator.geolocation API
 * to provide location-based services
 * @author Sven Schmidt
 * @version 18/04/2015
 */
enum SimpleGeoLocationError {
    XHRFAIL = <any>"XHR Request failed",
    NOSUPPORT = <any>"Your browser does not support locating your position!",
    GEOLOCATIONFAIL = <any>"geolocation request failed",
    OTHER = <any>"An unknown error occurred"
}

class SimpleGeoLocation {
    /**
     * Instance variables
     */
    private _positioningResult: any;
    private _geoJSON: any;
    private _geoLocation: any;
    public get cityAndCountry() { return this._geoLocation || "Unknown" }
    private _isUserLocationReady: boolean = false;

    /**
     * constructor for instances of SimpleGeoLocation
     * Checks if there's previously cached data available
     * and takes usage of it (to re-locating use this.locate method)
     */
    constructor() {
        var isGeoJSONCached = 'SimpleGeoLocationGeoJSON' in localStorage;
        var isGeoJSONCacheExpired = isGeoJSONCached && localStorage.getItem('SimpleGeoLocationGeoJSONTimestamp') > (new Date()).valueOf() + 3600;

        if(isGeoJSONCached && !isGeoJSONCacheExpired) {
            this._geoJSON = JSON.parse(localStorage.getItem('SimpleGeoLocationGeoJSON'));
            this._extractGeoJSON();
        }
    }

    /**
     * uses HTML5 geolocation API to request the user's position
     * @param callback: function to call after the location process finished
     * @param errorHandler: function to call in case an error occurred
     */
    public locate = (callback?: Function, errorHandler?: Function) => {
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => this._onGeoLocateSuccess(pos, callback), (errTxt) => this._onGeoLocateFail(SimpleGeoLocationError.GEOLOCATIONFAIL, errTxt, errorHandler));
        } else {
            this._onGeoLocateFail(SimpleGeoLocationError.NOSUPPORT);
        }
    }

    /**
     * called when getCurrentPosition succeeded
     * @param pos Result of getCurrentPosition
     * @param callback Function to call as soon as the result is processed
     */
    private _onGeoLocateSuccess = (pos: any, callback?: Function) => {
        this._positioningResult = pos;

        this._getGeoJSONFromGoogleAPI();

        var xhrCheckInterval = window.setInterval(() => {
            if(this._isUserLocationReady) {
                window.clearInterval(xhrCheckInterval);

                this._extractGeoJSON();
                localStorage.setItem('SimpleGeoLocationGeoJSON', JSON.stringify(this._geoJSON));
                localStorage.setItem('SimpleGeoLocationGeoJSONTimestamp', (new Date()).valueOf() + '');

                if(callback instanceof Function) {
                    callback.call(callback, this._geoJSON);
                }
            }
        },100);
    }

    /**
     * Helper method to extract important/useful values from GeoJSON delivered by Google into instance variables
     */
    private _extractGeoJSON = () => {
        if(this._geoJSON && this._geoJSON.results) {
            this._geoLocation = this._geoJSON.results[2].formatted_address || undefined;
        }
    }

    /**
     * Called in case an error occurred during localization process
     * handles the corresponding errors
     */
    private _onGeoLocateFail = (err: SimpleGeoLocationError, errorText?: any, errorHandler?: Function) => {
        console.error("SimpleGeoLocation Error: " + err, (errorText ? " Additional information: " + errorText : ""));
        
        if(errorHandler instanceof Function) {
            errorHandler.call(errorHandler, err);
        }
    };

    /**
     * Takes usage of the coordinates provided by geolocation API
     * and requests more useful information (e.g. country, city, address) from Google
     * (yes, the old way, without jQuery)
     */
    private _getGeoJSONFromGoogleAPI = () => {
        if ('XMLHttpRequest' in window) {
            // code for modern browsers
            var geoJSONXHR: XMLHttpRequest = new XMLHttpRequest();
        } else {
            // code for ancient browsers (IE 5, 6)
            var geoJSONXHR: XMLHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        geoJSONXHR.onreadystatechange = (response) => {
            if(geoJSONXHR.readyState == 4) {
                if(geoJSONXHR.status == 200) {
                    this._geoJSON = JSON.parse(geoJSONXHR.responseText);
                    this._isUserLocationReady = true;
                } else {
                    this._onGeoLocateFail(SimpleGeoLocationError.XHRFAIL, 'xhrStatus: ' + geoJSONXHR.status + ', xhrResponse: ' + geoJSONXHR.response);
                }
            }
        }

        geoJSONXHR.open("GET", "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + this._positioningResult.coords.latitude + ","+ this._positioningResult.coords.longitude + "&sensor=false", true);
        geoJSONXHR.send();
    }
}
