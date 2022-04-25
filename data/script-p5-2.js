//Globale Variablen deklarieren
var zeit = [], gesamt = [];
var altersgruppe90 = [], altersgruppe80 = [], altersgruppe70 = [],altersgruppe60 = [];
var altersgruppe50 = [], altersgruppe40 = [], altersgruppe30 = [], altersgruppe20 = [];
var altersgruppe10 = [], altersgruppe0 = [], maxT=0;
var animation = false, zusatzInfos=false, zusatzInfos2=false;
const width=1500, height=600;

//parse-Funktion um mit den Daten zu arbeiten (Quelle: www.papaparse.com)
function parseData(ladenVar){
  Papa.parse("data/Altersverteilung1.csv", {
    download: true,
	  complete: function(results) {
    		//console.log("Finished:", results.data);
        ladenVar(results.data);
 	}
 });
}
//Daten in die enstprechenden Daten laden
function ladenVar(data){
  for(let j=2; j<data[0].length; j++)
  {
    zeit.push(data[0][j]);
    altersgruppe90.push(parseFloat(data[2][j]));
      //Zusammenfassen von z.B. 80-85 mit 85-89 zu AG80
    altersgruppe80.push((parseFloat(data[3][j]))+(parseFloat(data[4][j])));
    altersgruppe70.push((parseFloat(data[5][j]))+(parseFloat(data[6][j])));
    altersgruppe60.push((parseFloat(data[7][j]))+(parseFloat(data[8][j])));
    altersgruppe50.push((parseFloat(data[9][j]))+(parseFloat(data[10][j])));
    altersgruppe40.push((parseFloat(data[11][j]))+(parseFloat(data[12][j])));
    altersgruppe30.push((parseFloat(data[13][j]))+(parseFloat(data[14][j])));
    altersgruppe20.push((parseFloat(data[15][j]))+(parseFloat(data[16][j])));
    altersgruppe10.push((parseFloat(data[17][j]))+(parseFloat(data[18][j])));
    altersgruppe0.push((parseFloat(data[19][j]))+(parseFloat(data[20][j])));
  }
  for(let i=0; i<altersgruppe0.length;i++){
    //Gesamtinzidenz selbst ermitteln
      let tmp=altersgruppe0[i]+altersgruppe10[i]+altersgruppe20[i]+altersgruppe30[i]+altersgruppe40[i]+altersgruppe50[i]+altersgruppe60[i]+altersgruppe70[i]+altersgruppe80[i]+altersgruppe90[i];
      gesamt.push(tmp);
  }
  //Bearbeiten der Zeit zur besseren Lesbarkeit
  for(let i=0; i<zeit.length;i++){
    /*zeit[i] hat Form: 2020_W11. Zuerst das Jahr in tmp1 merken, dann die Wochennummer in tmp
      danach KW ganz vorne einfügen, den Unterstrich duch Leerzeichen ersetzen und dann die tmps mit
      Leerzeichen getrennt zusammenfügen*/
      let tmp1;
      tmp1=zeit[i].slice(0,4);
      let tmp;
      tmp=(zeit[i].slice(4));
      tmp="KW".concat("",tmp);
      tmp=tmp.replace("_"," ");
      zeit[i]=tmp.concat(" ", tmp1);
    }
}


function setup(){
  var canvas = createCanvas(width,height);

  //Binden das Canvas an das div mit der ID "canvas"
  canvas.parent("canvas");
  parseData(ladenVar);
  frameRate(0.75);
}
var i=0;  //soll nicht bei jedem Durchlauf von draw() zurückgesetzt werden ->außerhalb definieren

function draw() {
  let durchmesser=height*0.8;  //Durchmesser des Diagramms festlegen

  //Wenn die Animation gewollte ist, soll gezeichnet werden, sonst nicht
  if(animation == true){
    //Zurücksetzen der Zeichenfläche
    fill(220,227,233);
    rect(-1,-1,width+5,height+5);

    //Zeichnen des Diagramms in eigener Funktion
    kreisdiagramm(durchmesser, gesamt[i], altersgruppe0[i], altersgruppe10[i], altersgruppe20[i], altersgruppe30[i], altersgruppe40[i],
        altersgruppe50[i], altersgruppe60[i], altersgruppe70[i], altersgruppe80[i], altersgruppe90[i]);

        if(i>=(gesamt.length-1)){ //i wieder auf 0 zurücksetzen um von vorne zu beginnen
          i=0;
        }
        else i++; //sont hochzählen

    //Zeichnen der Legend auch in eine eigene Funktion ausgelagert
    legende(altersgruppe0[i], altersgruppe10[i], altersgruppe20[i], altersgruppe30[i], altersgruppe40[i],
        altersgruppe50[i], altersgruppe60[i], altersgruppe70[i], altersgruppe80[i], altersgruppe90[i]);

    //Kreis in der Mitte des Diagramms
    fill(220,227,233);
    let durchmesserKlein=(durchmesser/2)*0.6;
    circle(width/2, height/2, durchmesserKlein);

    //Schrift in der Mitte des Diagramms
    fill(0,0,0);
    textSize(20);
    textFont("Helvetica");
    text(zeit[i], (width/2-durchmesserKlein/2)+18, height/2-20);
    if((zusatzInfos == true) || (zusatzInfos2 == true)){ //nur zeichnen wenn gewollt
      textSize(18);
      text("Inzidenzsumme:", (width/2-durchmesserKlein/2)+8, height/2+12);
      text(runden(gesamt[i]), (width/2-durchmesserKlein/2)+40, height/2+32);
      }
      textSize(20);
    //Zeitstrahl zeichnen
    strokeWeight(5);
    stroke(0,0,0);
    line(10,50,10,550);
    triangle(5,550, 15,550, 10,555);
    //insgesamt 500px, 17 Monate (von März 20 bis Mai 21) -> Abstand Monat 27px;
    for(let j=1; j<=17;j++){
      line(5,50+27*j,15,50+27*j)
    }

      //Einzelne Daten zeichnen, außer das aktuelle Monat ist genau dort
      if(i>2){
        noStroke();
        text("März 2020", 25, 50+27*1);
      }
      if(i<38 || i>42){
        noStroke();
        text("Dezember 2020", 25, 50+27*10);
      }
      if(i<68 || i>72){
        noStroke();
        text("Juli 2021", 25, 50+27*17);
      }

      //Zeichnen des aktuellen Monats
      //i fängt bei 0 an, zeit bei KW 11 -> -11
      if((i>=0 && i<=2)){
        //März 3KW
        noStroke();
        fill(255,0,0);
        circle(10,50+27*1, 20);
        text("März 2020", 25, 50+27*1);
      }
      if((i>=3 && i<=7)){
        //April
        noStroke();
        fill(255,0,0);
        circle(10,50+27*2, 20);
        text("April 2020", 25, 50+27*2);
      }
      if((i>=8 && i<=11)){
        //Mai
        noStroke();
        fill(255,0,0);
        circle(10,50+27*3, 20);
        text("Mai 2020", 25, 50+27*3);
      }
      if((i>=12 && i<=15)){
        //Juni
        noStroke();
        fill(255,0,0);
        circle(10,50+27*4, 20);
        text("Juni 2020", 25, 50+27*4);
      }
      if((i>=16 && i<=20)){
        //Juli
        noStroke();
        fill(255,0,0);
        circle(10,50+27*5, 20);
        text("Juli 2020", 25, 50+27*5);
      }
      if(i>=21 && i<=24){
        //August
        noStroke();
        fill(255,0,0);
        circle(10,50+27*6, 20);
        text("August 2020", 25, 50+27*6);
      }
      if(i>=25 && i<=28){
        //September
        noStroke();
        fill(255,0,0);
        circle(10,50+27*7, 20);
        text("September 2020", 25, 50+27*7);
      }
      if(i>=29 && i<=33){
        //Oktober
        noStroke();
        fill(255,0,0);
        circle(10,50+27*8, 20);
        text("Oktober 2020", 25, 50+27*8);
      }
      if(i>=34 && i<=37){
        //November
        noStroke();
        fill(255,0,0);
        circle(10,50+27*9, 20);
        text("November 2020", 25, 50+27*9);
      }
      if(i>=38 && i<=42){
        //Dezember
        noStroke();
        fill(255,0,0);
        circle(10,50+27*10, 20);
        text("Dezember 2020", 25, 50+27*10);
      }
      if(i>=43 && i<=46){
        //Januar
        noStroke();
        fill(255,0,0);
        circle(10,50+27*11, 20);
        text("Januar 2021", 25, 50+27*11);
      }
      if(i>=47 && i<=50){
        //Februar
        noStroke();
        fill(255,0,0);
        circle(10,50+27*12, 20);
        text("Februar 2021", 25, 50+27*12);
      }
      if(i>=51 && i<=54){
        //März
        noStroke();
        fill(255,0,0);
        circle(10,50+27*13, 20);
        text("März 2021", 25, 50+27*13);
      }
      if(i>=55 && i<=59){
        //April
        noStroke();
        fill(255,0,0);
        circle(10,50+27*14, 20);
        text("April 2021", 25, 50+27*14);
      }
      if(i>=60 && i<=63){
        //Mai
        noStroke();
        fill(255,0,0);
        circle(10,50+27*15, 20);
        text("Mai 2021", 25, 50+27*15);
      }
      if(i>=64 && i<=67){
        //Juni
        noStroke();
        fill(255,0,0);
        circle(10,50+27*16, 20);
        text("Juni 2021", 25, 50+27*16);
      }
      if(i>=68 && i<=72){
        //Juli
        noStroke();
        fill(255,0,0);
        circle(10,50+27*17, 20);
        text("Juli 2021", 25, 50+27*17);
      }
      strokeWeight(0);
  }
}

function kreisdiagramm(durchmesser, gesamt, ag0, ag1, ag2, ag3, ag4, ag5, ag6, ag7, ag8, ag9){
  let letzterWinkel = 0;
  let anteil=0;
    //Füllen und erstellen der Kreissegmente
    //Vorbild: https://p5js.org/examples/form-pie-chart.html
    noStroke();
    textSize(20);

    fill(112,112,112);
    anteil=(ag0*360/gesamt);  //Anteil am ganzen Kreis berechnen
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE); //Kreissegment zeichnen
    if(zusatzInfos == true){  //Zahlen am Rand zeichnen
      push();
        translate(width/2,height/2);
        let x=(cos(radians(anteil)/2)*(durchmesser/2));
        let y=sin(radians(anteil)/2)*(durchmesser/2)+20;
        let tmp=(ag0*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }


    fill(254,125,25);
    letzterWinkel=letzterWinkel+radians(anteil);  //letzten Winkel merken und von da an das nächste Segment zeichnen
    anteil=(ag1*360/gesamt);
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE);
    if(zusatzInfos == true){
      push();
        textAlign(LEFT);//Zurücksetzen
        translate(width/2,height/2);
        let x, y;
        x=cos(letzterWinkel+radians(anteil)/2)*(durchmesser/2);
        y=sin(letzterWinkel+radians(anteil)/2)*(durchmesser/2)+20;
        if(letzterWinkel+radians(anteil)>(PI/2)){ textAlign(RIGHT); y+=20;} //Sobald der Winkel über 90° geht, soll der Text rechtsbündig sein
        let tmp=(ag1*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }



    fill(17,20,92);
    letzterWinkel=letzterWinkel+radians(anteil);
    anteil=(ag2*360/gesamt);
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE);
    if(zusatzInfos == true){
      push();
        textAlign(LEFT);
        translate(width/2,height/2);
        let x, y;
        x=cos(letzterWinkel+radians(anteil)/2)*(durchmesser/2);
        y=sin(letzterWinkel+radians(anteil)/2)*(durchmesser/2)+20;
        if(letzterWinkel+radians(anteil)>PI) y=y-30;
        if(letzterWinkel+radians(anteil)>(PI/2)){ textAlign(RIGHT); x-=20;}
        if((letzterWinkel+radians(anteil)< 2) && (letzterWinkel+radians(anteil)>1)) y=y+20;
        let tmp=(ag2*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }

    fill(240,2,127);
    letzterWinkel=letzterWinkel+radians(anteil);
    anteil=(ag3*360/gesamt);
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE);
    if(zusatzInfos == true){
      push();
        textAlign(LEFT);
        translate(width/2,height/2);
        let x, y;
        x=cos(letzterWinkel+radians(anteil)/2)*(durchmesser/2);
        y=sin(letzterWinkel+radians(anteil)/2)*(durchmesser/2)+20;
        if(letzterWinkel+radians(anteil)>PI) y=y-30;
        if(letzterWinkel+radians(anteil)>(PI/2)) { textAlign(RIGHT); x-=20;}
        if((letzterWinkel+radians(anteil)< 2) && (letzterWinkel+radians(anteil)>1)) y=y+20;
        let tmp=(ag3*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }



    fill(255,181,0);
    letzterWinkel=letzterWinkel+radians(anteil);
    anteil=(ag4*360/gesamt);
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE);
    if(zusatzInfos == true){
      push();
        textAlign(LEFT);
        translate(width/2,height/2);
        let x, y;
        x=cos(letzterWinkel+radians(anteil)/2)*(durchmesser/2);
        y=sin(letzterWinkel+radians(anteil)/2)*(durchmesser/2)+20;
        if(letzterWinkel+radians(anteil)>PI) y=y-30;
        if((letzterWinkel+radians(anteil)>(PI/2)) && (letzterWinkel+radians(anteil)<(PI*(3/2)))) { textAlign(RIGHT); x-=10;}
        if(letzterWinkel+radians(anteil)>(PI*(3/2))) y-=10;
        let tmp=(ag4*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }



    fill(100,16,131);
    letzterWinkel=letzterWinkel+radians(anteil);
    anteil=(ag5*360/gesamt);
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE);
    if(zusatzInfos == true){
      push();
        textAlign(LEFT);
        translate(width/2,height/2);
        let x, y;
        x=cos(letzterWinkel+radians(anteil)/2)*(durchmesser/2);
        y=sin(letzterWinkel+radians(anteil)/2)*(durchmesser/2)+20;
        if(letzterWinkel+radians(anteil)>PI) y=y-30;
        if((letzterWinkel+radians(anteil)>(PI/2)) && (letzterWinkel+radians(anteil)<(PI*(3/2)))) { textAlign(RIGHT); x-=10;}
        if(letzterWinkel+radians(anteil)>(PI*(3/2))) y-=10;
        let tmp=(ag5*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }



    fill(253,24,19);
    letzterWinkel=letzterWinkel+radians(anteil);
    anteil=(ag6*360/gesamt);
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE);
    if(zusatzInfos == true){
      push();
        textAlign(LEFT);
        translate(width/2,height/2);
        let x, y;
        x=cos(letzterWinkel+radians(anteil)/2)*(durchmesser/2);
        y=sin(letzterWinkel+radians(anteil)/2)*(durchmesser/2)+20;
        if(letzterWinkel+radians(anteil)>PI) y=y-30;
        if((letzterWinkel+radians(anteil)>(PI/2)) && (letzterWinkel+radians(anteil)<(PI*(3/2)))) { textAlign(RIGHT); x-=10;}
        if(letzterWinkel+radians(anteil)>(PI*(3/2))) y-=10;
        let tmp=(ag6*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }


    fill(0,160,198);
    letzterWinkel=letzterWinkel+radians(anteil);
    anteil=(ag7*360/gesamt);
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE);
    if(zusatzInfos == true){
      push();
        textAlign(LEFT);
        translate(width/2,height/2);
        let x, y;
        x=cos(letzterWinkel+radians(anteil)/2)*(durchmesser/2);
        y=sin(letzterWinkel+radians(anteil)/2)*(durchmesser/2)+20;
        if(letzterWinkel+radians(anteil)>PI) y=y-30;
        if((letzterWinkel+radians(anteil)>(PI/2)) && (letzterWinkel+radians(anteil)<(PI*(3/2)))) { textAlign(RIGHT); x-=10;}
        if(letzterWinkel+radians(anteil)>(PI*(3/2))) y-=10;
        let tmp=(ag7*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }




    fill(1,144,105);
    letzterWinkel=letzterWinkel+radians(anteil);
    anteil=(ag8*360/gesamt);
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE);
    if(zusatzInfos == true){
      push();
        textAlign(LEFT);
        translate(width/2,height/2);
        let x, y;
        x=cos(letzterWinkel+radians(anteil)/2)*(durchmesser/2);
        y=sin(letzterWinkel+radians(anteil)/2)*(durchmesser/2)+20;
        if(letzterWinkel+radians(anteil)>PI) y=y-30;
        if((letzterWinkel+radians(anteil)>(PI/2)) && (letzterWinkel+radians(anteil)<(PI*(3/2)))) { textAlign(RIGHT); x-=10;}
        if(letzterWinkel+radians(anteil)>(PI*(3/2))) y-=10;
        let tmp=(ag8*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }



    fill(145,22,135);
    letzterWinkel=letzterWinkel+radians(anteil);
    anteil=(ag9*360/gesamt);
    arc(width/2, height/2, durchmesser, durchmesser,letzterWinkel,letzterWinkel+radians(anteil),PIE);
    if(zusatzInfos == true){
      push();
        textAlign(LEFT);
        translate(width/2,height/2);
        let x, y;
        x=cos(letzterWinkel+radians(anteil)/2)*(durchmesser/2);
        y=sin(letzterWinkel+radians(anteil)/2)*(durchmesser/2)+20;
        if(letzterWinkel+radians(anteil)>PI) y=y-30;
        if((letzterWinkel+radians(anteil)>(PI/2)) && (letzterWinkel+radians(anteil)<(PI*(3/2)))) { textAlign(RIGHT); x-=10;}
        if(letzterWinkel+radians(anteil)>(PI*(3/2))) y-=10;
        let tmp=(ag9*100/gesamt);
            tmp=runden1(tmp)+"%";
        text(tmp, x, y);
      pop();
    }

}

function legende(ag0, ag1, ag2, ag3, ag4, ag5, ag6, ag7, ag8, ag9){
  push();
    //Koordinatensystem nach ganz links oben verschieben
    translate(width,0);
    let legendeY= height*0.1;
    let legendeX=-150;
    textFont("Helvetica");
    textSize(22);
    fill(0,0,0);
    text("Altersgruppen", legendeX, legendeY+15);
    textSize(18);
    //Zeichnen der einzelnen Teile
    //AG 0-9: Grau
    legendeY+=30;
    fill(112,112,112);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("0 - 9", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag0);
    text(tmp,legendeX+15, legendeY+15);
    }
    //AG 10-19:
    legendeY+=30;
    fill(254,125,25);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("10 - 19", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag1);
    text(tmp,legendeX+15, legendeY+15);
    }
    //AG 20-29:
    legendeY+=30;
    fill(17,20,92);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("20 - 29", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag2);
    text(tmp,legendeX+15, legendeY+15);
    }
    //AG 30-39:
    legendeY+=30;
    fill(240,2,127);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("30 - 39", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag3);
    text(tmp,legendeX+15, legendeY+15);
    }
    //AG 40-49:
    legendeY+=30;
    fill(255,181,0);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("40 - 49", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag4);
    text(tmp,legendeX+15, legendeY+15);
    }
    //AG 50-59:
    legendeY+=30;
    fill(100,16,131);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("50 - 59", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag5);
    text(tmp,legendeX+15, legendeY+15);
    }
    //AG 60-69:
    legendeY+=30;
    fill(253,24,19);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("60 - 69", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag6);
    text(tmp,legendeX+15, legendeY+15);
    }
    //AG 70-79:
    legendeY+=30;
    fill(0,160,198);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("70 - 79", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag7);
    text(tmp,legendeX+15, legendeY+15);
    }
    //AG 80-89:
    legendeY+=30;
    fill(1,144,105);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("80 - 89", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag8);
    text(tmp,legendeX+15, legendeY+15);
    }
    //AG 90+:
    legendeY+=30;
    fill(145,22,135);
    rect(legendeX, legendeY, 15,15);
    fill(0,0,0);
    text("90 +", legendeX+20, legendeY+15);
    if(zusatzInfos2 == true){
    legendeY+=20;
    let tmp = "Inzidenz: "+runden(ag9);
    text(tmp,legendeX+15, legendeY+15);
    }
  pop();  //Koordinatensystem wieder zurücksetzen
}

function animationStarten(){
  animation = true;
}
function animationsStoppen(){
  animation = false;
}
function animationNeustarten(){
  i=0;
  animation=true;
}
function zusatz(){
  animation=true;
  if(zusatzInfos == false){
    zusatzInfos=true;
  }
  else zusatzInfos=false;
}
function zusatz2(){
  animation=true;
  if(zusatzInfos2 == false){
    zusatzInfos2=true;
  }
  else zusatzInfos2=false;
}

function runden(wert){  //Auf zwei Stellen nach dem Komma runden
  let tmp = wert*100;
  wert = Math.round(tmp)/100;
  return wert;
}
function runden1(wert){  //Auf zwei Stellen nach dem Komma runden
  let tmp = wert*10;
  wert = Math.round(tmp)/10;
  return wert;
}
