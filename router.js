/**
 * @ngdoc directive
 * @name sahibinden.router:saRouter
 *
 * @description
 *
 * Dil destekli, ters çevrilebilir router kütüphanesi.
 *
 * http://github.com/sahibinden/angular-router-advanced/
 *
 <doc:example>
     <doc:source>
         <script>
            angular.module('app', ['sahibinden.router'])
                .config(function ($routeProvider, saRouter) {
                    'use strict';

                    // Url tanimlamalari
                    saRouter.when('my_messages', {
                            'tr': '/bana-ozel/mesajlarim/detay/:id',
                            'en': '/my-account/messages/detail/:id'
                        }, {
                            controller: 'MyAccountMessageDetailCtrl',
                            templateUrl: '/views/myAccount/messages/MyAccountMessageDetail.html'
                        })

                        .install($routeProvider);

                });
        </script>
        <div>
            <a ng-href="{{ url('my_messages') }}">Mesajlarim</a>
        </div>
     </doc:source>
 </doc:example>
 *
 */

angular
    .module('sahibinden.router', [])
    .provider('saRouter', function () {
        'use strict';

        var lookup = {},
            otherwiseLookup = null;

        this.when = function (key, url, params) {
            var lang, routeParams;

            if (angular.isObject(url)) {
                for (lang in url) {
                    routeParams = angular.extend(params, {
                            lang: lang,
                            routeName: key + '_' + lang
                        });

                    lookup[routeParams.routeName] = {
                        url: url[lang],
                        params: routeParams
                    };
                }
            } else {
                routeParams = angular.extend(params, {
                        routeName: key
                    });

                lookup[key] = {
                    url : url,
                    params : routeParams
                };
            }

            return this;
        };

        this.alias = function (key1, key2) {
            lookup[key1] = lookup[key2];

            return this;
        };

        this.otherwise = function (params) {
            otherwiseLookup = params;

            return this;
        };

        this.install = function ($routeProvider) {
            var route,
                url,
                params,
                key;

            for (key in lookup) {
                route = lookup[key];
                url = route.url;
                params = route.params;

                $routeProvider.when(url, params);
            }

            if (otherwiseLookup) {
                $routeProvider.otherwise(otherwiseLookup);
            }

            return this;
        };

        this.$get = function () {
            return {
                replaceUrlParams : function (url, params) {
                    var k, v;

                    for (k in params) {
                        v = params[k];
                        url = url.replace(':' + k, v);
                    }
                    return url;
                },

                routeDefined : function (key) {
                    return !! this.getRoute(key);
                },

                getRoute : function (key, args) {
                    var langKey = args ? key + '_' + args.lang : key;
                    return lookup[langKey] || lookup[key];
                },

                routePath : function (key, args) {
                    var url = this.getRoute(key, args);
                    url = url ? url.url : null;

                    if (url && args) {
                        url = this.replaceUrlParams(url, args);
                    }

                    return url;
                }
            };
        };
    })

    .run(function ($rootScope, saRouter, $route) {
        'use strict';

        $rootScope.$on('$routeChangeStart', function (previous, current) {
            $rootScope.lang = current.lang;
        });

        // Returns url that has given routeName with optional arguments
        $rootScope.url = function (routeName, args) {
            args = angular.extend({
                    lang: $rootScope.lang
                }, args);

            return saRouter.routePath(routeName, args);
        };

        $rootScope.isActive = function (routeName, current) {
            current = current || $route.current;

            // If current route info not ready, return false
            if (!current) {
                return false;
            }

            // Maybe multiple routeNames be asked
            var routeNames = routeName.split(','),
                routeNameMap = {};

            angular.forEach(routeNames, function (item) {
                // Build a map that has keys as routeNames with current language postfixes if is necessary
                routeNameMap[item + (current.lang ? '_' + current.lang : '')] = true;
            });

            // Check current routeName is in current routename map keys
            return current.routeName in routeNameMap;
        };
    });

