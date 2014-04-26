Locationify
=====================

Visualize locations saved on a map (with Google products)
------------------------------------------------------------

see http://54.187.106.130 for a live demo

Scaffolded out with Yeoman

Tech stack:
* Front End: AngularJS(Angular Google Maps module
* Back End: Node.js, ExpressJS 4.0, and MongoDB (Mongoose)

CRUD functions available via RESTful API
* Create new locations (Saves the current coordinates and user defined name)
* Read locations. Both for a single one and all
* Update locations. Can update the assigned name
* Delete locations. Click the X on the image

REST nouns are defined as
* /api/locations
* /api/locations/:id

Make sure to test these things to play with
* Clicking the markers on the map
* Editing location names via the pencil icon
* Deleting locations via the X icon
* All actions are reflected instantaneously in browser
