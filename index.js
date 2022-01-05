const { default: axios } = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
var arrayOfThisRow = {};
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
      })
app.get('/', (req, res) => {
  res.send(arrayOfThisRow);
});

app.get('/:code',(req,res)=>{
  res.send(arrayOfThisRow[req.params.code]);
});
        


app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);
