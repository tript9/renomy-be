import express from "express";
import mysql from "mysql";
import cors from "cors";
import 'dotenv/config';

const app = express();

var corsOptions = {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
};

app.use(cors());
// app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    port: process.env.MYSQLDB_DOCKER_PORT,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
});

// print environment variable
console.log("SYSTEM_ENV: ", process.env.SYSTEM_ENV);

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed !!!", err);
    } else {
        console.log("Connected to Database");

        // Run the CREATE TABLE query after connection is successful
        const createBooksTable = `
        CREATE TABLE IF NOT EXISTS books (
          id INT(11) NOT NULL AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          \`desc\` VARCHAR(1024) NOT NULL,
          cover VARCHAR(254) DEFAULT NULL,
          price INT(11) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
        `;

        db.query(createBooksTable, (err, result) => {
            if (err) {
                console.log("Failed to create table:", err);
            } else {
                console.log("Table 'books' ensured to exist or created.");
            }
        });
    }
});

app.get("/", (req, res) => {
    res.json("hello");
});

app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});

app.post("/books", (req, res) => {
    const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = " DELETE FROM books WHERE id = ? ";

    db.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.put("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ];

    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.listen(process.env.NODE_DOCKER_PORT, () => {
    console.log("Connected to backend.");
});
