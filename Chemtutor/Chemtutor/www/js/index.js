/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceReady', onDeviceReady, false);

var state = 'starting'; // current application state, this is the screen we show
var subject = ''; // the subject, this is the data we are teaching/testing from
var dataIndex = 0;
var nCorrect = 0;
var randList = [];
var answer = "";

// the data, TODO: get this from a json file later
var data = { 'Chemie' : [
     ["Perchlorsäure","HClO<sub>4</sub>(aq)", "HCLO4"]
    ,["Chlorsäure", "HClO<sub>3</sub>(aq)", "HCLO3"]
    ,["Chlorige Säure","HClO<sub>2</sub>(aq)","HCLO2"]
    ,["Hypochlorige Säure","HClO(aq)","HCLO"]
    ,["Flusssäure","HF(aq)","HF"]
    ,["Salzsäure","HCl(aq)","HCl"]
    ,["Bromwasserstoffsäure","HBr(aq)","HBr"]
    ,["Schwefelsäure","H<sub>2</sub>SO<sub>4</sub>(aq)","H2SO4"]
    ,["Schweflige Säure","H<sub>2</sub>SO<sub>3</sub>(aq)","H2SO3"]
    ,["Thioschwefelsäure","H<sub>2</sub>S<sub>2</sub>O<sub>3</sub>(aq)","H2S2O3"]
    ,["Peroxidschwefelsäure","H<sub>2</sub>S<sub>2</sub>O<sub>8</sub>(aq)","H2S2O8"]
    ,["Schwefelwasserstoff","H<sub>2</sub>S(aq)","H2S"]
    ,["Salpetersäure","HNO<sub>3</sub>(aq)","HNO3"]
    ,["Salpetrige Säure","HNO<sub>2</sub>(aq)","HNO2"]
    ,["Stickstoffwasserstoffsäure","HN<sub>3</sub>(aq)","HN3"]
    ,["Phosphorsäure","H<sub>3</sub>PO<sub>4</sub>(aq)","H3PO4"]
    ,["Kohlensäure","H<sub>2</sub>CO<sub>3</sub>(aq)","H2CO3"]
    ,["Cyanwasserstoffsäure","HCN(aq)","HCN"]
    ,["Kieselsäure","H<sub>4</sub>SiO<sub>4</sub>(aq)","H4SIO4"]
    ,["Borsäure","H<sub>3</sub>BO<sub>3</sub>(aq)","H3BO3"]
    ,["Natronlauge","NaOH(aq)","NaOH"]
    ,["Kalilauge","KOH(aq)","KOH"]
    ,["Kalkwasser","Ca(OH)<sub>2</sub>(aq)","Ca(OH)2"]
    ,["Barytwasser","Ba(OH)<sub>2</sub>(aq)","Ba(OH)2"]
    ,["Magnesiumhydroxid-Lösung","Mg(OH)<sub>2</sub>(aq)","Mg(OH)2"]
    ,["Ammoniakwasser","NH<sub>3</sub>(aq)","NH3"]
    ,["Methylamin-Lösung","H<sub>3</sub>C-NH<sub>2</sub>(aq)","H3C-NH2"]
    ,["Natriumcarbonat-Lösung","Na<sub>2</sub>CO<sub>3</sub>(aq)","Na2CO3"]
], 'Englisch' : [] };

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
 }

function updateIndicator() {
    document.getElementById('indicator').innerHTML = subject;
}

function updateTeachText() {
    if (0 > dataIndex)
        dataIndex = dataIndex = data[subject].length - 1;
    if (data[subject].length <= dataIndex)
    {
        if( "test" == state )
        {
            // show score
            var ob = document.getElementById('testText');
            ob.innerHTML = '<h2>Ergebnis</h2>' + nCorrect +' von ' + data[subject].length + ' richtig';
            return;
        }
        dataIndex = 0;
    }
    if (data[subject].length <= dataIndex)
    {
        document.getElementById('teachText').innerHTML = "";
        document.getElementById('testText').innerHTML = "";
        console.log( "empty:" + dataIndex + "/" + data[subject].length );
        return;
    }
    if( "test" == state ) {
        var s = randList[dataIndex];
        var i = 10;
        var ob = document.getElementById('testText');
        console.log( "test:" + dataIndex.toString() + " " + s[0] );
        if( "" == answer ){
            ob.innerHTML = s[0] + '= <input type="text" name="answer" id="answerInput" value="" class="techFont"> &quest;' ;            
        }
        else {
            if( answer.toUpperCase() == s[2].toUpperCase() )
            {
                nCorrect++;
                ob.innerHTML = '<div class="greenText">Richtig!</div>' + s[0] +' = <div class="techFont">' + s[2] + '</div>';
            }
            else
            {
                ob.innerHTML = '<div class="redText">Falsch</div>' + s[0] + '<br><div class="techFont">' + answer +' != ' + s[2] + '</div>';
            }
        }
    }
    else {
        var s = data[subject][dataIndex];
        ob =  document.getElementById('teachText');
        console.log( "teach:" + dataIndex.toString() + " " + s[0] );
        ob.innerHTML = s[0] + ' = <div class="techFont">' + s[1] + '<br><div class="darkGrey">(' + s[2] + ")</div></div>";
    }
}

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    // open file with chemical formulas and names

    // update UI, i.e. show number of formulas ready to teach

    // finally switch UI from starting screen to main 
    document.getElementById('app').classList.replace('starting','welcome');
    state = 'welcome';

    document.getElementById('welcomeStartButton').addEventListener('click', onStart, false );
    document.getElementById('subjectEnglisch').addEventListener('click', onSubjectEnglisch, false);
    document.getElementById('subjectChemie').addEventListener('click', onSubjectChemie, false);
    document.getElementById('modeTeach').addEventListener('click', onModeTeach, false);
    document.getElementById('modeTest').addEventListener('click', onModeTest, false);

    var backButtons = document.getElementsByClassName('backButton');
    console.log( "backButtons:" + backButtons.length.toString());
    for( var i = 0; i < backButtons.length; i++ )
    {
        backButtons[i].addEventListener('click', onBack, false);
    }
    var prevButtons = document.getElementsByClassName('prevButton');
    console.log( "prevButtons:" + prevButtons.length.toString());
    for( var i = 0; i < prevButtons.length; i++ )
    {
        prevButtons[i].addEventListener('click', onPrev, false);
    }
    var nextButtons = document.getElementsByClassName('nextButton');
    console.log( "nextButtons:" + nextButtons.length.toString());
    for( var i = 0; i < nextButtons.length; i++ )
    {
        nextButtons[i].addEventListener('click', onNext, false);
    }
}

function onStart() {
    document.getElementById('app').classList.replace('welcome','subject');
    state = 'subject';
    updateIndicator();
}

function onSubjectEnglisch() {
    document.getElementById('app').classList.replace('subject','mode');
    state = 'mode';
    subject = 'Englisch';
    updateIndicator();
}

function onSubjectChemie() {
    document.getElementById('app').classList.replace('subject','mode');
    state = 'mode';
    subject = 'Chemie';
    updateIndicator();
}

function onModeTeach() {
    var ok = data && data[subject] && data[subject].length; 
    if( !ok )
    {
        alert("Zu diesem Fach gibt es noch keine Daten.");
    }
    else
    {
        dataIndex = 0;
        document.getElementById('app').classList.replace('mode', 'teach');
        state = 'teach';
        updateTeachText();        
        updateIndicator();
    }

}

function onModeTest() {
    var ok = data && data[subject] && data[subject].length; 
    if( !ok )
    {
        alert("Zu diesem Fach gibt es noch keine Daten.");
    }
    else
    {
        dataIndex = 0;
        nCorrect = 0;
        answer = "";
        randList = data[subject];
        shuffle(randList);
        document.getElementById('app').classList.replace('mode','test');
        state = 'test';
        updateTeachText();        
        updateIndicator();
    }
}



function onBack() {
    if( state == 'mode' )
    {
        document.getElementById('app').classList.replace('mode','subject');
        subject='';
        state='subject';
    }
    if( state == 'teach' )
    {
        document.getElementById('app').classList.replace('teach','mode');
        state='mode';
    }
    if( state == 'test' )
    {
        document.getElementById('app').classList.replace('test','mode');
        state='mode';
    }
    updateIndicator();
}

function onPrev() {
    dataIndex--;
    updateTeachText();
    updateIndicator();
}


function onNext() {
    if( "test" == state && ( "" == answer || data[subject].length == dataIndex ) )
    {
        if( data[subject].length == dataIndex )
        {
            onBack();
        }
        else
        {
            answer = document.getElementById('answerInput').value;
            
        }
    }
    else
    {
        dataIndex++;
        answer = "";
    }
    updateTeachText();
    updateIndicator();
}



