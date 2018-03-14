'use strict';
const MyChart =(function(){

	/*-------------------------------------settings------------------------------------------------*/
	const ownSet={
		fontFamily:'\'Open Sans\', sans-serif',
		fontSize: '12px'
	}



	/*------------------------------helper functions-----------------------------------------------*/

	//configurator
	function configurator(confData){
		const margins = { top:50, bottom:50, left:50, right:20 };
		const halfAx =  (confData.chartSize.width-margins.left)/1.3;
		const maxValX = Math.max.apply(Math,(
			confData.dataValues.map(function(o){return o.x})
		));
		const maxValY = Math.max.apply(Math,(
			confData.dataValues.map(function(o){return o.y})
		));
		const minValX = Math.min.apply(Math,(
			confData.dataValues.map(function(o){return o.x})
		));
		const minValY = Math.min.apply(Math,(
			confData.dataValues.map(function(o){return o.y})
		));
		const dividerX = maxValX/(confData.chartSize.width - (margins.left + margins.right)); //graduation x
		const dividerY = maxValY/(confData.chartSize.height - (margins.top + margins.bottom)); //graduation y
		const gradX = Math.round((maxValX - minValX) / 10); //grad on x values
		const gradAx_X = gradX / dividerX; //grad on x ax
		const qtyX = Math.floor(maxValX/gradX); //quantity x ax
		const gradY = Math.round(maxValY / 10); //grad on y values
		const gradAx_Y = gradY / dividerY; //grad on y ax
		const qtyY = Math.floor(maxValY/gradY); //quantity y ax

		return {
			svgMargin: margins,
			halfAx: halfAx,
			maxValX: maxValX,
			maxValY: maxValY,
			minValX: minValX,
			minValY: minValY,
			dividerX: dividerX,
			dividerY: dividerY,
			zeroAxY: confData.chartSize.height-margins.bottom, //zero axis y
			gradX: gradX,
			gradAx_X: gradAx_X,
			qtyX: qtyX,
			gradY: gradY,
			gradAx_Y: gradAx_Y,
			qtyY: qtyY,
		}
	}

	/*---------------------------------------------------------------------------------------------*/

	//main svg gen
	function mainSvgGen(width, height, color, id){
		let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.setAttribute('width', width);
		svg.setAttribute('height', height);
		svg.setAttribute('id', id);
		svg.setAttribute('viewbox', `0 0 ${width} ${height}`);
		svg.style.backgroundColor = color;
		return svg;
	}

	/*---------------------------------------------------------------------------------------------*/

	//svg element gen
	function svgElGen(type, attrSet){

		/*
			example:
			attrSet = { class:"title" , fill:"#ee2200" }
			------------
			types of el: text,  ---> dodatkowo -> wlasciwosc: text ==> content
			line, path, circle

		*/

		if(type === 'text' || type ==='line' || type ==='path' || type === 'circle'|| type === 'tspan'|| type === 'rect'|| type === 'polygon'){

			let el= document.createElementNS('http://www.w3.org/2000/svg',type)

			if(type == 'text'){
				for(const prop in attrSet){
					if(prop == 'text'){
						let textCont = document.createTextNode( attrSet[prop] );
						el.appendChild(textCont);
					}
					el.setAttribute( prop , attrSet[prop] );
				}
			}

			for(const prop in attrSet){
				el.setAttribute( prop , attrSet[prop] );
			}
			return el;
		}else{
			//console.log('incorrect name of svg_el , <g> was created');
			let el= document.createElementNS('http://www.w3.org/2000/svg','g');
			for(const prop in attrSet){
				el.setAttribute( prop , attrSet[prop] );
			}
			return el;
		}
	}

	/*---------------------------------------------------------------------------------------------*/

	//labelCreator
	function labelcreator(){
		const labBox = svgElGen('g', {'id':'chartLabel', 'style': 'display:block'});

		let poli1 = svgElGen('polygon',{
			'id':'polilabel-1',
			'style':'fill:#eeeeee; stroke:rgb(0,0,0); stroke-width:1'
		});

		let poli2 = svgElGen('polygon',{
			'id':'polilabel-2',
			'style':'fill:#eeeeee'
		});

		let labText = svgElGen('text',{'id':'textLabel', 'font-family': ownSet.fontFamily, 'font-size':ownSet.fontSize});
			let labSpan = svgElGen('tspan',{'text':''});
		labText.appendChild(labSpan);

		let labRect = svgElGen('rect', {
			'id': 'recLabel',
			'height': 30,
			'style':'fill:#eeeeee; stroke:rgb(0,0,0); stroke-width:1; fill-opacity:0.9'
		});

		labBox.appendChild(poli1);
		labBox.appendChild(labRect);
		labBox.appendChild(labText);
		labBox.appendChild(poli2);

		return labBox;
	}
	/*---------------------------------------------------------------------------------------------*/
					/*------------------------------------------------------------------------------*/
								////////////////////////////////////////////////////////////////
								///////////////////////////main/////////////////////////////////
								////////////////////////////////////////////////////////////////
					/*------------------------------------------------------------------------------*/
	/*---------------------------------------------------------------------------------------------*/


	const MyChart=function(data){

		let whereto = document.querySelector(`#${data.container}`); //container for chart
		let svgMain = mainSvgGen(data.chartSize.width, data.chartSize.height, data.colors.background, data.container); //create main svg

		const myConf = configurator(data);
		//console.log(myConf);

		/*---------------------------------------------------------------------------------------------*/

		//main axes
		//X:
		let axisX = svgElGen('line', {
			'x1':myConf.svgMargin.left,
			'x2':data.chartSize.width-myConf.svgMargin.right,
			'y1':data.chartSize.height-myConf.svgMargin.bottom,
			'y2':data.chartSize.height-myConf.svgMargin.bottom,
			'stroke':'#000',
			'stroke-width':1
		});
		svgMain.appendChild(axisX);

		//Y:
		let axisY = svgElGen('line', {
			'x1':myConf.svgMargin.left,
			'x2':myConf.svgMargin.left,
			'y1':myConf.svgMargin.top,
			'y2':data.chartSize.height-myConf.svgMargin.bottom,
			'stroke':'#000',
			'stroke-width':1
		});
		svgMain.appendChild(axisY);

		/*---------------------------------------------------------------------------------------------*/

		//help axes
		function makeHelpLines(){
			//X help-ax
			if(data.helpAxes.X == true){
				const  helpAxContainerX = svgElGen('g', { 'id':'pomX' });
				for(let i = 1; i <= myConf.qtyX; i++ ){
					let subHLX = svgElGen('line',{
						'class': 'pom-x',
						'x1': i * myConf.gradAx_X + myConf.svgMargin.left,
						'x2': i * myConf.gradAx_X + myConf.svgMargin.left,
						'y1': myConf.svgMargin.top,
						'y2': myConf.zeroAxY,
						'stroke': '#666666',
						'stroke-linecap': 'round',
						'stroke-dasharray': '0.2, 3'
					});
					helpAxContainerX.appendChild(subHLX);
				}
				svgMain.appendChild(helpAxContainerX);
			}

			//Y help-ax
			if(data.helpAxes.Y == true){
				const helpAxContainerY = svgElGen('g', { 'id':'pomY' });
				for(let i = 1; i <= myConf.qtyY; i++ ){
					let subHLY = svgElGen('line',{
						'class': 'pom-y',
						'x1': myConf.svgMargin.left,
						'x2': ((myConf.svgMargin.left) + ((data.chartSize.width) - myConf.svgMargin.right-myConf.svgMargin.left)),
						'y1': ((data.chartSize.height - myConf.svgMargin.bottom) - i*myConf.gradAx_Y),
						'y2': ((data.chartSize.height - myConf.svgMargin.bottom) - i*myConf.gradAx_Y),
						'stroke': '#666666',
						'stroke-linecap': 'round',
						'stroke-dasharray': '0.2, 3'
					});
					helpAxContainerY.appendChild(subHLY);
				}
				svgMain.appendChild(helpAxContainerY);
			}
		}
		makeHelpLines();

		/*---------------------------------------------------------------------------------------------*/

		//chart title
		let chartTitle = svgElGen('text', {
			'class':'chart-title',
			'x':data.chartSize.width * 0.4,
			'y':30,
			'fill':'#333',
			'font-family': ownSet.fontFamily,
			'font-weight': 'bold',
			'text':data.title
		});
		svgMain.appendChild(chartTitle);

		/*---------------------------------------------------------------------------------------------*/

		//axes titles:
		//X:
		let axXTitle = svgElGen('text', {
			'class':'x-title',
			'x':0,
			'y':0,
			'transform':`translate(${(data.chartSize.width)-((data.chartSize.width)*0.55)}  ${data.chartSize.height-5})`,
			'fill':'#333',
			'font-family': ownSet.fontFamily,
			'font-size':ownSet.fontSize,
			'text': data.nameXval
		});
		svgMain.appendChild(axXTitle);

		//Y:
		let axYTitle = svgElGen('text', {
			'class': 'chart-title',
			'x': 0,
			'y': 5,
			'transform': `rotate(-90) translate(-${((data.chartSize.height) - ((data.chartSize.height)*0.39))} 12) `,
			'fill':'#333',
			'font-family': ownSet.fontFamily,
			'font-size':ownSet.fontSize,
			'text': data.nameYval
		});
		svgMain.appendChild(axYTitle);

		/*---------------------------------------------------------------------------------------------*/

		//axes description
		//X:
		const vAX_box = svgElGen('g', { 'id':'valAxX' }); // descrX container
		let zeroVAX = svgElGen('text', {            //zero val
			'x': myConf.svgMargin.left - 3,
			'y': myConf.zeroAxY + 18,
			'fill':'#333',
			'font-family': ownSet.fontFamily,
			'font-size':ownSet.fontSize,
			'text': '0'
		});
		vAX_box.appendChild(zeroVAX); //add 0 to descrX container

		for(let i = 1; i <= myConf.qtyX; i++){
			let val_X = svgElGen('text', {
				'x': i*myConf.gradAx_X + myConf.svgMargin.left - 8 - (i*0.18),
				'y': myConf.zeroAxY + 18,
				'fill':'#333',
				'font-family': ownSet.fontFamily,
				'font-size':ownSet.fontSize,
				'text': myConf.gradX*i
			});
			vAX_box.appendChild(val_X); // add every val to container
		}
		svgMain.appendChild(vAX_box);

		//Y:
		const vAY_box = svgElGen('g', { 'id':'valAxY' }); // descrY container
		// let zeroVAY = svgElGen('text', {            //  ?? -- zero val
		// 	'x': myConf.svgMargin.left - 3,
		// 	'y': myConf.zeroAxY + 18,
		// 	'fill':'#333',
		// 	'font-family': ownSet.fontFamily,
		// 	'text': '0'
		// });
		// vAX_box.appendChild(zeroVAX); //add 0 to descrY container

		for(let i = 1; i <= myConf.qtyY; i++){
			let val_Y = svgElGen('text', {
				'x': myConf.svgMargin.left - 20,
				'y': ((data.chartSize.height - myConf.svgMargin.bottom) - i*myConf.gradAx_Y) + 6,
				'fill':'#333',
				'font-family': ownSet.fontFamily,
				'font-size':ownSet.fontSize,
				'text': myConf.gradY*i
			});
			vAX_box.appendChild(val_Y); // add every val to container
		}
		svgMain.appendChild(vAY_box);

		/*---------------------------------------------------------------------------------------------*/

		//draw chart line
		function pathmaker(dataArr){
			return dataArr.slice().reduce(function(totalPath, curr, i){
				let add;
				if(i == 0){ add = '';} else { add = 'L';}
				totalPath += `${add}${(curr.x/myConf.dividerX)+myConf.svgMargin.left}  ${myConf.zeroAxY - (curr.y/myConf.dividerY)}`;
				return totalPath
			},'M');
		}

		let linepoints = pathmaker(data.dataValues);

		let mainLIne = svgElGen('path',{
			'id':'dataLine',
			'd': linepoints,
			'fill': 'none',
			'stroke': data.colors.line,
			'stroke-width': '3'
		});

		svgMain.appendChild(mainLIne);

		/*---------------------------------------------------------------------------------------------*/

		//draw points
		const ptsBox = svgElGen('g', { 'id':'pts-box' });//container for points
		const ptsHelpBox = svgElGen('g', { 'id':'pts-help-box' });//container for help points

		data.dataValues.forEach(function(v, i){
			//main circle
			let pt = svgElGen('circle', {
				'class':'pkt-main',
				'cx': (v.x / myConf.dividerX) +  myConf.svgMargin.left,
				'cy': myConf.zeroAxY - (v.y / myConf.dividerY),
				'r':3,
				'stroke':'black',
				'stroke-width':1,
				'fill':'red'
			});
			ptsBox.appendChild(pt); // add every pt to container

			//circle-helper
			let pt_h = svgElGen('circle', {
				'class':'pkt-help',
				'data-val':i,
				'cx': (v.x / myConf.dividerX) +  myConf.svgMargin.left,
				'cy': myConf.zeroAxY - (v.y / myConf.dividerY),
				'r':7,
				'opacity': 0
			});
			ptsHelpBox.appendChild(pt_h); // add every pt to container
		});
		svgMain.appendChild(ptsBox);
		svgMain.appendChild(ptsHelpBox);

		/*---------------------------------------------------------------------------------------------*/

		svgMain.appendChild(labelcreator()); //create label box

		/*---------------------------------------------------------------------------------------------*/

		whereto.appendChild(svgMain); // append svg in monitor (!) before add event (!)


		/*---------------------------------------------------------------------------------------------*/
		//events
		const pts_HBox = document.querySelector('#pts-help-box');

		pts_HBox.addEventListener('mouseover', function(e){

			const getLabel = document.querySelector('#chartLabel'); // hook to label
			getLabel.style.display = "block";//show label

			let dispV = data.dataValues[e.target.dataset.val]; //get val from data_for_chart
			let dispText = `${data.nameXval} = ${dispV.x},  ${data.nameYval} = ${dispV.y}`; // text to display

			const textNode = document.querySelector('#textLabel'); //hook to text_label
			textNode.textContent = dispText;

			//set parameters of label rectangle
			let labTextLen = textNode.getComputedTextLength();  // width/length  of val_text

			let pcX = e.target.attributes.cx.value*1; //point position
			let pcY = e.target.attributes.cy.value*1; //point position

			// correction of label position if > half Ax X:
 			let posCorr = 0;
			if(pcX > myConf.halfAx){
				posCorr = -labTextLen + 10;
			}

			//set rectangle/label position
			const recLab = document.querySelector('#recLabel'); //hook to rect_label

			//width:
			recLab.setAttribute('width', labTextLen + 20);

			//x-pos
			let newXpos = +pcX - 15 + posCorr;
			recLab.setAttribute('x', newXpos);
			textNode.setAttribute('x', newXpos + 10);

			//y-pos
			var newYpos = +pcY - 45;
			recLab.setAttribute('y', newYpos);
			textNode.setAttribute('y', newYpos + 20);

			//poli - /pointer under rect/
			const polyLab1 = document.querySelector('#polilabel-1');
			const polyLab2 = document.querySelector('#polilabel-2');
			var newPoints1 = `${pcX-5},${pcY-15} ${pcX+5},${pcY-15} ${pcX},${pcY-8}`;
			var newPoints2 = `${pcX-5},${pcY-16} ${pcX+5},${pcY-16} ${pcX},${pcY-9}`;
			polyLab1.setAttribute('points', newPoints1 );
			polyLab2.setAttribute('points', newPoints2 );

		});

		//remove/hide label
		pts_HBox.addEventListener('mouseout', function(e){
			const getLabel = document.querySelector('#chartLabel'); // hook to label
			getLabel.style.display = "none";//hide label
		});

		/*---------------------------------------------------------------------------------------------*/
	}

	return MyChart;

})()//main
