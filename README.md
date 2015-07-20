# react-backstrap
![Travis Build Status](https://travis-ci.org/moodysalem/react-backstrap.svg?branch=master)

This repository is a group of React components and libraries useful for building single page applications. It builds to a webjar deployed to the central repository as com.leaguekit.react-backstrap, and is meant to be included as a POM dependency of a WAR. See [webjars.org](webjars.org) documentation for information about why this works.

#How to Use
####First, include the dependency in your POM

    <dependency>
        <groupId>com.leaguekit</groupId>
        <artifactId>react-backstrap</artifactId>
        <version>***PROJECT VERSION***</version>
    </dependency>

####Add [Require](requirejs.com) to your page
`<script type="application/javascript" src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.19/require.min.js" data-main="app.js"></script>`
####Configure require in app.js using the provided require configuration
    define([ "rbs/RequireConfig" ], function (config) {
        "use strict";
        require.config(config);
        // now start coding
        require(["backbone", "react", "underscore", "moment"], function () {});
    });
#Demo
You can see this library in action at the developer version of [LeagueKit](https://developer.leaguekit.com). There is not currently a demo site available. Of note are the datepicker and the select dropdowns.

#Structure
This package uses Backbone Models and Collections to communicate with the server.
It uses React for the view layer. Views are broken into several different types (directories):
* Model - These views render a model. They rely on the Model mixin to keep this.state.model in sync with the passed in model property. Provides a function to convert an array of objects to components to represent each attribute.
* Collection - These views render a collection. They rely on the collection mixin. The mixin keeps this.state.collection in sync with this.props.collection.
* Layout - These are your typical react views that don't interact with Backbone in any way. Most of these are Bootstrap related. In almost all cases, theses views can use React.addons.PureRenderMixin. E.g. the alert view represents a bootstrap alert. The icon view lets you insert a fontawesome icon.
* Mixins - React Mixins. Used in the other views and useful in your own views.
* Controls - These views are meant to contain behavioral type code. For example, a loading wrapper can disable or hide children whenever the passed in collections or models are loading.

#rbs/RequireConfig 
This is the file that provides the require configuration that points to all the dependencies for this project and gives you easy access to those libraries. These are the libraries contained in RequireConfig (check the repo for the most up to date version)

**Vendor libraries will always be lowercase and shortcuts to code in the JAR will always be title case to help separate vendor code from rbs code. Currently there are no shortcuts defined in RequireConfig**

* "backbone" - A modified version of Backbone that does not contain the View object and has logic for setting and getting nested attributes (use periods to indicate nesting levels, e.g. my.fake.attribute) as well as logic for server side pagination of collections
* "original-backbone" - Reference to the original backbone package. Do not use this.
* "jquery" - [jQuery](https://jquery.com/)
* "jquery-cookie" - [jQuery-cookie](https://github.com/carhartl/jquery-cookie) for managing cookie data
* "underscore" - [Underscore](underscorejs.org)
* "fb" - [Facebook JavaScript SDK](https://developers.facebook.com/docs/javascript) Note this can be blocked and may not include all the functions when required (Facebook Login is blocked by ghostery for example)
* "jsog" - [JSOG](https://github.com/jsog/jsog)
* "react" - [React](https://facebook.github.io/react/)
* "raf" - Request Animation Frame polyfill (result is set to window.requestAnimationFrame). Modified from [here](https://gist.github.com/paulirish/1579671)
* "moment" - [Momentjs](momentjs.com)
* "ga" - [Google Analytics](https://developers.google.com/analytics/) Note this can be blocked and may be null when required.