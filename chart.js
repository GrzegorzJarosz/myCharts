
(function(){ //main
   this.Chart= function(){
      drawChart(arguments[0]);
   }//-end-Chart-


   function drawChart(data){

//-----------------------------------------help data---------------------------------------
      //margin for svg
      var marginTopY=50;
      var marginBotY=50;
      var marginLX=50;
      var marginRX=20;

      var tabX= data.dataValues.dataPoints.map(function(o){return o.x;});//array with x values
      var tabY= data.dataValues.dataPoints.map(function(o){return o.y;});//array with y values

      var maxValX = Math.max.apply(Math, tabX);
      var maxValY = Math.max.apply(Math, tabY);

      var dividerX= maxValX/(data.chartSize.width-(marginLX+marginRX));//graduation x
      var dividerY= maxValY/(data.chartSize.height-(marginTopY+marginBotY));//graduation y

      var zeroAxY= data.chartSize.height-marginBotY;//zero axis y

//--------------------------------------------main axes------------------------------------
      function mainAxes(data){
         var axisX="<line x1='"+marginLX+"' x2='"+(data.chartSize.width-marginRX)+"' y1='"+(data.chartSize.height-marginBotY)+"' y2='"+(data.chartSize.height-marginBotY)+"' stroke='#000000' stroke-width='1'/>";
         var axisY="<line x1='"+marginLX+"' x2='"+marginLX+"' y1='"+marginTopY+"' y2='"+(data.chartSize.height-marginBotY)+"' stroke='#000000' stroke-width='1' />";
         return axisX+axisY;
      };

//--------------------------------help lines ----------------------------------------------
      var grad={
         X: function(){
            var a;
            if(maxValX<=10){a=1}
            if(maxValX>10 && maxValX<=20){a=2}
            if(maxValX>20 && maxValX<=100){a=10}
            if(maxValX>100 && maxValX<=1000){a=20}
            if(maxValX>1000 && maxValX<=10000){a=100}
            if(maxValX>10000){a=1000}
            return a ;
         },
         Y: function(){
            var a;
            if(maxValY<=10){a=1}
            if(maxValY>10 && maxValY<=20){a=2}
            if(maxValY>20 && maxValY<=100){a=10}
            if(maxValY>100 && maxValY<=1000){a=20}
            if(maxValY>1000 && maxValY<=10000){a=100}
            if(maxValY>10000){a=1000}
            return a ;
         }
      };

//----------------------------number of help lines-------------------------------------

      var numberOfHelpAx={
         //for X:
         X:function(){
            var a= Math.floor(maxValX/grad.X());
            return a;
         },
         //for Y:
         Y:function(){
           var a= Math.floor(maxValY/grad.Y());
           return a;
         }
      };

//----------------------------draw help axes-----------------------------------------------
      //for X:
      var makeHelpLinesX= function(){
         if (data.helpAxes.X==true){
            var ile=numberOfHelpAx.X();
            var gradAx=grad.X()/dividerX;
            var hL="<g id='pomX'>";
            for(var i=1;i<=ile;i++){
              hL+="<line class='pom-x' x1='"+(i*gradAx+marginLX)+"' x2='"+(i*gradAx+marginLX)+"' y1='"+marginTopY+"' y2='"+zeroAxY+"' stroke='#666666' stroke-linecap='round' stroke-dasharray='0.2, 3'></line>";
            }
            hL+="</g>";
            return hL;
         }
      };
      //for Y:
      var makeHelpLinesY= function(){
         if (data.helpAxes.Y==true){
            var ile=numberOfHelpAx.Y();
            var gradAx=grad.Y()/dividerY;
            var hL="<g id='pomY'>";
            for(var i=1;i<=ile;i++){
              hL+="<line class='pom-y' x1='"+marginLX+"' x2='"+((marginLX)+((data.chartSize.width)-marginRX-marginLX))+"' y1='"+((data.chartSize.height-marginBotY)-i*gradAx)+"' y2='"+((data.chartSize.height-marginBotY)-i*gradAx)+"' stroke='#666666' stroke-linecap='round' stroke-dasharray='0.2, 3'></line>";
            }
            hL+="</g>";
            return hL;
         }
      };

//-------------------------- titles -------------------------------------------------------
      var chartTitle= "<text class='chart-title' x='"+((data.chartSize.width)*0.4)+"' y='30' fill='black'>"+data.title+"</text>";
      var axXTitle= "<text class='x-title' x='0' y='0' fill='black' transform='translate("+((data.chartSize.width)-((data.chartSize.width)*0.55))+" "+((data.chartSize.height)-5)+")'>"+data.nameXval+"</text>";
      var axYTitle= "<text class='y-title' x='0' y='5' fill='black' transform='rotate(-90) translate(-"+((data.chartSize.height)-((data.chartSize.height)*0.39))+" 12)'>"+data.nameYval+"</text>";
      var axesTitles= chartTitle+ axXTitle+ axYTitle;

//----------------------------description of axes------------------------------------------
      //for X:
      var valAxX=function(){
        var ile=numberOfHelpAx.X();
        var gradAx=grad.X()/dividerX;
        var vAX="<g id='valAxX'><text x='"+(marginLX-3)+"' y='"+(zeroAxY+18)+"'>0</text>";

        for(var i=1;i<=ile;i++){
          vAX+="<text x='"+(i*gradAx+marginLX-8-(i*0.18))+"' y='"+(zeroAxY+18)+"'>"+(grad.X()*i)+ "</text>";
        }
        vAX+="</g>";
        return vAX;
      };
      //for Y:
      var valAxY=function(){
        var ile=numberOfHelpAx.Y();
        var gradAx=grad.Y()/dividerY;
        var vAY="<g id='valAxY'><text x='"+(marginLX-3)+"' y='"+(zeroAxY+18)+"'>0</text>";

        for(var i=1;i<=ile;i++){
          vAY+="<text x='"+((marginLX)-18)+"' y='"+(((data.chartSize.height-marginBotY)-i*gradAx)+6)+"'>"+(grad.Y()*i)+ "</text>";
        }
        vAY+="</g>";
        return vAY;
      };

//----------------------------draw points--------------------------------------------------
      var diplayPoints= function(){
         var aa='';
         data.dataValues.dataPoints.forEach(function(value,index){
            a=data.dataValues.dataPoints[index].x;
            b=data.dataValues.dataPoints[index].y;
            aa+="<circle class='pkt' cx='"+((a/dividerX)+marginLX)+"' cy='"+(zeroAxY-(b/dividerY))+"' r='3' stroke='black' stroke-width='1' fill='red' />";
         });
         return aa;
      };

//-------------------------add event for points--------------------------------------------

      var labelDisp= function(){

         var getPkt= document.getElementsByClassName('pkt');
         var getLabelo= document.getElementById('chartLabel');

         function dispVal(i){   //add event for points --> mouseover

           getLabelo.style.display="block";//show label

           var pktCX=getPkt[i].getAttribute('cx');
           var pktCY=getPkt[i].getAttribute('cy');

           var dispText= data.nameXval+"= "+tabX[i]+", "+data.nameYval+"= "+tabY[i];

           var textNode= document.getElementById('textLabel').children[0];
           textNode.textContent=dispText;

           //set parameters of label rectangle
           var rr= textNode.getComputedTextLength();

           //width:
           var newWidth=rr+20;
           document.getElementById('recLabel').setAttribute('width', newWidth);

           //x-pos
           var newXpos=parseFloat(pktCX)-50;
           document.getElementById('recLabel').setAttribute('x', newXpos);
           document.getElementById('textLabel').setAttribute('x', newXpos+10);

           //y-pos
           var newYpos=parseFloat(pktCY)-40;
           document.getElementById('recLabel').setAttribute('y', newYpos);
           document.getElementById('textLabel').setAttribute('y', newYpos+20);
         };

         //mouseover:
         for(var i=0; i<getPkt.length; i++){
           getPkt[i].addEventListener('mouseover', dispVal.bind(null,i),false);
         }

         //mouseout
         for(var i=0; i<getPkt.length; i++){
           getPkt[i].addEventListener('mouseout', function(){getLabelo.style.display="none";});
         }
      }//labelDisp

//---------------------chart line----------------------------------------------------------
      function getLine(){
         var drawDataChain= data.dataValues.dataPoints.map(function(o,index){
             var a, b, c;
             a= (o.x/dividerX)+marginLX;
             b= zeroAxY-(o.y/dividerY);
             if(index==0){c=a+' '+b}else{c='L'+a+' '+b}
             return c;
         });//creating array x,y pairs

         var linePoints='M';//"container" for values  x1 y1 ..xn yn -->line attribute 'points'
         var showDataChain= drawDataChain.forEach(function(value){linePoints+=value+' ';});//data --> to string

         var chartline="<path id='dataLine' fill='none' stroke='"+data.colors.line+"' stroke-width='3' d='"+linePoints+"'/>"

         return chartline;
      };

//-----------------------------draw label rect---------------------------------------------
      var labPosX=60;
      var labPosY=44;
      var recW=10;

      var myText='<text id=\"textLabel\"  x="'+(labPosX+10)+'"  y="'+(labPosY+20)+'" ><tspan></tspan></text>'
      var myRect='<rect id=\"recLabel\" x="'+labPosX+'"  y="'+labPosY+'" width="'+recW+'" height=\"30\" style=\"fill:#eeeeee;fill-opacity:0.9;stroke-width:1;stroke:rgb(0,0,0)\" />';

      var label='<g id=\"chartLabel\">'+myRect+myText+'</g>'

//--------------------final----------------------------------------------------------------

      //draw svg tag
      var svg= document.createElementNS('http://www.w3.org/2000/svg','svg');
      var svgNS=svg.namespaceURI;

      svg.setAttribute('width', data.chartSize.width);
      svg.setAttribute('height', data.chartSize.height);
      svg.setAttribute('id', 'g-chart');
      svg.setAttribute('viewbox','0 0 '+data.chartSize.width+' '+data.chartSize.height+'');
      svg.style.backgroundColor = data.colors.background;

      //draw all:
      svg.innerHTML=mainAxes(data)+makeHelpLinesX()+makeHelpLinesY()+axesTitles+valAxX()+valAxY()+getLine()+diplayPoints()+label;
      //add svg to container
      document.getElementById(data.container).appendChild(svg);

      //display label:
      labelDisp();


   }//drawChart

}()); //main
