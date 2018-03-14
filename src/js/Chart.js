(function(){

	/*------------------------------settings------------------------------------------------*/
	ownSet={
		fontFamily:'\'Open Sans\', sans-serif'
	}

	/*------------------------------settings------------------------------------------------*/




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
		let whereto = document.querySelector(`#${data.container}`);
		let svgMain = mainSvgGen(data.chartSize.width, data.chartSize.height, data.colors.background, data.container); //create main svg


	/*---------------------------------------test---------------------------------------*/

		//some configurations
		let myConfiguration = configurator(data);
		console.log(myConfiguration);

		//chart title
		let chartTitle = svgElGen('text', {'class':'chart-title', 'x':360, 'y':30, 'fill':'#333', 'font-family': ownSet.fontFamily  , 'text':data.title});
		svgMain.appendChild(chartTitle);

	/*---------------------------------------test---------------------------------------*/

		whereto.appendChild(svgMain); // append svg in monitor
	}

	return this.MyChart;

})()//main
