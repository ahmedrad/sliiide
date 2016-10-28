Checkout the demo [here](http://ahmedrad.github.io/sliiide/).

First things first, this plugin is currently in Beta, please feel free to take if for a test ride into the wild and send back any feedback or bugs you might encounter. I created this plugin out of frustration with all the slider jQuery plugins out there that just weren’t doing it for me. Enjoy :)

##What to use this for?
You have a div (probably a nav menu or a side bar) that you want to animate with a sliding effect from outside the viewport to inside the viewport. You want to have complete control over the distance this div slides but you don’t want to worry about how to position it or how to stretch it to match the screen’s dimensions. You also don’t wanna bother with how the animation affects the rest of the page, how to deal with scrolling and the logic behind activating and deactivating the menu.

##Any Dependencies?
The plugin is built on jQuery 2.1.0 but could potentially work with older and newer versions, give it a shot and let me know how it goes if you run into any problems. Otherwise, there’s no CSS file or anything else needed. This plugin manipulates inline styles for the element you're using as a slide menu and some manipulation to the body element. If you're also doing a lot of inline style manipulation you might run into conflicts.

####this plugin officially supports chrome, firefox, safari, IE 10/11 and Edge

##How to use it?
1- Download the sliiide js file (or the minified version) from the github repo, include the js file before the body end tag and make sure jQuery is included before it. Or just use bower "bower install sliiide"

2- you’ll need a div (a nav menu or whatever you have in mind) and set its visibility to hidden. PLEASE MAKE SURE THIS DIV IS A DIRECT CHILD OF THE BODY ELEMENT. You also need a settings object.
```
	var settings = {
      		toggle: "#sliiider-toggle", // the selector for the menu toggle, whatever clickable element you want to activate or deactivate the menu. A click listener will be added to this element.
      		exit_selector: ".slider-exit", // the selector for an exit button in the div if needed, when the exit element is clicked the menu will deactivate, suitable for an exit element inside the nav menu or the side bar
      		animation_duration: "0.5s", //how long it takes to slide the menu
     		place: "left", //where is the menu sliding from, possible options are (left | right | top | bottom)
      		animation_curve: "cubic-bezier(0.54, 0.01, 0.57, 1.03)", //animation curve for the sliding animation
      		body_slide: true, //set it to true if you want to use the effect where the entire page slides and not just the div
     		no_scroll: true, //set to true if you want the scrolling disabled while the menu is active
				auto_close: false //set to true if you want the slider to auto close everytime a child link of it is clicked
    			};

	$(‘#menu’).sliiide(settings); //initialize sliiide
```
3- If you’re going to slide that div horizontally (from the right or left) then you need to style the width of the div yourself and sliiide will stretch the height for you to full window height. If you’re going to slide it vertically (from the top or the bottom) then you need to style the height and sliiide will stretch the width for you. the sliding effect will change to match whatever styling you added to the width (or height) of the element.

4- useful functions available for you:
```
  var menu = $('.left-menu').sliiide({place: 'left', exit_selector: '.some-exit-selector', toggle: '#some-toggle-selector,        no_scroll: true, body_slide: true'});

  menu.activate(); //slides the menu open
  menu.deactivate(); //slides the menu closed
  menu.reset(); //removes all the css that sliiide added to any element
```
That’s it, you now should be good to go, feel free to report back any issues you encounter I’m happy to continue working on this.
