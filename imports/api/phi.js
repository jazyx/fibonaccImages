/** LX PHI **
*
* This script defines a widget which displays images in a set of
* square frames arranged in a fibonacci spiral. Clicking on one of the
* smaller images displays it in the largest square. Clicking on the
* largest square moves all images to the next smaller square and
* displays a new image in the largest square.
*/

;(function ($, window) {

  $.widget (
    "lx.phi"
    
  , { 
      options: {
        levels:   14
      , ratio:    "phi" // "root2"
      , aspect:   "landscape" // "portrait"
      , start:    "right" // "left" | "top" | "bottom"
      , rotate:   "anti-clockwise" // "clockwise
      , imageURL: "php/phi.php"
      , classes: {
          phi:       "phi"
        , frame:     "frame"
        , landscape: "landscape"
        , portrait:  "portrait"
        , left:      "left"
        , top:       "top"
        , right:     "right"
        , bottom:    "bottom"
        }
      }
      
    , images: [
          "img/Black_MilesDavis.jpg"
        , "img/Black_owl.jpg"
        , "img/Blue_polarBear.jpg"
        , "img/Brown_hyperbolicCrochet.jpg"
        , "img/Green_birdOrator.jpg"
        , "img/Green_rice.jpg"
        , "img/Grey_Daguerre.jpg"
        , "img/Orange_car.jpg"
        , "img/Pink_sweat$.jpg"
        , "img/Purple_storm.jpg"
        , "img/Red_umbrellas.jpg"
        , "img/Teal_pigBird.jpg"
        , "img/White_ZhangDi.jpg"
        , "img/Yellow_giletsjaunes.jpg"
        ] // will be populated by a call to imageURL
    , index: 0 // will be modified by clicking on images
      
    , _create: function phi_create () {
        var self = this
        this._setImages(function () {
          self._modifyDOM.apply(self)
        })     
              
      }
      
    , _setImages: function phi_setImages(callback) {
       /* SOURCE: Sent by _create()
        * INPUT: <callback> should be a pointer to this._modifyDOM
        * ACTION: Calls options.imageURL for data on what images to
        *         show. If the call is successful, populates 
        *         this.images and calls the callback.
        */
				
				// var self = this
				// var ajax = new XMLHttpRequest()

				// ajax.onreadystatechange = function() {
				// 	if (ajax.readyState === 4 && ajax.status === 200) {
				// 		listImages(ajax.responseText)
				// 	}
				// }
				// ajax.open("POST", this.options.imageURL, true);
				// ajax.send()

        // function listImages(jsonString) {
        //   var array
          
        //   try {
        //     array = JSON.parse(jsonString)
        //   } catch (error) {
        //     return console.log(error, jsonString)
        //   }
          
          self.images = [
          "img/Black_MilesDavis.jpg"
        , "img/Black_owl.jpg"
        , "img/Blue_polarBear.jpg"
        , "img/Brown_hyperbolicCrochet.jpg"
        , "img/Green_birdOrator.jpg"
        , "img/Green_rice.jpg"
        , "img/Grey_Daguerre.jpg"
        , "img/Orange_car.jpg"
        , "img/Pink_sweat$.jpg"
        , "img/Purple_storm.jpg"
        , "img/Red_umbrellas.jpg"
        , "img/Teal_pigBird.jpg"
        , "img/White_ZhangDi.jpg"
        , "img/Yellow_giletsjaunes.jpg"
        ] // this.options.images //array
          callback()
        // }
      }
    
    , _modifyDOM: function phi_modifyDOM() {
       /* SOURCE: Called back when the _getImages() function has
        *         retrieved a list of image urls from the server.
        * ACTION: Adds to the parent element a series of nested divs
        *         and imgs with a structure similar to:
        *         <div class='phi portrait left'>
        *           <div class='phi frame'>
        *             <img href="..."></img>
        *           <div class='phi landscape bottom'>
        *             <div class='phi frame'>
        *               <img href="..."></img>
        *             <div class='phi portrait right'>
        *               <div class='phi frame'>
        *                 <img href="..."></img>
        *               <div class='phi landscape top'>
        *                 <div class='phi frame'>
        *                   <img href="..."></img>
        *                 ...
        *               </div>
        *             </div>
        *           </div>
        *         </div>
        *         The alternation of portrait|landscape and left|top|
        *         right|bottom depends on the aspect, start and rotate
        *         options.
        * NOTE:   For this version, aspect, start and rotate options
        *         are ignored.
        */
        
        var $parent   = this.element
        var options   = this.options
        var images    = this.images
        
        var aspects   = ["landscape", "portrait"]
        var positions = ["top", "left", "bottom", "right"]
        var counter   = 0
        
        var total     = options.levels
        var classes   = options.classes
        var phi       = classes.phi
        var frame     = classes.frame
        
        var $square   = $("<div class='" + phi + " " + frame + "'>")
        
        var aspect
        var position
        var src
        var $child
        var self = this

             
        for (var ii=0; ii<total; ii++) {
          aspect   = cycleNextItem(aspects)
          position = cycleNextItem(positions)
          src      = images[ii]
          $child = $("<div class='" + phi  + " "
                                       + classes[aspect] + " "
                                       + classes[position] + "'>")               
                   .append($square.clone()
                           .css({"background-image": "url("+src+")"})
                          )
          $parent.append($child)
          $parent = $child
        }    
        
        function cycleNextItem(array) {
          var item = array.splice(0, 1)[0]
          array.push(item)
          
          return item
        }
        
        this._setUserActions() 
      }
      
    , _setUserActions: function phi_setUserActions() {
        var self = this
        var images = self.images
        var total = images.length
        var folder = document.location + ""
        folder = folder.replace(/index.html/, '')
        var regex = new RegExp(folder)
        
        self.element.on("mouseup", treatClick)
        
        function treatClick(event) {
          var $target = $(event.target)
          var src = $target.css('background-image')
                           .replace(/^url|[\(\)]/g, '')
          
              src = src.replace(regex, '')
          
          var index = self.images.indexOf(src)
          if (index === self.index) {
            if (index) {
            	hiliteImage(index - 1)
            }
          } else if (index < total) {
            hiliteImage(index)
          }
          
					function hiliteImage(index) {
						self.index = index
						var levels = self.options.levels
						var $element = $(self.element.children()[0])
						var $frame
						var src
						var entry
				
						for (var ii=0; ii<levels; ii++) {
							$element = $($element.children()[0])
							
							entry = index + ii
							if (entry < total) {
							} else {
							  entry = entry - total
							}
							src = "url(" + images[entry] + ")"
							result = $element.css("background-image", src)
	
							$element = $element.next()
						}
					}
        }       
      }
    }
  )
  
})(jQuery, window)