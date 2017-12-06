

//test.js
$(function () {
		
	var canvasWidth = 750;
	var canvasHeight = 1000;
	
	var topbarY = 0;
	var bottombarY = 0;
	
	var patientHeight = 180;
	var cpp;  //centimeters Per Pixel
	var deltaLimit = 0.3; //absolute value difference greater than this will become red
	
    var canvas =  new fabric.Canvas('c', { isDrawingMode: true, backgroundColor :"white", selection: false});
	//do not delete this line
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    //add the group for the paths
    var groupPaths = new fabric.Group();
    canvas.add(groupPaths);
    
    var image = new Image();
    image.src = "http://dev.rugcentrumgent.be/wp_dev/alice/userdata/educate_images/Sciatica.jpg";
    //canvas.setDimensions({width:image.width, height:image.height});
    canvas.setDimensions({width:canvasWidth, height:canvasHeight});
    
     $('#btnLoadImage').click(function() {
        canvas.setBackgroundImage(image.src,
        canvas.renderAll.bind(canvas), {
        backgroundImageOpacity: 1,
        backgroundImageStretch: false
        });
            
            
        });
    
     $('#btnToggleGrid').click(function(grid_size) {   
       
     });
        
    canvas.on('path:created', function(e){
    var newPath = e.path;
    groupPaths.add(newPath);
    
    });

    
    $('#btnUndo').click(function() {
        canvas.setActiveGroup(groupPaths);
        var lastItemIndex = (canvas.getObjects().length - 1);
        var item = canvas.item(lastItemIndex);

        if(item.get('type') === 'path') {
            canvas.remove(item);
            canvas.renderAll();
            //canvas.isDrawingMode = true;
            }
        });
    
    
    
    $('#btnClear').click(function() {
        
        canvas.setActiveGroup(groupPaths);
        var objects = canvas.getObjects();
            
        canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
        canvas.discardActiveGroup().renderAll();
        });
    
 
     $('#stop').click(function() {
        //canvas.clear()
        canvas.isDrawingMode = false;
        });
     
     function calcCPP() {
		cpp = patientHeight/(bottombarY-topbarY);
		log('cpp = ' + cpp);
	 }
	 
	 
	 
     function makeCircleAP(left, top, line1, line2, line3, line4,deltaText,hasDeltaText) {
		
        var c = new fabric.Circle({
        left: left,
        top: top,
        strokeWidth: 5,
        radius: 12,
        fill: 'rgba(0,0,0,0)',
        stroke: '#666'
        });
        
        c.hasControls = c.hasBorders = false;
        c.line1 = line1;
        c.line2 = line2;
        c.line3 = line3;
        c.line4 = line4;
		c.deltaText = deltaText;
		c.hasDeltaText = hasDeltaText;
		
		c.on('moving', function() {
	
				c.line1 && c.line1.set({ 'x2': c.left, 'y2': c.top });
				c.line2 && c.line2.set({ 'x1': c.left, 'y1': c.top });	
				c.line3 && c.line3.set({ 'x1': c.left, 'y1': c.top });
				c.line4 && c.line4.set({ 'x1': c.left, 'y1': c.top });
				
				var delta;
	
				
					if (c.hasDeltaText === true) {
						c.deltaText.set({ 'left': c.left + 45, 'top': c.top });
						delta = c.line1.get('y1') - c.line1.get('y2');
					} else {
						delta = c.line2.get('y1') - c.line2.get('y2');	
						
					}
				var text = c.deltaText._objects[0];
				//calculate cm delta from pixels
				calcCPP();
				delta = cpp * delta;
				delta = delta.toFixed(2);
				
				text.setText(delta.toString());
				if (Math.abs(delta) > deltaLimit) {
					text.textBackgroundColor = "red";
				} else {
					text.textBackgroundColor = "green";
				}
				
			
			});
		
		
        return c;

     }
	 
	 
	 
	 
	 
     
     function makeLine(coords,color,strokeWidth,selectable) {
         return new fabric.Line(coords, {
           fill: color,
           stroke: color,
           strokeWidth: strokeWidth,
           selectable: selectable,
		   hasControls : false
         });
     }
	 
	 
	 function makeYMeasureBar(left,top,length) {
		
		
		var lijn = makeLine([ left, top, left+length, top ],'red',2,false);
		
		var text = new fabric.Text((0).toString(),
								{selectable: false,
								 left: lijn.get('x2')+30, 
								 top: lijn.get('y2'),
								 fontSize: 20,
								 backgroundColor : 'green',
								 fill: 'white'
								 });
		

		var rect = new fabric.Rect({width: 100, height: 20, left: lijn.get('x2')+30, top: lijn.get('y2'), fill: 'red'});
		var textGroup = new fabric.Group([text], {selectable: false, left: lijn.get('x2')+45, top: lijn.get('y2')});
		
		canvas.add(textGroup);
		
		var circle1 = makeCircleAP(left,top,null,lijn,null,null,textGroup,false);
		var circle2 = makeCircleAP(left+length,top,lijn,null,null,null,textGroup,true);
		
		canvas.add(lijn);
		canvas.add(circle1);
		canvas.add(circle2);
		
	
		canvas.renderAll();
		
		
	 }
	 
	function makePatientHeightBars() {
		
		 var topbar =  new fabric.Line([0,30,canvasWidth,30], {fill: 'blue',stroke: 'blue',strokeWidth: 3,selectable: true,hasControls : false});
		 topbarY = topbar.get('top'); 
		 topbar.on('modified', function() {
			topbarY = topbar.get('top'); //use top instead of get('y1'), x and y are coords of bounding box.. not of the actual line
			calcCPP();
			log(topbar.get('top'));
			
		 
		});
		 
		var bottombar =  new fabric.Line([0,canvasHeight-30,canvasWidth,canvasHeight-30], {fill: 'blue',stroke: 'blue',strokeWidth: 3,selectable: true,hasControls : false});
		 bottombarY = bottombar.get('top'); 
		 bottombar.on('modified', function() {
			bottombarY = bottombar.get('top');
			calcCPP();
			log(bottombarY);
			
		});
		
		
		
		
		 
		canvas.add(topbar);
		canvas.add(bottombar);
		canvas.renderAll();
		
	}
	
	 
	$('#btnAnalyseAPPA').click(function() {
			makeYMeasureBar(100,100,300);
			makeYMeasureBar(100,300,300);
			makeYMeasureBar(100,450,300);
			makePatientHeightBars();
		

	});
	 
	 
	  $('#btnCalculate').click(function() {
		
		var delta = lijn.get('y1') - lijn.get('y2');
		console.log(delta);
		canvas.add(new fabric.Text('delta', { 
		fontFamily: 'Delicious_500', 
		left: lijn.get('x2')+30, 
		top: lijn.get('y2'),
		selectable: false
		}));  
      });
	  
	  
	  
	 
	 
         var line = makeLine([ 250, 125, 250, 175 ]),
         line2 = makeLine([ 250, 175, 250, 250 ]),
         line3 = makeLine([ 250, 250, 300, 350]),
         line4 = makeLine([ 250, 250, 200, 350]),
         line5 = makeLine([ 250, 175, 175, 225 ]),
         line6 = makeLine([ 250, 175, 325, 225 ]);
		 
         //canvas.add(line, line2, line3, line4, line5, line6);

	
		 
		 
         //canvas.add(
         //makeCircle(line.get('x1'), line.get('y1'), null, line),
         //makeCircle(line.get('x2'), line.get('y2'), line, line2, line5, line6),
         //makeCircle(line2.get('x2'), line2.get('y2'), line2, line3, line4),
         //makeCircle(line3.get('x2'), line3.get('y2'), line3),
         //makeCircle(line4.get('x2'), line4.get('y2'), line4),
         //makeCircle(line5.get('x2'), line5.get('y2'), line5),
         //makeCircle(line6.get('x2'), line6.get('y2'), line6)
         //);

 	canvas.on('object:moving', function (e) {
		var obj = e.target;
		 // if object is too big ignore
		if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
			return;
		}        
		obj.setCoords();        
		// top-left  corner
		if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
			obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
			obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
		}
		// bot-right corner
		if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
			obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
			obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
		}
	});
	   
     
     
				
});