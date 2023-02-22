import clc from "cli-color";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();
const port = process.env.IPFS_PORT || 4001;
const app = express();

// handle GET requests
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// handle POST requests
app.post("/", (req, res) => {
  res.send("Got a POST request");
});

// handle PUT requests
app.put("/user", (req, res) => {
  res.send("Got a PUT request at /user");
});

// handle DELETE requests
app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

app.listen(port, () => {
  var msg = clc.xterm(37);
  console.log(
    clc.blue(`
                                        Y8888b,
                                      ,oA8888888b,
                                ,aaad8888888888888888bo,
                             ,d888888888888888888888888888b,
                           ,888888888888888888888888888888888b,
                          d8888888888888888888888888888888888888,
                         d888888888888888888888888888888888888888b
                        d888888P'                    Y888888888888,
                        88888P'                    Ybaaaa8888888888l
                       a8888'                      Y8888P' V888888
                     d8888888a                                Y8888
                    AY/'' \Y8b                                 Y8b
                    Y'      YP   
                    '       '
                    `)
  );
  let x = ` 
██╗██████╗ ███████╗███████╗        ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ 
██║██╔══██╗██╔════╝██╔════╝        ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
██║██████╔╝█████╗  ███████╗        ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
██║██╔═══╝ ██╔══╝  ╚════██║        ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
██║██║     ██║     ███████║███████╗███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
╚═╝╚═╝     ╚═╝     ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
 `;
  console.log(msg(x));
  console.log(
    clc.green(
      ` 🖖 MIO Server IS LIVE AND LISTENING ON PORT ${port}....@http://localhost:${port}`
    )
  );
});
