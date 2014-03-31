/**
 * @license Angular Dynamic Constants v1.0.0
 * (c) 2014 Yago Ferrer <yago.ferrer@gmail.com>
 * License: MIT
 */
(function(window, document, angular, undefined) {
    'use strict';

    window.Ngdc = {
        cache: {},
        set: function(json) {

            for (var i in json) {
                if (this.cache[i]) {
                    angular.extend(this.cache[i], json[i]); // If the key exists, merge data.
                } else {
                    this.cache[i] = json[i];
                }
            }

        },

        get: function(key)
        {

            if (key.indexOf(".") >= 0) {
                var parts = key.split(".");

                if (this.cache[parts[0]][parts[1]]) {
                    return this.cache[parts[0]][parts[1]];
                }

                console.warn("%s cannot be found", key);
            } else {

                if (this.cache[key]) {
                    return this.cache[key];
                }

                console.warn("%s cannot be found", key);
            }
        },

        config: function(setup) {

            this.update();

            return this.save(setup);

        },

        save: function(setup)
        {
            setup.app.constant(setup.constant, this.cache);
        },

        update: function() {

            var properties, item, $this = this;

            for (var name in this.cache) {

                properties = this.cache[name];

                for (var value in properties) {

                    item = properties[value];

                    if ( (typeof item === "string") && this.hasVariable(item)) {

                        this.cache[name][value] = item.replace(/\{([A-Za-z0-9_.]+)\}/g, function (m, variable) {

                            return $this.replace(properties, variable);

                        });
                    } else if (Object.prototype.toString.call(item) == '[object Array]') {

                       for (var i in item) {

                           if (this.hasVariable(item[i])) {

                               item[i] = item[i].replace(/\{([A-Za-z0-9_.]+)\}/g, function (m, variable) {

                                   return $this.replace(properties, variable);

                               });

                           }

                       }

                    }
                }
            }

        },

        //@todo: convert this to angular promises
        hasVariable: function(item)
        {
            var find = "\{[A-Za-z0-9_.]+\}";

            var re = new RegExp(find, 'g');

            var result = item.match(re);

            return (result !== null) ? true : false;

        },

        replace: function(properties, value)
        {
            //console.log("replace", properties, value);

            if (value.indexOf(".") >= 0) { //@todo: update to regular expression word.word

                var parts = value.split(".");

                if (this.cache[parts[0]][parts[1]]) {
                    return this.cache[parts[0]][parts[1]];
                }

                console.warn("%s cannot be found", value);
            } else {

                if (properties[value]) {
                    return properties[value];
                } else if (this.cache[value]) {
                    return this.cache[value];
                }

                console.warn("%s cannot be found", key);
            }
        }

    };

}).call(this, window, document, angular, undefined);
