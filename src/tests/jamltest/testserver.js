var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var pages = require('pagemaker')
var ports = [1025, 10080,10800];

function SendPage(response, page)
{
    var type = 'text/html';
    response.writeHead(200, {'Content-Type': type});
    response.write(page.toHTML());
    response.end();
}

function SendFile(response, filename)
{
    var type = 'text/html';
    if (path.extname(filename) == ".css") {type = 'text/css';}
    if (path.extname(filename) == ".png") {type = 'image/png';}
    if ((path.basename(filename).length > 0) 
        && (path.extname(filename).length > 0))
    {
        rstream = fs.createReadStream(filename);
        response.writeHead(200, {'Content-Type': type});
    //    console.log("sending file:" + filename);

        rstream.on('data', function (data) { response.write(data); });
        rstream.on('end', function () { response.end(); });
    }
    else { FileNotFound(response); }
}

function FileNotFound(response)
{
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.write("<html><head><title>File not found</title></head>"
        + "<body><h1>Error 404 </h1> "
            + "<br> File was not found.</body></html>");
    response.end();
}

page1 = new StandardPage();
page1.setTitle("Page 1");
page1.standardMenus();
page2 = new StandardPage();
page2.setTitle("Page 2");
page2.standardMenus();
page3 = new StandardPage();
page3.setTitle("Page 3");
page3.standardMenus();
page3.addScript("js/mapfunc.js");
page3.addScript("http://maps.google.com/maps/api/js?sensor=false");

hserver = http.createServer( function (request, response)
    {
        var pathstring =  "html/" + path.normalize("." + 
                url.parse(request.url).pathname);
        console.log("request\t" + request.url + "\tfrom " 
            + request.socket.remoteAddress + "\t\t(" 
            + pathstring + ")");
        path.exists(pathstring,
            function (exists)
            {
//                console.log("file exists:" + exists);
                if (path.basename(pathstring).length <= 2)
                { SendPage(response, page1); }
                if (pathstring == "html/page1.htm")
                { SendPage(response, page1); }
                if (pathstring == "html/page2.htm")
                { SendPage(response, page2); }
                if (pathstring == "html/page3.htm")
                { SendPage(response, page3); }
                else if (exists) 
                { SendFile(response, pathstring); }
                else { FileNotFound(response); }
                
            });
//        fs.readdir(".", function (err,files) { console.log(files);});
    });


function startServer(server, port)
{
    try
    {
        server.listen(port);
    }
    catch (e1)
    {
        console.log("failed to listen on port " + port);
        console.log(e1);
        hserver.close();
        return 0;
    }

    console.log("listening on port " + port);
    return 1;
}

if (process.argv.length >= 3)
    { startServer(hserver,process.argv[2]); }
else
{
    i = 0;
    while (startServer(hserver,ports[i]) == 0 && i < ports.length)
        { i++; }
}

page1.setContent("Jean-Claude Camille François Van Varenberg (born 18 October 1960), professionally known as Jean-Claude Van Damme (French pronunciation: [ʒɑ̃ klod vɑ̃ dam]), is a Belgian martial artist and actor.[1] Van Damme is best known for his martial arts action movies.[2] His most successful films include Bloodsport (1988), Kickboxer (1989), Double Impact (1991), Universal Soldier (1992), Hard Target (1993), Timecop (1994), and JCVD (2008).[3]" 
+"Due to his physique and his Belgian background, he is known as 'The Muscles from Brussels.'After studying martial arts intensively from the age of ten, Van Damme achieved national success in Belgium as a martial artist and bodybuilder, earning the 'Mr. Belgium' bodybuilding title.[4]"
+" He emigrated to the United States in 1982 to pursue a career in film, and achieved success with Bloodsport (1988), based on a story written by Frank Dux. He attained subsequent box office success with Timecop (1994), which grossed over $100 million worldwide and became his most financially successful film."
+"<br><img src='http://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Van_Damme_Cannes_2010.jpg/250px-Van_Damme_Cannes_2010.jpg'>");

page2.setContent("There are many genera of wolf spider, ranging in body size from less than 1 to 30 millimetres (0.04 to 1.18 in).[1] They have eight eyes arranged in three rows. The bottom row consists of four small eyes, the middle row has two very large eyes (which distinguishes them from the Pisauridae), and the top row has two medium-sized eyes. They depend on their excellent eyesight to hunt. They also possess an acute sense of touch."
+ "<br><img width=400 src='http://upload.wikimedia.org/wikipedia/commons/5/55/Lycosidae_female_carrying_young.jpg'><br>"
+"Their eyes reflect light well, allowing someone with a flashlight to easily hunt for them at night. Flashing a beam of light over the spider will produce eyeshine. The light from the flashlight has been reflected from the spider's eyes directly back toward its source, producing a 'glow' that is easily noticed. This is also especially helpful because the wolf spiders are nocturnal and will be out hunting for food, making it easier to find them.");

page3.setContent("<div id='button_div' style='width:80%; height:10%'>"
    + "<input type=button onClick='initialize()' value='Load Map'/></div>"
    + "<div id='map_canvas' style='width:80%; height:80%'></div>");
