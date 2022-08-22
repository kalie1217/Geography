var geoDropInstruction = new Object();
var geoDrop = new Object();
var categoryArray= new Array();
var categoryName= new Array();
var accordionMenu;

function geoDropLoadXML(){
  var dragTarget;
	var dragTargetX;
	var x_initial_drag=400;
	var y_initial_drag=200;
	var x_initial_dragRight=510;
	var file="xml/co_" + projCode + "_geoDropHTML5.xml";
	// Load XML
	var xmlObj = new load_XML(file);
	// Parse values
	var geoDropObj = xmlObj.tagNameElement("data_xml");
	geoDrop.title= geoDropObj[0].getAttribute('title');

	geoDrop.subtitle= geoDropObj[0].getAttribute('subtitle');
	geoDrop.backgroundImage= geoDropObj[0].getAttribute('backgroundImage');

	var intr = xmlObj.tagNameElement("instructions");
	var content = xmlObj.tagNameElement("content", intr[0]);
	geoDropInstruction.title= intr[0].getAttribute('title');
	geoDropInstruction.content= content[0].firstChild.nodeValue;

	var categoryArr = xmlObj.tagNameElement("category");

	for(var f = 0; f < categoryArr.length; f++) {
	//Retrieve the title of each category
		var categoryOBJ = new Object();
		categoryOBJ.title = categoryArr[f].getAttribute('title');

		var itemArray = xmlObj.tagNameElement("item", categoryArr[f]);
		var items = new Array();
		for (var i = 0; i < itemArray.length; i++) {
			var obj = new Object();

			obj.title = itemArray[i].getAttribute('title');
			obj.x = itemArray[i].getAttribute('X');
			obj.y = itemArray[i].getAttribute('Y');
			obj.dropBox_X= itemArray[i].getAttribute('dropBox_X');
			obj.dropBox_Y = itemArray[i].getAttribute('dropBox_Y');
			obj.overlay = itemArray[i].getAttribute('overlay');
			obj.overlay_X = itemArray[i].getAttribute('overlay_X');
			obj.overlay_Y = itemArray[i].getAttribute('overlay_Y');
			obj.dropBoxWidth = itemArray[i].getAttribute('dropBoxWidth');
			obj.dropBoxHeight = itemArray[i].getAttribute('dropBoxHeight');
			obj.lineDegree = itemArray[i].getAttribute('lineDegree');
			obj.lineWidth = itemArray[i].getAttribute('lineWidth');
			obj.image = itemArray[i].getAttribute('image');
			obj.copyright = itemArray[i].getAttribute('copyright');
      obj.copyMarginRight = itemArray[i].getAttribute('copyMarginRight');
			var itemChilds = itemArray[i].childNodes;
			for (var j=0; j< itemChilds.length; j++) {
				var xmlNode = itemChilds[j];
				switch (xmlNode.nodeName) {
					case 'content':
						obj.content = parseInlineNodes(xmlNode).innerHTML;
						break;
					case 'hint':
						obj.hint = parseInlineNodes(xmlNode).innerHTML;
						break;
				}//end switch
			}//end for
		items[i]=obj;
		var text = obj.title.replace(/[^a-zA-Z 0-9]+/g,'');
		categoryName[text]=obj;
		}//end for
	categoryOBJ.items= items;
  categoryArray[f] = categoryOBJ;
	}//end for
}

function loadGeoDrop_HTML5() {

	//Load XML
	geoDropLoadXML();

	//Main div
	var geoDropHTML5 = ce('div');
	geoDropHTML5.setAttribute('id', "geoDropHTML5");
	document.getElementById('HTML5').appendChild(geoDropHTML5);

	//Map BG
	var box = ce('div');
	box.setAttribute('id', "map");
	var string= "url(\'images/"+ geoDrop.backgroundImage + "\')";
	box.style.backgroundImage = string;
	document.getElementById('geoDropHTML5').appendChild(box);

	//Header
	var geoHeader = ce('div');
	geoHeader.setAttribute('id', "geoHeader");
	geoHeader.innerHTML = "<div class=mainTitle>" + geoDrop.title + " | </div> <div id=geoSubHeader>Geography</div>";
	document.getElementById('geoDropHTML5').appendChild(geoHeader);

	var popUpImage = ce('div');
	popUpImage.id= "popUpImage";
	document.getElementById('geoDropHTML5').appendChild(popUpImage);
	box = ce('div');
	box.setAttribute('id', "geoDropRightMenu");
	document.getElementById('map').appendChild(box);
	box = ce('div');
	box.setAttribute('id', "accordion");
	document.getElementById('geoDropRightMenu').appendChild(box);
	for (i=0; i < categoryArray.length; i++) {
		box = ce('div');
		var category = categoryArray[i].title;
		box.setAttribute('id', category);
		box.className = 'buttonHeader';
		box.innerHTML = category;
		document.getElementById('accordion').appendChild(box);
		box = ce('div');
	  box.setAttribute('id', "buttonHolder"+[i]);
		box.className = 'buttonHolder';
		var headerName = category;
		document.getElementById('accordion').appendChild(box);
		for (j=0; j < categoryArray[i].items.length; j++) {
			var button = ce('div');
			var text = categoryArray[i].items[j].title;
			button.innerHTML = text.replace(/\(/g,"<br/> (");
			text = text.replace(/[^a-zA-Z 0-9]+/g,'');
			button.setAttribute('id', text);
			button.className = 'drag';
			document.getElementById('buttonHolder'+[i]).appendChild(button);
			var imgOverlayID = categoryArray[i].items[j].overlay;
			var imgOverlayLeft = categoryArray[i].items[j].overlay_X;
			var imgOverlayTop = categoryArray[i].items[j].overlay_Y;
			var imgPath = "url(\'images/"+ imgOverlayID + "\')";
			var box = ce('div');
			box.setAttribute('id', text+"_overlay");
			box.className = 'imgOverlay';
			box.style.left=imgOverlayLeft+"px"
			box.style.top=imgOverlayTop+"px"
			box.style.opacity="1"
			box.style.backgroundImage = imgPath;
			document.getElementById('map').appendChild(box);
			box.style.display = "none";
			var dropAreaID = text+"_drop"
			var dropX = categoryArray[i].items[j].dropBox_X;
			var dropY = categoryArray[i].items[j].dropBox_Y;
			var dropW = categoryArray[i].items[j].dropBoxWidth;
			var dropH = categoryArray[i].items[j].dropBoxHeight;
			var circleID = text+"_circle"
			var circleX = categoryArray[i].items[j].x;
			var circleY = categoryArray[i].items[j].y;
			dropAreaID=dropAreaID.replace(/[" "]/g, "_");
			var geoDropOutsideBox = ce('div');
			geoDropOutsideBox.setAttribute('id', text+"_outsideBox");
			geoDropOutsideBox.className = 'geoDropOutsideBox';
			document.getElementById('map').appendChild(geoDropOutsideBox);
			circleID=circleID.replace(/[" "]/g, "_");
			var circleImg = ce('div');
			circleImg.className = 'circleImg';
			circleImg.setAttribute('id', circleID);
			circleImg.style.left=circleX+"px";
			circleImg.style.top=circleY+"px";
			geoDropOutsideBox.appendChild(circleImg);
			var dropArea = ce('div');
			dropArea.setAttribute('id', dropAreaID);
			dropArea.className = 'drop';
			dropArea.style.left=dropX+"px";
			dropArea.style.top=dropY+"px";
			dropArea.style.width=dropW+"px";
			dropArea.style.height=dropH+"px";
			geoDropOutsideBox.appendChild(dropArea);
			jsPlumb.bind("ready", function() {
				jsPlumb.connect({
					source:dropAreaID,
					target:circleID,
					connector:"Straight",
					ConnectorZIndex:2,
					anchor:"AutoDefault",
					endpoint:[ "Dot", { radius:4 } ],
					paintStyle:{ strokeStyle:"white", lineWidth:2  },
				});
			});
			geoDropOutsideBox.style.display = "none";
			$("._jsPlumb_endpoint:even").css("display", "none");
		}
	}
	box = ce('div');
	box.setAttribute('id', "geoDropWelcomeBox");
	document.getElementById('map').appendChild(box);
	box = ce('div');
	box.setAttribute('id', "geoDropHintBox");
	document.getElementById('geoDropHTML5').appendChild(box);
	document.getElementById('geoDropHintBox').style.display="none";
	box = ce('div');
	box.setAttribute('id', "InstrImg");
	document.getElementById('map').appendChild(box);
	document.getElementById('InstrImg').innerHTML='?';

	document.getElementById('InstrImg').onclick=function() {
	   document.getElementById('geoDropWelcomeBox').style.display="block";
	}
  geoDropWelcomeIntr(geoDropInstruction.content)
	$(function() {
		$( "#accordion" ).accordion({
			collapsible: true,
			active: false,
			autoHeight: false,
			header: 'div.buttonHeader'
			});
		$(".buttonHeader").click(function() {
			document.getElementById('geoDropWelcomeBox').style.display="none";
      document.getElementById('geoDropHintBox').style.display="none";
			var name = $( this ).attr( "id" );
			geoSubHeader.innerHTML = name;
			for (i=0; i < categoryArray.length; i++) {
				var title = categoryArray[i].title;
				if(name==title) {
					for (j=0; j < categoryArray[i].items.length; j++) {
						var text= categoryArray[i].items[j].title;
						text = text.replace(/[^a-zA-Z 0-9]+/g,'');
						var showDrop = text+"_outsideBox";
						document.getElementById(showDrop).style.display="block";
					}
				} else {
					for (j=0; j < categoryArray[i].items.length; j++) {
						var text= categoryArray[i].items[j].title
						text = text.replace(/[^a-zA-Z 0-9]+/g,'');
						var hideDrop = text+"_outsideBox";
						document.getElementById(hideDrop).style.display="none";
					}
				}
			}
		});
		$( ".drag" ).draggable({
			revert: true,
			start: function(event, ui) {
				document.getElementById('geoDropWelcomeBox').style.display="none";
				var name = $( this ).attr( "id" );
				document.getElementById('geoDropHintBox').innerHTML="";
		 		document.getElementById('geoDropHintBox').style.display="block";
		 		var string = categoryName[name].hint;
				document.getElementById('geoDropHintBox').innerHTML= string;
			}
		});
		$( ".drag" ).click(function() {
			document.getElementById('geoDropWelcomeBox').style.display="none";
			var name = $( this ).attr( "id" );
			document.getElementById('geoDropHintBox').innerHTML="";
		 	document.getElementById('geoDropHintBox').style.display="block";
		 	var string = categoryName[name].hint;
			document.getElementById('geoDropHintBox').innerHTML= string;
		});
		$( ".drop" ).droppable({
      hoverClass: "targetHover",
			drop: function( event, ui ) {
			document.getElementById('geoDropHintBox').style.display="none";
			var imgID = $(ui.draggable).attr( "id" );
			var dropTargetID= $( this ).attr( "id" );
      dragTargetID = imgID.replace(/[" "]/g, "_");
      dropTargetID = dropTargetID.replace("_drop", "");
			if(dragTargetID==dropTargetID) {
				$(ui.draggable).css('display', 'none');
				$(this).css('height', 'auto');
				$(this).css('background-color', '#2d2d2d');
				$(this).css('border-color:', '#2d2d2d');
				$(this).css('color', '#ffffff'); //if you change color of the drop box text, it will be change.
				$(this).css('padding', '2px 2px 5px 3px'); //DO NOT MODIFY
				$(this).html("<b>"+categoryName[imgID].title.replace(/\(/g,"<br/> (")+"</b>");
        $(this).addClass('clickable');
        $('.clickable').click(function() {
          var name = $( this ).attr( "id" );
          name = name.replace("_drop", "");
          name = name.replace(/["_"]/g, " ");
          var copyright = categoryName[name].copyright;
          var copyMarginRight = categoryName[name].copyMarginRight;
          var imageName = categoryName[name].image;
          var imgLG = "images/" + imageName;
          var string =categoryName[name].title +" - "+categoryName[name].content;
          showPicture(string, imgLG, copyright, copyMarginRight);
        });
				var copyright = categoryName[imgID].copyright;
        var copyMarginRight = categoryName[imgID].copyMarginRight;
				var imageName = categoryName[imgID].image;
				var imgLG = "images/" + imageName;
				var string = categoryName[imgID].title +" | "+categoryName[imgID].content;
				showPicture(string, imgLG, copyright, copyMarginRight);
			}//end if
		}//end drop
    });//end droppable
    $(".drop").mouseenter(function() {
      var name = $( this ).attr( "id" );
      name = name.replace("_drop", "");
      name = name.replace(/["_"]/g, " ");
      var showOverlay = name+"_overlay";
      document.getElementById(showOverlay).style.display = "block";
    });
    $(".drop").mouseleave(function() {
      var name = $( this ).attr( "id" );
      name = name.replace("_drop", "");
      name = name.replace(/["_"]/g, " ");
      var showOverlay = name+"_overlay";
      document.getElementById(showOverlay).style.display = "none";
    });
  });
}

function parseInlineNodes(xmlNode) {
	var inlPart = ce('span');
	for (var i=0; i<xmlNode.childNodes.length; i++) {
		var hPart;
		var xPart = xmlNode.childNodes[i];
		if (xPart.nodeName == '#text') {
			hPart = ce('span');
			hPart.appendChild(ctn(xPart.data));
		} else {
			hPart = ce(xPart.nodeName); //html tags (b, u, i etc.)
			if(xPart.firstChild)
			hPart.appendChild(ctn(xPart.firstChild.data));
		}
    inlPart.appendChild(hPart);
	}
	return inlPart;
}

function ce(name){
	var dn = document.createElement(name);
	return dn;
}
function ctn(from){
	var tn = document.createTextNode(from);
	return tn;
}
function isMobile(){
	var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
  if (mobile)
	  return true;
	else
	  return false;
}

function geoDropWelcomeIntr(content) {
  var string = '<div class="geoDropInstrTitle">Instructions</div><div id="geoDropCloseX" class="close">X</div> <div id="geoDropWelcomeContent">'+content+'</div>';
  document.getElementById('geoDropWelcomeBox').innerHTML=string;
  document.getElementById('geoDropCloseX').onclick= function () {
    document.getElementById('geoDropWelcomeBox').style.display="none";
  }
}

function showPicture(text, url, copyRight, copyMarginRight) {
	document.getElementById('popUpImage').style.display="block";
	document.getElementById('popUpImage').innerHTML="";
	var popUpImage = document.getElementById('popUpImage');
	var popUpTop = ce('div');
	popUpTop.id= "popUpTop";
  popUpImage.appendChild(popUpTop);
  var closer = ce('span');
  closer.id= "closeBtn";
  closer.className = "close";
  closer.innerHTML = 'X';
  closer.onclick = function (event) {
    document.getElementById('popUpImage').style.display="none";  event.stopPropagation();
  };
  popUpImage.appendChild(closer);

	var pictureImage = ce('img');
	pictureImage.id= "pictureImage";
	pictureImage.setAttribute("src", url);
	popUpImage.appendChild(pictureImage);
	var textPopUp = ce('div');
	textPopUp.id= "textPopUp";
	textPopUp.innerHTML=text;
	popUpImage.appendChild(textPopUp);
	var textHeight = document.getElementById('textPopUp').offsetHeight;
	document.getElementById('textPopUp').style.height = textHeight + "px";
	document.getElementById('textPopUp').style.top= (376 - (textHeight +10)) + "px";
	document.getElementById('textPopUp').style.padding= "5px 5px 10px 10px";
	var copyrightDiv = ce('div');
	copyrightDiv.setAttribute('id', "copyrightDiv");
	copyrightDiv.innerHTML=copyRight;
	popUpImage.appendChild(copyrightDiv);
	var copyRightHeight = document.getElementById('copyrightDiv').offsetHeight;
	var copyRightWidth = document.getElementById('copyrightDiv').offsetWidth;
	document.getElementById('copyrightDiv').style.height = copyRightHeight + "px";
	copyrightDiv.style.top = (372 - ((textHeight +12)+copyRightHeight)) + "px";
	if(copyMarginRight){
    copyrightDiv.style.right = copyMarginRight + "px";
  } else {
    copyrightDiv.style.right = "5px";
  }
}
