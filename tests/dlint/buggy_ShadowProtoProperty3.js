function C() {}
C.prototype.x = 3;

var obj = new C();
obj.x = 5;
console.log(obj.x);

