angular-router-advanced
=======================

AngularJS, geri çevrilebilir ve dil destekli URL yönlendirmesini desteklememektedir. Bu da çok dilli AngularJS uygulamaları yazmayı zorlaştırmaktadır. `angular-router-advanced` servisi her view için birden fazla dil destekleyen URL tanımlaması yapma imkanı veren ve bu URL'leri kolayca üreterek HTML içinde kullanmayı sağlayan bir Angular provider'ıdır.

## Kurulum

`angular-router-advanced` servisini kullanabilmek için Github depomuzdaki `router.js` dosyasını HTML dokümanınıza eklemeniz ve Angular modülünüze `sahibinden.router` adıyla bağımlılık olarak bildirmeniz yeterlidir.

```html
<html>
    <head>
        <script src="angular.js"></script>
        <script src="router.js"></script>
    </head>
    ...
```

```js
var app = angular.module('myApp', ['sahibinden.router']);
```

## Kullanım

AngularJS modülünüze config metoduyla aşağıdaki şekilde URL konfigürasyonunuzu girebilirsiniz:

```js
var myApp = angular.module('myApp', ['sahibinden.router'])

.config(function ($routeProvider, $locationProvider, saRouterProvider) {
    'use strict';

    // Url routing icin html5 pushstate kullan
    $locationProvider.html5Mode(true);

    // Url tanimlamalari
    saRouterProvider.when({
            'tr': '/mesajlarim/detay/:id',
            'en': '/messages/detail/:idd'
        }, {
            name: 'my_messages_detail',
            controller: 'MyAccountMessageDetailCtrl',
            templateUrl: '/views/myAccount/messageDetail/MyAccountMessageDetail.html'
        })

        .when({
            'tr': '/mesajlarim',
            'en': '/messages'
        }, {
            name: 'my_messages',
            controller: 'MyAccountMessagesCtrl',
            templateUrl: '/views/myAccount/messages/MyAccountMessages.html'
        })

        .when({
            'tr': '/',
            'en': '/home'
        }, {
            name: 'my_account_home',
            controller: 'MyAccountDashboardCtrl',
            templateUrl: '/views/myAccount/dashboard/MyAccountDashboard.html'
        })

        .otherwise({
            redirectTo : '/'
        })

        .install($routeProvider);

});
```

Burada her bir view için Türkçe ve İngilizce URL tanımlamaları girdik. Bu kurallara göre kullanıcı `/mesajlarim` sayfasına girdiğinde `MyAccountMessages.html` dokümanı `MyAccountMessagesCtrl` adlı controller ile çalıştırılacaktır. Controller içerisinde dil değişkeni `$rootScope`'dan `lang` değeri ile okunabilir:

```js
myApp.controller('MyAccountMessagesCtrl', function ($scope, $rootScope) {
    $scope.welcomeMessage = 'Welcome!';

    if ($rootScope.lang == 'tr') {
        $scope.welcomeMessage = 'Hoşgeldiniz!';
    }
});
```

Sayfalara bağlantı verirken URL'leri elle yazmak yerine `route` adı ile dinamik olarak URL üretmek mümkündür:

```html
<a ng-href="{{ url('my_messages') }}">Mesajlarim</a>
```

Eğer URL konfigürasyonunda dinamik değerler varsa bunlar url fonksiyonuna 2. parametrede nesne olarak gönderilebilir:

```html
<ul>
    <li ng-repeat="message in messages">
        <a ng-href="{{ url('my_messages_detail', { id: message.id }) }}" ng-bind="message.subject"></a>
    </li>
</ul>
```