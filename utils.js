/*
 BSD License

 Copyright (c) 2015, Michal Szczepanski
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 * Neither the name of utils.js nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var utils = (function(utils) {
    /**
     * Logger - static
     */
    (function(Logger){
        /*
        Levels
         */
        Logger.OFF = 0;
        Logger.ERROR = 200;
        Logger.WARN = 300;
        Logger.INFO = 400;
        Logger.DEBUG = 500;
        Logger.LOG = 600;

        Logger.level = Logger.LOG;

        Logger.console = console != null;
        Logger.log = function (msg) {
            if (Logger.level >= Logger.LOG && Logger.console) {
                console.log(msg);
            }
        };
        Logger.debug = function (msg) {
            if (Logger.level >= Logger.DEBUG && Logger.console) {
                console.debug(msg);
            }
        };
        Logger.info = function (msg) {
            if (Logger.level >= Logger.INFO && Logger.console) {
                console.info(msg);
            }
        };
        Logger.warn = function (msg) {
            if (Logger.level >= Logger.WARN && Logger.console) {
                console.warn(msg);
            }
        };
        Logger.error = function (msg) {
            if (Logger.level >= Logger.ERROR && Logger.console) {
                console.error(msg);
            }
        };
        Logger.alert = function (msg) {
            if (Logger.level != 0) {
                alert(msg);
            }
        };
        Logger.div = function(msg) {
            if (Logger.level != 0) {
                var d = document.getElementById("debug");
                if(d) {
                    d.innerHTML += msg+"<br>";
                }
            }
        }
    })(utils.Logger || (utils.Logger = {}));

    /**
     * Observer class inspired by actionscript EventDispatcher
     */
    utils.Observer = (function(){

        Logger = utils.Logger;
        /**
         * Constructor for observer class inspired by actionscript EventDispatcher
         * @param target other observer to target it's events
         * @constructor of utils.Observer
         */
        function Observer(target) {
            if (target) {
                Observer.prototype._target = target;
            } else {
                Observer.prototype._target = this;
            }
            Observer.prototype._data = {};
        };
        /**
         * Adds listener for event of given name
         * @param name - name of event to listen to
         * @param callback - method that will be executed when someones dispatch event
         */
        Observer.prototype.listen = function (name, callback) {
            if (this._target = this) {
                if (this._data[name] == null) {
                    this._data[name] = {};
                }
                this._data[name][callback] = callback;
            } else {
                this._target.listen(name, callback);
            }
            Logger.info(["add:", name, callback]);
        };

        /**
         * Check if we listen given event with callback
         * @param name - name of event to check
         * @param callback - name of callback to check
         * @returns {*}
         */
        Observer.prototype.hasListener = function (name, callback) {
            if (this._target == this) {
                if (this._data[name] == null) {
                    return false;
                }
                Logger.info(["has:", this._data[name][callback]]);
                return this._data[name][callback];
            } else {
                return this._target.hasListener(name, callback);
            }
        };
        /**
         * Removes listener of given event and callback
         * @param name - name of event
         * @param callback - name of callback
         */
        Observer.prototype.removeListener = function (name, callback) {
            if (this._target == this) {
                if (this._data[name] != null) {
                    Logger.info(["remove:", this._data[name][callback]]);
                    delete this._data[name][callback];
                }
            } else {
                this._target.removeListener(name, callback);
            }
            Logger.info(["unsubscribe:", name, callback]);
        };

        /**
         * Removes all listeners of given name of event
         * @param name - name of event
         */
        Observer.prototype.removeTypeAllListeners = function (name) {
            if (this._target == this) {
                if (this._data[name] != null) {
                    delete this._data[name];
                }
            } else {
                this._target.removeTypeAllListeners(name);
            }
        };

        /**
         * Dispatch event of given name with data
         * @param name - name of event
         * @param data - data to pass to callback function
         */
        Observer.prototype.dispatch = function (name, data) {
            if (this._target == this) {
                for (var s in this._data[name]) {
                    Logger.info(["dispatch:", s, name, this._data[name][s]]);
                    this._data[name][s].call(null, data);
                }
            } else {
                this._target.dispatch(name);
            }
        };

        /**
         * Disposes observer - removes all events
         */
        Observer.prototype.dispose = function () {
            if (this._target && this._target != this) {
                this._target.dispose();
            } else {
                for (var s in this._data[type]) {
                    delete this._data[type][s];
                }
                this._data = null;
            }
        };
        return Observer;

    })();

    /**
     * Http request utility
     */
    utils.HTTP = (function() {
        var __xmlhttpfactory = [
            function () {
                return new XMLHttpRequest();
            },
            function () {
                return new ActiveXObject("Msxml2.XMLHTTP");
            },
            function () {
                return new ActiveXObject("Msxml3.XMLHTTP");
            },
            function () {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        ];

        function xmlhttp () {
            var xmlhttp = false;
            var a = __xmlhttpfactory;
            for (var i = 0; i < a.length; i++) {
                try  {
                    xmlhttp = a[i]();
                } catch (e) {
                    continue;
                }
                break;
            }
            return xmlhttp;
        };

        /**
         * Http method that gives you full range of controll over http flow.
         * This include different reactions on http codes
         * utils.HTTP({
                method:'POST',
                url:'/login',
                data:JSON.stringify({username:username, password:password}),
                type:'json'
            }).after(function(data) {
                console.log(data.status);
                if(data.status === 200) {
                } else {
                }
            });
         * @param o -
         * o.method - GET,POST,PUT,DELETE
         * o.data - data to pass
         * o.url = http or https
         * o.type - 'Content-type'
         * o.headers - headers = [{header:'h', value:'v'},...,]
         * o.auth - username, password - basic authentication - auth = {username:'name', password:'pass'}
         * @param success - success callback
         * @param error - error callback
         */
        function HTTP(o) {
            var req = xmlhttp();
            if (!req)
                alert('request create problem');

            var method = o.method ? o.method : "GET";
            o.auth ? req.open(method, o.url, true, o.auth.username, o.auth.password) : req.open(method, o.url, true);

            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            if (o.headers) {
                for (var i = 0; i < o.headers.length; i++) {
                    var h = o.headers[i];
                    req.setRequestHeader(h.header, h.value);
                }
            }

            if (o.type) {
                req.setRequestHeader('Content-type', o.type);
            }

            console.log(o.url);
            req.send(o.data);
            return {'after':function(callback){
                req.onreadystatechange = function () {
                    if (req.readyState != 4) return;
                    if(!callback) return;
                    if (req.status != 200 && req.status != 304) {
                        callback({ status: req.status, data: req.response, text: req.statusText, 'request': req });
                    } else {
                        callback({ status: req.status, data: req.response, text: req.statusText, 'request': req });
                    }
                    req.onreadystatechange = null;
                };
            }}
        }

        return HTTP;
    })();


    (function(html) {
        html.id = function (name) {
            return document.getElementById(name);
        }
    })(utils.html || (utils.html = {}));

    return utils;
})(utils || (utils = {}));