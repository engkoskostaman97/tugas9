const express = require('express')

const app = express()
const port = 8000

app.set('view engine', 'hbs') // set view engine hbs
app.use('/assets', express.static(__dirname + '/assets')) // path folder assets
app.use(express.urlencoded({ extended: false }))

const db = require('./connection/db')


app.get("/", function (request, response) {

    db.connect(function (err, client, done) {
        if (err) throw err // menampilkan error koneksi database

        client.query('SELECT * FROM tb_projects', function (err, result) {
            if (err) throw err // menampilkan error dari query

            console.log(result.rows)
            let data = result.rows

            let blog = data.map(function (item) {
                return {
                    ...item,
                    duration: getDistanceTime(new Date(item.start_date), new Date(item.end_date))

                }
            })

            response.render('index', { dataBlog: blog })
        })

    })
});
app.get('/blog-detail/:index', function (request, response) {
    let index = request.params.index
    response.render('blog-detail')
});
app.get('/contact', function (request, response) {
    response.render('contact')
})
app.get("/myproject", function (request, response) {
    response.render("myproject");
});
app.post('/myproject', function (request, response) {
    response.redirect("/");
});
app.get("/update-blog", function (request, response) {

});
app.get('/update-blog/:index', function (request, response) {

});

app.post('/update-blog/:index', function (request, response) {
});

app.get('/delete-blog/:index', function (request, response) {
});


function getFullTime(time) {
    let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    let date = time.getDate();
    let monthIndex = time.getMonth();
    let year = time.getFullYear();

    let hours = time.getHours();
    let minutes = time.getMinutes();

    if (hours < 10) {
        hours = "0" + hours;
    } else if (minutes < 10) {
        minutes = "0" + minutes;
    }

    let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`;
    return fullTime;
}

function getDistanceTime(time, end) {
    let timeNow = end;
    let timePost = time;

    let distance = timeNow - timePost;

    let milisecond = 1000;
    let secondInHours = 3600;
    let hoursInDay = 24;
    let daysInMonth = 30;

    let distanceMonth = Math.floor(distance / (milisecond * secondInHours * hoursInDay * daysInMonth));
    let distanceDay = Math.floor(distance / (milisecond * secondInHours * hoursInDay));
    let distanceHours = Math.floor(distance / (milisecond * 60 * 60));
    let distanceMinutes = Math.floor(distance / (milisecond * 60));
    let distanceSeconds = Math.floor(distance / milisecond);

    if (distanceMonth > 0) {
        return `${distanceMonth} bulan `;
    } else if (distanceDay > 0) {
        return `${distanceDay} hari `;
    } else if (distanceHours > 0) {
        return `${distanceHours} jam `;
    } else if (distanceMinutes > 0) {
        return `${distanceMinutes} menit`;
    } else {
        return `${distanceSeconds} detik`;
    }
}

app.listen(port, function () {
    console.log(`server running on port ${port}`);
})