(function(){

	/*------------------------------settings------------------------------------------------*/
	ownSet={
		fontFamily:'\'Open Sans\', sans-serif'
	}

	/*------------------------------settings------------------------------------------------*/




	/*------------------------------functions------------------------------------------------*/
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


	this.MyChart=function(data){
		let whereto = document.querySelector(`#${data.container}`);
		let svgMain = mainSvgGen(data.chartSize.width, data.chartSize.height, data.colors.background, data.container); //create main svg


	/*---------------------------------------test---------------------------------------*/

		//chart title
		let chartTitle = svgElGen('text', {'class':'chart-title', 'x':360, 'y':30, 'fill':'#333', 'font-family': ownSet.fontFamily  , 'text':data.title});
		svgMain.appendChild(chartTitle);

	/*---------------------------------------test---------------------------------------*/

		whereto.appendChild(svgMain); // append svg in monitor
	}

	return this.MyChart;

})()//main
