let input, button, button2, greeting;
let progress = 0;

function setup() {
    // create canvas
    createCanvas(windowWidth, windowHeight);

    input = createInput("", "file");
    input.position(width/2 - 250, 65);

    button = createButton('submit');
    button.position(input.x, input.y + input.height + 5);
    button.mousePressed(showFile);

    greeting = createElement('h2', 'Upload document:');
    greeting.position(width/2 - 250, 5);

    textAlign(CENTER);
    textSize(50);
    noLoop();
}

function showFile() {
    let preview = document.getElementById('show-text');
    let file = document.querySelector('input[type=file]').files[0];
    let rdr = new FileReader(file);
    rdr.onload = function (event) {
        preview.textContent = event.target.result;
    };
    rdr.readAsText(file);
    button2 = createButton('analyze');
    button2.position(button.x + button.width, button.y);
    button2.mousePressed(analysisDo);
    button2.style = 'hidden';
}

let Data = [];
let Users = {};

let total;
let start;
let last;

function analysisDo() {
    let preview = document.getElementById('show-text');
    let text_to_read = preview.innerHTML;
    let pattern = /\n(?=\d+\/\d+\/\d+)/;
    let comp = text_to_read.split(pattern);
    let prev = new Date();
    for (let i=0;i<comp.length-1; i++) {
        let act = new Date();
        if (act - prev > 15) {
            rect(400, 400, 200*i/comp.length, 40);
            prev = act;
        }

        // DATE PARSING
        let date = comp[i].substring(0, comp[i].indexOf('-'));
        let split1 = date.split(" ");
        let split2 = split1[0].split("/");
        let day = parseInt(split2[0]);
        let month = parseInt(split2[1]) - 1;
        let year = 2000 + parseInt(split2[2]);
        split2 = split1[1].split(":");
        let hour = parseInt(split2[0]);
        let minute = parseInt(split2[1]);

        // SENDER PARSING
        let text = comp[i].substring(comp[i].indexOf('-'));
        let sender = text.substring(2, text.indexOf(':'));
        let msj = text.substring(text.indexOf(':')+2);

        // DICTIONARY ENTRY BUILD
        let data = {
            "id": i+1,
            "sender" : sender,
            "date": new Date( year, month, day, hour, minute),
            "msj": msj
        };
        Data.push(data);
    }
    background(255);
    //ANALYZE USERS
    let chunk = 1;
    for (let i=0; i < Data.length; i++){
        if (Data[i].sender in Users) {
            Users[Data[i].sender].count += 1;
            if (Data[i].sender === Data[i-1].sender) {
                chunk +=1
            }
            else {
                Users[Data[i-1].sender].chunk.push(chunk);
                chunk = 1;
                Users[Data[i].sender].delay.push((Data[i].date - Data[i - 1].date)/60000);
            }
        }
        else {
            Users[Data[i].sender] = {
                "count": 1,
                "delay": [],
                "chunk": [],
                "bow" : {},
                "multimedia": 0
            };
        }
    }
    // PARAMETERS
    total = Data.length;
    start = Data[0].date;
    last = Data[total-1].date;

    // PRESENTATION
    background(240);
    textSize(15);
    fill(0, 102, 153);
    text(
        total.toString() + " messages between " + start.toDateString() + " and " + last.toDateString(),
        width/2 - 250,
        button.y + button.height + 32,
        300,
        200);

    console.log(prev);
    bag_words()

    console.log(Users);

    let lastAngle = 0;
    strokeWeight(0);
    for(let keys in Users) {
        fill(255 - 1.75*255*( Users[keys].count / total ), 255 - 1.75*255*( Users[keys].count / total ), 255 - 1.75*255*( Users[keys].count / total ));
        textSize(15);
        let angle = ( Users[keys].count / total )* 360;
        text(keys, width/2 + 100*cos(lastAngle), button.y + button.height + 200 + 100*sin(lastAngle));
        arc(
            width/2,
            button.y + button.height + 200,
            100,
            100,
            lastAngle,
            lastAngle + radians(angle));
        lastAngle = lastAngle + radians(angle)

    }
    let test = [];
    for( let i=0; i<Users["Font"]["delay"].length; i++) {
        if (Users["Font"]["delay"][i] < 20) {
            test.push(Users["Font"]["delay"][i]);
        }
    }

    let hist = histogram(test, 20, 400, 400, 600, 500, 0);
    console.log(hist);
    textSize(14);
    let max = hist.counts[0];
    text(max, 400 - 7 - textWidth(max), 400);

}

function bag_words() {
    for(let i=0; i<Data.length; i++) {
        if (Data[i].msj === "&lt;Multimedia omitido&gt;") {
            Users[Data[i].sender].multimedia += 1;
        }
        else {
            let list = Data[i]["msj"].split(/\W/);
            for(let j=0; j < list.length; j++) {
                if (!(list[j].match(/[\d]/)) && list[j] !== "") {
                    list[j] = list[j].toLowerCase();
                    if (list[j] in Users[Data[i].sender]["bow"]) {
                        Users[Data[i].sender]["bow"][list[j]] += 1;
                    }
                    else {
                        Users[Data[i].sender]["bow"][list[j]] = 1;
                    }
                }
            }
        }
    }
}

function average(list) {
    let sum = 0.0;
    for (let i=0; i < list.length; i++) {
        sum += list[i];
    }
    return sum / list.length;
}

function histogram(list, bins, pos_x, pos_y, end_x, end_y, dist) {
    // AXIS
    let inferior = 0;
    let sup_list = [];
    let superior;
    let counts = [];
    for (let i=1; i<=bins; i++) {
        let count = 0;
        superior = Math.max.apply(null, list)*i/bins;
        for (let j=0; j<list.length; j++) {
            if ((list[j]>= inferior) && (list[j] < superior)){
                // COUNT OF VALUES INSIDE RANGE
                count += 1;
            }
        }
        counts.push(count);
        sup_list.push(superior);
        inferior = superior;
    }
    let max = Math.max.apply(null, counts);
    let ant_x = pos_x;
    let width = (end_x - pos_x)/bins - dist;
    for (let i=0; i<counts.length; i++) {

        let height = (end_y - pos_y)*(counts[i]/max);
        rect( ant_x, end_y - height, width, height);
        ant_x += width + dist;
    }
    return {
        "counts": counts,
        "sup_list": sup_list
    };
}
