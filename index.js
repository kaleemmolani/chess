const { default: axios } = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
var arrayOfThisRow = {};
const port = process.env.PORT || 3000;
axios.get('https://www.chessgames.com/chessecohelp.html')
      .then(response => {
          const $ = cheerio.load(response.data);
          $("table").each(function() {
              var tableData = $(this).find('td');
              if (tableData.length > 0) {
                  tableData.each(function(index,el) {
                    if(index%2===0){
                      arrayOfThisRow[$(this).text()] = $(this).next().find('font').find('font').text();
                      
                    }
                  });
                  
              }
            });
      }).catch(error => {
          console.log(error);
      });

app.get('/', (req, res) => {
  res.send(arrayOfThisRow);
});
app.get('/:code/*',(req,res)=>{
  let s= arrayOfThisRow[req.params.code].toString();
  let sindex = s.toLowerCase().search(req.params["0"].split("/").pop())
  console.log(typeof s,s,sindex,req.params["0"].split("/").pop().toLowerCase())
  let ns = s.substring(sindex);
  console.log(ns.split(" ")[1])
  if(sindex===-1){
    res.send("Move Not Found")
  }else{
    if(ns.split(" ")[1].length>1){
    console.log(ns.split(" ")[1].length)
    res.send(ns.split(" ")[1]);
    }
    if(ns.split(" ")[1].length==1){
    res.send(ns.split(" ")[2]);
    }
  }

});
app.get('/:code',(req,res)=>{
  if(arrayOfThisRow[req.params.code]){
    res.send(arrayOfThisRow[req.params.code]);
  }else{
    res.send('Not found');
  }
});



app.listen(port, () => {
  console.log('Server is running on port 3000');
}
);
