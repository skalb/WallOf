$.fn.draggableXY = function(options) { 
  var defaultOptions = { 
    distance: 5, 
    dynamic: false 
  }; 
  options = $.extend(defaultOptions, options); 

  this.draggable({ 
    distance: options.distance, 
    start: function (event, ui) { 
      ui.helper.data('draggableXY.originalPosition', ui.position || {top: 0, left: 0}); 
      ui.helper.data('draggableXY.newDrag', true); 
    }, 
    drag: function (event, ui) { 
      var originalPosition = ui.helper.data('draggableXY.originalPosition'); 
      var deltaX = Math.abs(originalPosition.left - ui.position.left); 
      var deltaY = Math.abs(originalPosition.top - ui.position.top); 

      var newDrag = options.dynamic || ui.helper.data('draggableXY.newDrag'); 
      ui.helper.data('draggableXY.newDrag', false); 

      var xMax = newDrag ? Math.max(deltaX, deltaY) === deltaX : ui.helper.data('draggableXY.xMax'); 
      ui.helper.data('draggableXY.xMax', xMax); 

      var newPosition = ui.position; 
      if(xMax) { 
        newPosition.top = originalPosition.top; 
      } 
      if(!xMax){ 
        newPosition.left = originalPosition.left; 
      } 

      return newPosition; 
    } 
  }); 
};