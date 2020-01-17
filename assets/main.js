var yearPoints = new Object();
var nowBackground = 0;
var cntBackgrounds = 7;
var lastSizeWindow = [0,0];
var animationYear = 1730;
var needBlur = ["gridTable", "backImage2", "downloadLink", "globalEventsBlocks"];
var tmp_block, tmp_x, tmp_y;

initializationPage();



function initializationPage() {
    document.getElementById("gridTable" ).addEventListener('contextmenu', function(event) {changeBackImage();event.preventDefault();}, false);
    document.getElementById("backImage2").addEventListener('contextmenu', function(event) {changeBackImage();event.preventDefault();}, false);

    initTable();
    fitTable();
    setYear(2020);
    writeGlobalEvent();
    initializationKeyEvent();
    initializationDragStrip();
}

function setYear(newYear = null) {
    var slider = document.getElementById("inputRangeSlider");
    if (newYear) {
        slider.value = newYear;
        showYear();
    }
    return slider.value;
}

function initializationKeyEvent() {
    document.body.onkeydown = parseKeyboard;

    function parseKeyboard(e) {
        var num = e.keyCode;
        if ( e.keyCode == 32 ) { /// Space
            addYearPoint();
            return;
        }
        
        var slider = document.getElementById("inputRangeSlider");

        if ( e.keyCode == 8 ) { /// Backspace
            e.preventDefault();
            var year = slider.value;
            var delYear = null;
            for (i in yearPoints) {
                delYear = i;
                if ( i >= year ) 
                    break;
            }
            
            if (delYear)
                removeYearPoint("point" + delYear);
            return;
        }
        
        if ( e.keyCode == 37 || e.keyCode == 39 ) { /// Arrows
            e.preventDefault();
            if ( e.keyCode == 37 ) slider.value--;
            if ( e.keyCode == 39 ) slider.value++;
            showYear();
            return;
        }   
    }
}



function initializationDragStrip() {
    var lastY = 0;
    document.getElementById("dragStrip").onmousedown = dragMouseDown;
    document.getElementById("dragStrip").ondblclick = unwrapElement;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        lastY = e.clientY;
        document.onmouseup = finishDragElement;
        document.onmousemove = dragElement;
    }

    function dragElement(e) {
        e.preventDefault();
        var deltaY = lastY - e.clientY;;
        lastY = e.clientY;
        
        var mBlock = document.getElementById("globalEventsBlocks");
        var newHeight = mBlock.offsetHeight + deltaY;
       	newHeight = Math.min(Math.max(newHeight, 40), window.innerHeight);
        mBlock.style.height = newHeight + "px";
        
    }

    function finishDragElement() {        
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function unwrapElement() {     
        var mBlock = document.getElementById("globalEventsBlocks");
        
        if ( mBlock.offsetHeight > window.innerHeight/4 )
            mBlock.style.height = "40px";
        else
            mBlock.style.height = window.innerHeight/2 + "px";
    }
}

function writeGlobalEvent() {
    var mBlock = document.getElementById("globalEventsBlocks");

    var drag = document.createElement("div");
    drag.id = "dragStrip";
    drag.className = "dragger";
    drag.innerHTML = "::::::::::::::::::::::::::::::::::::::::::::::::::::";
    mBlock.appendChild(drag);

    var block = document.createElement("div");
    block.className = "container-global-events-c";  
    mBlock.appendChild(block);
    
    var header = document.createElement("h2");
    header.className = "global-events-header";
    header.innerHTML = "Основные события в химии XVII - XX веков";
    block.appendChild(header);
    
    var footer = document.createElement("div");
    var footerInner = document.createElement("div");
    footer.style.width = "100%";
    footer.style.textAlign = "right";
    
    footerInner.className = "wiki-label";
    footerInner.innerHTML = 'Материал из Википедии — свободной энциклопедии<br><span>Распространяется под лицензией <a href="https://ru.wikipedia.org/wiki/Википедия:Текст_лицензии_Creative_Commons_Attribution-ShareAlike_3.0_Unported">CC BY-SA 3.0</a></span>';
    footer.appendChild(footerInner);

    for (var i=0; i<globalChemEvent.length; ++i) {
        var data = globalChemEvent[i];
        var p = document.createElement("p");
        p.innerHTML = "<h3>" + data.year + "</h3>" + data.desc + "<br>";
        block.appendChild(p);
    }

    block.appendChild(footer);
}

function showDownInstruction() {
    showHelp('downInstructionWindow');
}

function startAnimation() {
    document.getElementById('helpButton').style.display = 'none';
    document.getElementById('downloadLink').style.display = 'none';
    document.getElementById('slideContainer').style.visibility = 'hidden';

    runAnimation();
}

function stopAnimation() {
    document.getElementById('helpButton').style.display = 'inline-block';
    document.getElementById('downloadLink').style.display = 'block';
    document.getElementById('slideContainer').style.visibility = 'visible';

}

function fitTable() {
    var nowSizeWindow = [window.innerWidth, window.innerHeight];
    if ( nowSizeWindow != lastSizeWindow ) {
        lastSizeWindow = nowSizeWindow;
        setSizeTable(nowSizeWindow[0], nowSizeWindow[1]);
    }
}

window.addEventListener('resize', function(event){
    fitTable();
});

function setSizeTable(width, height) {
    var bodyMargin = parseInt(window.getComputedStyle(document.body)['margin-left']);
    width -= 2 * bodyMargin;
    height -= 75;
    width = Math.min(width, 2 * height);

    var cellBorder = 3;
    var cellSpacing = 10;
    var cellWidth = (width - 19*cellSpacing) / 18 - 2*cellBorder;
    var cellHeight = cellWidth;
    var bigFontSize = 30 / 1100 * width;
    var smallFontSize = 15 / 1100 * width;
    var helpButtonSize = 35 / 1100 * width;
    var titleFontSize = 130 / 1100 * width;

    var tableStyle = document.getElementById('gridTable').style;
    tableStyle.borderSpacing = cellSpacing + "px";
    tableStyle.fontSize = bigFontSize + "px";

    var buttonStyle = document.getElementById('helpButton').style;
    buttonStyle.width = helpButtonSize + "px";
    buttonStyle.height = helpButtonSize + "px";

    var titleStyle = document.getElementById('yearBlock').style;
    titleStyle.fontSize = titleFontSize + "px";

    var downPic = document.getElementById('downloadIcon').style;
    downPic.maxWidth = downPic.maxHeight = width / 15 + "px";

    for (var i=1; i<=120; ++i) {
        var cell = document.getElementById('e' + i);
        var cellStyle = cell.style;
        cellStyle.width = cellWidth + "px";
        cellStyle.height = cellHeight + "px";
        cellStyle.borderWidth = cellBorder + "px";

        var spanStyle = cell.childNodes[0].style;
        if (width > 980)
            spanStyle.display = "block";
        else
            spanStyle.display = "none";
    }

}

function changeBackImage() {
    nowBackground = (nowBackground + 1) % cntBackgrounds;
    var link = 'url("assets/images/background_' + nowBackground + '.jpg")';
    document.getElementById("backImage1").style.backgroundImage = link;
    document.getElementById("backImage2").style.backgroundImage = link;
}

function showHelp(id = "helpWindow") { /// TODO: webkit- prefix
    for (var i=0; i<needBlur.length; ++i) 
        document.getElementById(needBlur[i]).style.filter = "blur(5px)";
    document.getElementById(id).style.display = "block";
}
function hideHelp() {
    for (var i=0; i<needBlur.length; ++i) 
        document.getElementById(needBlur[i]).style.removeProperty('filter');
    
    document.getElementById("helpWindow").style.display = "none";
    document.getElementById("downInstructionWindow").style.display = "none";
    document.getElementById("elementWindow").style.display = "none";
}



function prepareInfoAboutElement(id) {
    var name = generalInfo[id].name;
    var year = generalInfo[id].year;
    var text = historyElement[id]['text'];
    var wikiLink = "https://ru.wikipedia.org" + generalInfo[id].wiki;

    var headTitle = document.getElementById("elementPopUpTitle");
    headTitle.innerHTML = name;
    if ( year != 0 )
        headTitle.innerHTML += "<span>(" + year + ")</span>";

    var props = document.getElementById("elementProperties");
    //props.innerHTML = JSON.stringify(generalInfo[id], null, '\t');

    var mainText = document.getElementById("elementPopUpText");
    mainText.innerHTML = '';
    mainText.innerHTML = text;
    
    //                                                                  TODO: scrolls
    //document.getElementById("elementPopUpTextContainer").scrollTo(0,0);
    //mainText.scrollTo(0,0);
    
    var wikiBlock = document.getElementById("wikiLink");
    wikiBlock.setAttribute("href", wikiLink);
}



function initTable() {
    function generatePosition() {
        var a = new Array();
        for (var i=0; i<10; ++i) {
            a[i] = new Array();
            for (var j=0; j<18; ++j)
                a[i][j] = 0;
        }
    
        a[0][0] = 1;
        a[0][17] = 2;
    
        var p = 3;
        for (var i=1; i<3; ++i) {
            a[i][0] = p++;
            a[i][1] = p++;
            for (var j=12; j<18; j++)
                a[i][j] = p++;
        }
        for (var i=3; i<5; ++i)
            for (var j=0; j<18; j++)
                a[i][j] = p++;
    
        for (var i=5; i<7; ++i) {
            a[i][0] = p++;
            a[i][1] = p++;
            for (var j=0; j<15; ++j)
                a[i+3][j+1] = p++;
            for (var j=3; j<18; ++j)
                a[i][j] = p++;
        }
        a[5][2] = 119; 
        a[6][2] = 120;
    
        return a;
    }
    
    var coordinate = generatePosition();
    var t = document.getElementById("gridTable");
    t.innerHTML = "";

    for (var i=0; i<10; i++) {
        var row = document.createElement('tr');
        if ( i == 7 ) {
            row.setAttribute("class", "spacingRow");
            t.appendChild(row);
            continue;
        }

        t.appendChild(row);
        for (var j=0; j<18; j++) {
            var cell = document.createElement('td');

            if ( i == 0 && j == 1 ) {
                cell.setAttribute("class", "helpContainer");
                var div = document.createElement('div');
                div.setAttribute("id", "helpButton");
                div.setAttribute("class", "helpButton");
                div.setAttribute("onclick", "showHelp()");
                div.innerHTML = "?";
                cell.appendChild(div);
                row.appendChild(cell);
                continue;
            }

            if (i == 0 && j == 2) {
                cell.setAttribute("colspan", 15);
                cell.setAttribute("class", "titleContainer");
                var div = document.createElement('div');
                div.className = "title";
                div.innerHTML = '<span id="yearBlock" class="yearBlock">2020</span>';

                cell.appendChild(div);
                row.appendChild(cell);
                j += 14;
                continue;
            }


            if (i == 2 && j == 2) {
                cell.setAttribute("colspan", 10);
                cell.setAttribute("class", "slideContainer");
                cell.setAttribute("id", "slideContainer");

                var div = document.createElement('div');
                div.className = "slideOuter";

                var input = document.createElement('input');
                input.className = "slider";
                input.setAttribute("id", "inputRangeSlider");
                input.setAttribute("type", "range");
                input.setAttribute("min", "1730");
                input.setAttribute("max", "2020");
                input.setAttribute("value", "2020");
                input.setAttribute("ondblclick", "addYearPoint()");
                input.setAttribute("oninput", "showYear()");
                input.setAttribute("autofocus", "autofocus");
                div.appendChild(input);

                var div2 = document.createElement('div');
                div2.className = "yearPointsContainer";
                div2.setAttribute("id", "yearPointsContainer");
                div.appendChild(div2);

                cell.appendChild(div);
                row.appendChild(cell);
                j += 9;
                continue;
            }

            var id = coordinate[i][j];
            if ( id > 0 ) {
                cell.innerHTML =
                    "<span>" + generalInfo[id].atomic + "</span>" +
                    generalInfo[id].symbol;
                cell.setAttribute("id", "e" + id);
                cell.setAttribute("style", "transition: inherit; -webkit-transition: inherit;");
            } else
                cell.style.visibility = "hidden";

            row.appendChild(cell);
        }
    }
}

function showYear() {
    var year = document.getElementById("inputRangeSlider").value;
    document.getElementById("yearBlock").innerHTML = year;

    for (var i=1; i<=120; ++i) {
        var cellS = document.getElementById("e" + i).style;
        if ( generalInfo[i].year <= year )
            cellS.visibility = 'visible';
        else
            cellS.visibility = 'hidden';
    }
}

function addYearPoint(year) {
    function generateNewColor() {
        function genNumber(l, r) {
            return l + Math.floor(Math.random() * (r-l));
        }
        
        var h = genNumber(0, 360);
        var s = genNumber(40, 100);
        var l = genNumber(40, 70);
        return "hsl(" + h + "," + s + "%," + l + "%)";
    }

    if ( Object.keys(yearPoints).length > 8 )
        return;

    for (var i in yearPoints)
        document.getElementById("point" + i).remove();

    var year = document.getElementById("inputRangeSlider").value;
    yearPoints[year] = generateNewColor();
    yearPocessing()
}

function removeYearPoint(idPoint) {
    for (var i in yearPoints)
        document.getElementById("point" + i).remove();

    var year = idPoint.substr(5);
    delete yearPoints[year];
    yearPocessing();
}

function yearPocessing() {

    for (var year in yearPoints) {
        var color = yearPoints[year];
        var label = document.createElement('div');
        label.setAttribute("class", "yearPoint");
        label.setAttribute("id", "point" + year);
        label.setAttribute("onclick", "removeYearPoint(this.id)");
        label.innerHTML = year;
        label.style.color = color;
        document.getElementById("yearPointsContainer").appendChild(label);
    }


    yearPoints[2100] = "#ffffff";

    var last = -1;
    for (var year in yearPoints) {
        var color = yearPoints[year];

        for (var x=1; x<=120; ++x)
            if ( generalInfo[x].year > last && generalInfo[x].year <= year ) {
                var cell = document.getElementById("e" + x);
                if ( year == 2100 ) {
                    cell.style.removeProperty('color');
                    cell.style.removeProperty('border-color');
                } else {
                    cell.style.color = color;
                    cell.style.borderColor = color;
                }
            }
        last = year;
    }
    delete yearPoints[2100];
}




// копия блока с элементом
function createAnimElement(block,x , y) {
    $("#anim-element").css({
        "width":        $(block).width()+"px",
        "height":       $(block).height()+"px",
        "border-width": $(block).css("border-width"),
        "font-size":    $(block).css("font-size"),
        "left":         x+"px",
        "top":          y+"px",
    });
    $("#anim-element").html($(block).html());
    $("#anim-element").append($("#info-window").clone());
    $("#info-window").css({
        "left": $(block).width()/2 + "px",
        "top":  $(block).height()/2 + "px",
    });
}

$(function () {
    
        
    $("#gridTable tr td").click(function () {
        var id = $(this).attr("id").substr(1);
        if (id < 1 || id > 118 || $(this).attr("id")[0] != "e")
            return;
        
		prepareInfoAboutElement(id);

        tmp_block = $(this);
        tmp_x = $(this).offset()["left"];					// Отступы для копии блока
        tmp_y = $(this).offset()["top"];		

        var w_width     = $(window).width();
        var w_height    = $(window).height();
        var iw_height   = w_height * 80 / 100;				// размер окна в процентах. Высота 70%
        var iw_width    = w_width * 60 / 100;				// Ширина 40%

        createAnimElement(this, tmp_x, tmp_y);				// Копируем блок
        $(this).css("opacity", "1");  						// Делаем прозрачной ячейку таблички 
        $("#anim-element").show();							// Ставим на ее место копию блока, ток с position: absolute

        	
        $("#overlay").fadeIn(400);							// Плавно показываем задний фон
        $("#anim-element").animate({						// Двигаем элемент
            "left": w_width/2 - $(this).width()/2 + "px",	
            "top":  w_height/2 - $(this).height()/2 + "px",
        }, 300);

        $("#info-window").animate({							// Открываем окно пока двигается элемент
            "height":   iw_height + "px",
            "width":    iw_width + "px",
            "left":     -iw_width/2 + "px",
            "top":      -iw_height/2 + "px",
        }, 400, function () {
            $("#info-window-content").fadeIn(100);			// Показать содержимое окна когда окно открылось
        });
          
    });
   
    // все то же самое ток наоборот
    $("#overlay").click(function () {
        if ( $("#info-window-content").css("display") == "none" )
            return;

        $("#overlay").fadeOut(400);

        setTimeout(function () {
            $("#info-window-content").fadeOut(10);
            $("#anim-element").animate({
                "left": tmp_x + "px",
                "top":  tmp_y + "px",
                "border-radius": "0px",
            }, 400, function () {
                $(tmp_block).css("opacity", "100");
                $("#anim-element").hide();
            });

            $("#info-window").animate({
                "height":   "0px",
                "width":    "0px",
                "left":     $(tmp_block).width()/2 + "px",
                "top":      $(tmp_block).height()/2 + "px",
            }, 300, function () {
            	document.getElementById("info-window").remove();
            });
        }, 100);
    });
    
});
