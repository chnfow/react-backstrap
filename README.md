# react-backstrap
![Travis Build Status](https://travis-ci.org/moodysalem/react-backstrap.svg?branch=master)

This repository is a group of React components and libraries useful for building single page applications. It builds to a webjar deployed to the central repository as com.leaguekit.react-backstrap, and is meant to be included as a POM dependency of a WAR. See [webjars.org](webjars.org) documentation for information about why this works.

Once you've included the dependency in your POM, you can bootstrap your application by [requiring](requirejs.com) the RequireConfig provided by this module, and then configuring your require with it. Note require is not included in this package, although all the included components depend on require.

#Demo

You can see this library in action at the developer version of [LeagueKit](https://developer.leaguekit.com). There is not currently a demo site available. Of note are the datepicker and the select dropdowns.

#Structure
This package uses Backbone Models and Collections to communicate with the server.
It uses React for the view layer. Views are broken into several different types:

* Attribute - These views render a single attribute for a model. They all require a model and an attribute. When the attribute changes, the view rerenders, and sometimes the attribute view allows input to the model's attribute.
* Model - These views let you render a model. They do not necessarily re-render on change of a model, though they can in some cases. This layer is almost entirely for convenience. It provides views that can be composed entirely by metadata (e.g. pass a list of attributes and their respective labels components to the form view)
* Collection - These views render a collection. Some views have additional behavior, some views are very generic. All these views take a collection and a model component.
* Layout - These are your typical react views that don't interact with Backbone in any way. Most of these are Bootstrap related. E.g. the alert view gives you a way to quickly craft an alert. The icon view lets you quickly insert a fontawesome icon.
* Mixins - React Mixins. Self-explanatory
* Controls - These views are meant to contain behavioral type code. For example, a loading wrapper can disable or hide children whenever the passed in collections or models are loading.


#rbs/RequireConfig 
This is the file that provides the require configuration that points to all the dependencies for this project and gives you easy access to those libraries. These are the libraries contained in RequireConfig (check the repo for the most up to date version)

**Vendor libraries will always be lowercase and shortcuts to code in the JAR will always be title case to help separate vendor code from rbs code.**

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