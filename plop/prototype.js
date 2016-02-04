// http://nodeguide.com/beginner.html
// http://visionqmedia.github.io/masteringnode/book.html
// http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js
// http://www.html5rocks.com/en/tutorials/file/filesystem/

var a = {
  x: 10,
  calculate: function(z) {
    return this.x + this.y + z
  }
};

var b = {
  y: 20,
  __proto__: a
};

var c = {
  y: 30,
  __proto__: a
};

// appel de la méthode héritée
b.calculate(30); // 60
c.calculate(40); // 80
