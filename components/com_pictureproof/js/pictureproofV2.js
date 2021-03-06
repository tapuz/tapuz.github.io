$(function() {
    
    var canvasWidth = 750;
	var canvasHeight = 1000;
	
	var topbarY = 0;
	var bottombarY = 0;
	
	var patientHeight = 180;
	var cpp;  //centimeters Per Pixel
	var deltaLimit = 0.3; //absolute value difference greater than this will become red
    
    var zoomImg;
    
    //minify the main menu
	$('#main-menu-min').click ();
    //lets create 3 canvasses: 1 for the image, 1 for the drawing and 1 for the analysing stuff
    //var newLayer1 = $('<canvas/>',{id: 'imgLayer'}).prop({width: canvasWidth, height: canvasHeight});
    //var newLayer2 = $('<canvas/>',{id: 'drawingLayer'}).prop({width: canvasWidth, height: canvasHeight});
    //var newLayer3 = $('<canvas/>',{id: 'analyseLayer'}).prop({width: canvasWidth, height: canvasHeight});
    //a temp layer for merging other layers into for printing and saving...
    //var tempLayer = $('<canvas/>',{id: 'tempLayer'});
    //append them to the board
    //$('#board').append(tempLayer);
    //$('#board').append(newLayer1);
    //$('#board').append(newLayer2);
    //$('#board').append(newLayer3);
    
    //set the positions
    //$("#board").css({position: 'relative'});
    //$("#tempLayer").css({top: 0, left: 0, position:'absolute'});
    //$("#imgLayer").css({top: 0, left: 0, position:'absolute'});
    //$("#drawingLayer").css({top: 0, left: 0, position:'absolute'});
    //$("#analyseLayer").css({top: 0, left: 0, position:'absolute'});
    
    //Get the anaylse layer
    var canvas =  new fabric.Canvas('c', { isDrawingMode: false, backgroundColor :null, selection: false,allowTouchScrolling: true});
    canvas.setDimensions({width:canvasWidth, height:canvasHeight});
    var zoom = new fabric.Canvas('zoom');
    zoom.setDimensions({width:300,height:300});
    
    //Get the drawing layer
    //var drawingLayer =  new fabric.Canvas('drawingLayer', { isDrawingMode: true, backgroundColor :null, selection: false});
    //disable drawing to start with
    //drawingLayer.isDrawingMode = false;
    canvas.on('path:created', function(e){
        var newPath = e.path;
        groupPaths.add(newPath);
    });

	//do not delete the line below
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    //do not delete the line above
    
    //hide the canvas and portfolio
    $( "#canvas-box" ).toggle();
    $( "#portfolio" ).toggle();
    
    
    //get the camera pictures
    getCameraPictures(); 
    // get the portfolio pictures
    getPortfolioPictures();
    
    
    //START ANALYSE AP-PA//
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
		
        c.on('mousedown', function () {
            var pointer = canvas.getPointer(event.e);
            var posx = pointer.x;
            var posy = pointer.y;
            log('DOWN!!! ' + posx + ' ### ' + posy);
            });
        
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
    
    
    //END ANALYSE AP-PA//
    
    
    $('.img-thumbnail').live('click', function() {
        //var image = new Image();
        //image.src = "http://dev.rugcentrumgent.be/wp_dev/alice/userdata/camera_pictures/1_test_posture_58036ccece8c2.jpg";
        //set zoomImg for us while zooming 
        zoomImg = new Image();
        zoomImg.src = this.src;
        //console.log(this.src);
        
        canvas.setBackgroundImage(this.src, canvas.renderAll.bind(canvas), {
        backgroundImageOpacity: 1,
        backgroundImageStretch: false,
        originX: 'left',
        originY: 'top'
        //top: 500,
        //left: 375
            
        });
        
        //fabric.Image.fromURL(this.src, function(myImg) {
        //    var img1 = myImg.set({ left: 375, top: 500 ,width:canvasWidth,height:canvasHeight});
         //   canvas.add(img1); 
        //});
        
        
       // context = document.getElementById("imgLayer").getContext("2d");
        //context.drawImage(this, 0,0,canvasHeight,this.width * (canvasHeight/this.height));
        //context.drawImage(this, 0,0,canvasWidth,this.height * (canvasWidth/this.width));
        //ctx.drawImage(img, 300, 0, 300, img.height * (300/img.width));
        //console.log('loading the image');
        $( "#canvas-box" ).toggle();
        $( "#thumbnails" ).toggle();
    });

    $('#select-image').click(function() {
        $( "#canvas-box" ).toggle();
        $( "#thumbnails" ).toggle();
        
        clearDrawing();
        clearImage();
        clearTempLayer();
    });
        
    $('.toggleImagesPortfolio').click(function() {
        $( "#images" ).toggle();
        $( "#portfolio" ).toggle();
    });
    
    
    $('#saveToPatientPortfolio').click(function(){
        //merge the layers
       var printLayer = $('#tempLayer')[0];
       var printLayerCtx=printLayer.getContext('2d');
        
       var img = $('#imgLayer')[0];
       var drawing = $('#drawingLayer')[0];
       //set printlayer BG to white
       printLayerCtx.fillStyle = "white";
       printLayerCtx.fillRect(0,0,canvasWidth,canvasHeight);
       
       printLayerCtx.drawImage(img,0,0);
       printLayerCtx.drawImage(drawing,0,0);
       
       var dataURL = $('#tempLayer').get(0).toDataURL("image/jpeg"); //have to get the canvas element from the jquery object
        console.log(patientName);
        $.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'pictureproof', 
  					task: 'saveToPatientPortfolio', 
  					imgBase64: dataURL,
                    patientID: patientID,
                    patientName: patientName,
                    patientDOB: patientDOB}
			}).success(function( response ) {
                    //add the image to the portfolio
                	getPortfolioPictures();
                    console.log('image_added');
					var n = noty({text: 'Saved to Patient Portfolio',type: 'success',layout:'topRight'});  				
			});
        });
    
    $('#print').click(function() {
    	//var clinic_logo = $("#clinic_logo").val();
    	//var header = $("#clinic_letter_heading").val() + "<br><br>";
       //var header = $("#clinic").val() + "<br><br>";
       
       //merge imgLayer and drawingLayer to printLayer so we can print it.
       
       var printLayer = $('#tempLayer')[0];
       var printLayerCtx=printLayer.getContext('2d');
        
       var img = $('#imgLayer')[0];
       var drawing = $('#drawingLayer')[0];
       printLayerCtx.drawImage(img,0,0);
       printLayerCtx.drawImage(drawing,0,0);
       //create an Image element because printThis will not print the Canvas element
       var tempImage = new Image();
           tempImage.id = "tempImage";
           tempImage.height=500;
           //tempImage.width =1100;
           tempImage.src = printLayer.toDataURL();
        $('#board').append(tempImage);
        //print
        var header = $('#clinicHeader').val() + "<H3>Clinician: " + clinician+ "</H3>" + "<H3>Patient: " +patientName+" ("+patientDOB+")</H3>";
    	$('#tempImage').printThis({header: header});
        //delete the tempImage
        tempImage.remove();
        clearTempLayer();
	
    });
    
    $('#clear_drawing').click(function(){
        clearDrawing();
        });
    
    $('#clear_board').click(function(){
        clearDrawing();
        clearImage();
        });

    
    $('#btn_portfolio').click(function(){
        //clearDrawing();
          $( "#canvas-box" ).toggle();
          $( "#thumbnails" ).toggle();
          $( "#portfolio" ).show();
          $( "#images").hide();         
        });
    
    $('#btn_refresh_camera_pictures').click(function(){
        console.log('refreshing');
       getCameraPictures(); 
    });
    
    function clearImage(){
         // Clears the image
        imgLayerCtx = $("#imgLayer")[0].getContext("2d");
        imgLayerCtx.clearRect(0, 0, imgLayerCtx.canvas.width, imgLayerCtx.canvas.height);
        imgLayerCtx.fillStyle = "white";
        imgLayerCtx.fillRect(0,0,canvasWidth,canvasHeight);
    }
    
    function clearDrawing(){
        drawingLayerCtx = $("#drawingLayer")[0].getContext("2d");
        drawingLayerCtx.clearRect(0, 0, drawingLayerCtx.canvas.width, drawingLayerCtx.canvas.height);
        
        clickX = new Array();
        clickY = new Array();
        clickDrag = new Array();
        redraw();
    }
    
    function clearTempLayer(){
        tempLayerCtx = $("#tempLayer")[0].getContext("2d");
        tempLayerCtx.clearRect(0, 0, tempLayerCtx.canvas.width, tempLayerCtx.canvas.height);
    }
    
     function getCameraPictures() {
        console.log(patientID);
        $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'pictureproof',task: 'getCameraPictures', patientID : patientID}
            }).success(function( cameraPictures ) {
               $('#cameraPictures').empty();
		        console.log(cameraPictures);
                $.each(cameraPictures, function(){
                      console.log(this.filename);
                      var div = $('<div>',{class:'col-sm-3 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/camera_pictures/'+ this.filename +'">');
                      $('#cameraPictures').append(div);
                      
	            });
                
		
	        });
       
     }
     
     function getPortfolioPictures() {
        console.log(patientID);
        $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'pictureproof',task: 'getPortfolioPictures', patientID : patientID}
            }).success(function( portfolioPictures ) {
               $('#portfolioPictures').empty();
		        console.log(portfolioPictures);
                $.each(portfolioPictures, function(){
                      
                      var div = $('<div>',{class:'col-sm-3 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/portfolio_images/'+ this.filename +'">');
                      $('#portfolioPictures').append(div);
                      
	            });
                
		
	        });
       
     }
     
    
    
    
    
    
    
    
});







