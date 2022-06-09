class Person {

  constructor(name, age) {

    this.name = name

    this.age = age

  }

  test() { console.log('test 继承') }

}



class Student extends Person {

  constructor(name, age, no) {

    super(name, age) // 使父类的值指向子类

    this.no = no

  } 

  say() {

    console.log(`name: ${this.name}, age: ${this.age}, no: ${this.no}`)

  }

}


let student = new Student('mrcode', 21, '11403080435')
student.say()
student.test()