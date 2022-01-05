const { default: axios } = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
var moveJson = {};
var moveList 

const port = process.env.PORT || 3000;
axios.get('https://www.chessgames.com/chessecohelp.html')
      .then(response => {
          const $ = cheerio.load(response.data);
          moveList = response.data;
          $("table").each(function() {
              var tableData = $(this).find('td');
              if (tableData.length > 0) {
                  tableData.each(function(index,el) {
                    if(index%2===0){
                      moveJson[$(this).text()] = $(this).next().find('font').find('font').text();
                    }
                  });
              }
            });
      }).catch(error => {
          console.log(error);
      });

app.get('/', (req, res) => {
  if(moveList!==undefined){
  res.send(moveList);
  }else{
    res.send("data is not loading yet, please wait");
  }
});
app.get('/:code/*',(req,res)=>{
  let moveRelatedToCode= moveJson[req.params.code].toString();
  let lastMoveIndex = moveRelatedToCode.toLowerCase().search(req.params["0"].split("/").pop())
  console.log(typeof moveRelatedToCode,moveRelatedToCode,lastMoveIndex,req.params["0"].split("/").pop().toLowerCase())
  let moveListAfterLastMove = moveRelatedToCode.substring(lastMoveIndex);
  if(lastMoveIndex===-1){
    res.send("Move Not Found")
  }else{
    if(moveListAfterLastMove.split(" ")[1].length>1){
    console.log(moveListAfterLastMove.split(" ")[1].length)
    res.send(moveListAfterLastMove.split(" ")[1]);
    }
    if(moveListAfterLastMove.split(" ")[1].length==1){
    res.send(moveListAfterLastMove.split(" ")[2]);
    }
  }

});
app.get('/:code',(req,res)=>{
  if(moveJson[req.params.code]){
    res.send(moveJson[req.params.code]);
  }else{
    res.send('Not found');
  }
});

app.listen(port, () => {
  console.log('Server is running on port 3000');
}
);
