<br>
<br>
<div style="text-align:center">
<img src="public/images/poketrade_purple.png" alt="drawing" width="100"/>
</div>

<div style="text-align:center"></div>

<h1 style="text-align: center;">Trading Platform API</h1>

Made with:
[Express](https://vuejs.org/),
[Nodejs](https://vuetifyjs.com/en/),
[Socket.io](https://socket.io/)

Tests with:

## Trading Platform API

This is an api for the trading platform api vue application.
It's built with sqlite, node and express.js.


---

#### To run tests (currently no test) 
```javascript
"test": ""
```

#### To start in development mode
```javascript
"start": "nodemon app.js"
```
#### To run production mode

```javascript
"production": "NODE_ENV='production' node app.js"
```

&nbsp;

---


&nbsp;

## Motivation For Tools in the API

#### Node.js & Express

This was used for the course and other courses at Webprogramming. It's also popular in the working world and it's good to have great knowledge about it.

&nbsp;

#### Testing Tools - Mocha, Chai and Istanbul
The tools I've chosen for the testing is Mocha, Chai and Istanbul. I chose these becuase I had used them in the earlier course assignments and I thought they were really good and easy to use. It was really fun to write the backend-tests because the tools made it easier to write them.

#### Coverage
I feel like I wrote better tests than the previous framework website, but there were some areas where I realised I couldn't test them completley which was often the error res if a database error occured.

Coverage wise I felt like it was ok for decent tests I made. I think I could've gone higher if I modified the code for some routes, but since it worked well and the tests were ok, I chose not to (I already made refactoring of the middleware before).