var filename = "./test.csv";

function CreateJSON(data, categoryName, startFrom){
    if(!categoryName) { categoryName = "index"; }
    if(!startFrom) { startFrom = 1; }

    var rows = data.split('\n');
    var names = rows[0].split(",");
    var result = rows.slice(startFrom, -1).reduce(function(entries, row, index) {
    	if (!entries) { return; }
	var items = row.split(",").reduce(function(entry, item, idx){
	    entry[names[idx]] = item.trim();
	    return entry;
	}, Object.create(null));
	items["index"] = index;
	entries.push(items);
	return entries;
    }, []);

    return {"names":names, "result":result};
}

function SetVisible()
{
    console.log("pressed");
}


$(document).ready(function(){
    $.get(filename, function(data) {
	var jsonData = CreateJSON(data);
	jsonData["names"].map(function(name){
	    $("#selecter").append("<input type=\"checkbox\" checked=\"true\" name=\"group\" onclick=\"SetVisible()\">" + name + "<br/>");
	});
	var chart = AmCharts.makeChart( "chartdiv",
	{
	    "type": "serial",
	    "theme": "light",
	    "dataProvider":jsonData["result"], // should be switched to dataLoader plugin.
	    "categoryField": "index",
	    "valueAxes": [ {
		"gridColor": "#222222",
		"gridAlpha": 0.2,
		"dashLength": 0
	    } ],
	    "rotate":true,
	    "gridAboveGraphs": true,
	    "startDuration": 0,
	    
	    "graphs": function(names){
		return names.reduce(function(data, name){
		    if (!data) return;
		    data.push({
			"type": "line",
			"title": name,
			"valueField": name,
			"balloonText": "[[category]]: <b>[[value]]</b>",
			"fillAlphas": 0.2,
			"lineAlpha": 0.2,
		    });
		    return data; }, []);
	    }(jsonData["names"]),
	    "chartCursor": {
	    	"categoryBalloonEnabled": false,
	    	"cursorAlpha": 0,
	    	"zoomable": false
	    },
	    "categoryAxis": {
		"gridPosition": "start",
		"gridAlpha": 0,
		"tickPosition": "start",
		"tickLength": 20
	    },
	    
	    // "export": {
	    // 	"enabled": true
	    // }
	});

        var legend = new AmCharts.AmLegend();
	chart.addLegend(legend);

        chart.creditsPosition = "top-right";
    });
});
