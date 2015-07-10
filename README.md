# react-backstrap
![Travis Build Status](https://travis-ci.org/moodysalem/react-backstrap.svg?branch=master)

This repository is a group of React components and other libraries that I found useful and packaged into a JAR that could be used in the same fashion as a [webjar](webjars.org).

This repo is deployed to maven central repo as com.leaguekit.react-backstrap. Once you've included it, you can bootstrap your application by [requiring](requirejs.com) the RequireConfig provided by this module, and then configuring your require with it. Then, you can use any of the components included in the rbs/components directory to build your React application.

#Structure
This package uses Backbone Models and Collections to communicate with the server.
It uses React for the view layer. Views are broken into several different types:

* Attribute - These views render a single attribute for a model. They all require a model and an attribute. When the attribute changes, the view rerenders, and sometimes the attribute view allows input to the model's attribute.
* Model - These views let you render a model. They do not necessarily re-render on change of a model, though they can in some cases. This layer is almost entirely for convenience. It provides views that can be composed entirely by metadata (e.g. pass a list of attributes and their respective labels components to the form view)
* Collection - These views render a collection. Some views have additional behavior, some views are very generic. All these views take a collection and a model component.
* Layout - These are your typical react views that don't interact with Backbone in any way. Most of these are Bootstrap related. E.g. the alert view gives you a way to quickly craft an alert. The icon view lets you quickly insert a fontawesome icon.
* Mixins - React Mixins. Self-explanatory
* Controls - These views are meant to contain behavioral type code. For example, a loading wrapper can disable or hide children whenever the passed in collections or models are loading.


#rbs/json/RequireConfig 
This is the file that provides the require configuration that points to all the dependencies this project has and gives you easy access to those libraries. These are the libraries contained in RequireConfig (check the repo for the most up to date version)
* "backbone" - A modified version of Backbone that does not contain the View layer and has some special logic for setting and getting nested attributes (use periods to indicate nesting levels, e.g. my.fake.attribute)
* "original-backbone" - if for some reason you want to use the original version of Backbone with this library. Highly recommend against doing so, since the "backbone" dependency modifies the Backbone object in place rather than making a shallow copy.
* "jquery" - $
* "jquery-cookie" - a plugin for managing cookies
* "underscore" - [Underscore](underscorejs.org)
* "fb" - Facebook JavaScript SDK
* "jsog" - A library for parsing jsog, modified from [here](https://github.com/jsog/jsog)
* "react" - [React](https://facebook.github.io/react/)
* "raf" - Request Animation Frame polyfill (result is set to window.requestAnimationFrame)
* "moment" - [Momentjs](momentjs.com)
* "ga" - google analytics