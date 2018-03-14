(function(){

	/*--------------------------------settings------------------------------------------------*/
	ownSet={
		fontFamily:'\'Open Sans\', sans-serif'
	}

	/*------------------------------./settings------------------------------------------------*/




	/*------------------------------functions------------------------------------------------*/

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

/*-------------------------------------------------------------------------------------------*/

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

/*-------------------------------------------------------------------------------------------*/

//svg element gen
	function svgElGen(type, attrSet){

		/*
			example:
			attrSet = { class:"title" , fill:"#ee2200" }
			------------
			types of el: text,  ---> dodatkowo -> wlasciwosc: text ==> content
			line, path, circle

		*/

		if(type === 'text' || type ==='line' || type ==='path' || type === 'circle'){

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
			console.log('incorrect name of svg_el , <g> was created');
			let el= document.createElementNS('http://www.w3.org/2000/svg','g');
			return el;
		}
	}

/*------------------------------------------------------------------------------*/
			////////////////////////////////////////////////////////////////
			///////////////////////////main/////////////////////////////////
			////////////////////////////////////////////////////////////////
/*------------------------------------------------------------------------------*/


	this.MyChart=function(data){
		let whereto = document.querySelector(`#${data.container}`); //container for chart
		let svgMain = mainSvgGen(data.chartSize.width, data.chartSize.height, data.colors.background, data.container); //create main svg

		//configurations
		let myConfiguration = configurator(data);
		console.log(myConfiguration);

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


		//help axes
		function makeHelpLines(){
			//X help-ax
			if(data.helpAxes.X == true){
				let helpAxContainerX = svgElGen('g', { 'id':'pomX' });
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
				let helpAxContainerY = svgElGen('g', { 'id':'pomY' });
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


		//chart title
		let chartTitle = svgElGen('text', {'class':'chart-title', 'x':360, 'y':30, 'fill':'#333', 'font-family': ownSet.fontFamily  , 'text':data.title});
		svgMain.appendChild(chartTitle);


		//axes titles:
		//X:
		let axXTitle = svgElGen('text', {
			'class':'x-title',
			'x':0,
			'y':0,
			'transform':`translate(${(data.chartSize.width)-((data.chartSize.width)*0.55)}  ${data.chartSize.height-5})`,
			'fill':'#333',
			'font-family': ownSet.fontFamily,
			'text':data.nameXval
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
			'text': data.nameYval
		});
		svgMain.appendChild(axYTitle);


		//axes description
		//X:
		let vAX_box = svgElGen('g', { 'id':'valAxX' }); // descrX container
		let zeroVAX = svgElGen('text', {            //zero val
			'x': myConf.svgMargin.left - 3,
			'y': myConf.zeroAxY + 18,
			'fill':'#333',
			'font-family': ownSet.fontFamily,
			'text': '0'
		});
		vAX_box.appendChild(zeroVAX); //add 0 to descrX container

		for(let i = 1; i <= myConf.qtyX; i++){
			let val_X = svgElGen('text', {
				'x': i*myConf.gradAx_X + myConf.svgMargin.left - 8 - (i*0.18),
				'y': myConf.zeroAxY + 18,
				'fill':'#333',
				'font-family': ownSet.fontFamily,
				'text': myConf.gradX*i
			});
			vAX_box.appendChild(val_X); // add every val to container
		}
		svgMain.appendChild(vAX_box);

		//Y:
		let vAY_box = svgElGen('g', { 'id':'valAxY' }); // descrY container
		// let zeroVAY = svgElGen('text', {            //zero val
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
				'text': myConf.gradY*i
			});
			vAX_box.appendChild(val_Y); // add every val to container
		}
		svgMain.appendChild(vAY_box);



		whereto.appendChild(svgMain); // append svg in monitor
	}
	return this.MyChart;
})()//main
