const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
var clc = require("cli-color");

const context = ({ req }) => ({
  graph: new Graph(),
});

const server = new ApolloServer({
  typeDefs,
  context,
});

server.listen().then(() => {
  var msg = clc.xterm(37);
  console.log(`
    oooooooooo   oooooo     oooo ooooooooo.   oooooooo8 ooooooooo.   oooooooo8 ooooooooo
ooooooooo   oooooo     oooo ooooooooo.   oooooooo8 ooooooooo.   oooooooo8 ooooooooo
    oooooo   oooooo     oooo ooooooooo.   oooooooo8 ooooooooo.   oooooooo8 ooooooooo.`);
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
  let x = ` ooo_____ooo_oooo____oooo________ooooo__ooooooo_ooooooo___oo____oo_ooooooo_ooooooo
 oooo___oooo__oo___oo____oo_____oo___oo_oo______oo____oo__oo____oo_oo______oo____oo
 oo_oo_oo_oo__oo__oo______oo_____oo_____oooo____oo____oo__oo____oo_oooo____oo____oo
 oo__ooo__oo__oo__oo______oo_______oo___oo______ooooooo____oo__oo__oo______ooooooo
 oo_______oo__oo___oo____oo_____oo___oo_oo______oo____oo____oooo___oo______oo____oo
 oo_______oo_oooo____oooo________ooooo__ooooooo_oo_____oo____oo____ooooooo_oo_____oo
 ___________________________________________________________________________________
 
 `;
  console.log(msg(x));
  console.log(
    clc.green(
      "    🖖 MIO Server IS LIVE AND LISTENING ON PORT 4000....@http://localhost:4000"
    )
  );
});
