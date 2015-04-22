// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable
    function Dog(name, breed, color, sex) {
      this.name = name;
      this.breed = breed;
      this.color = color;
      this.sex = sex;
    }
    
    theDog = new Dog('Gabby', 'Lab', 'chocolate', 'female');
    theDog.toString(); // returns [object Object]
})();