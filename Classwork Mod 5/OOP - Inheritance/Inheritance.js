class Animal {
  constructor(name, type, color, walkStyle, isFriendly = true) {
    this.name = name;
    this.type = type;
    this.age = 4;
    this.color = color;
    this.isFriendly = isFriendly;
    this.walkStyle = walkStyle || "Walka, walka";
  }

  walk() {
    console.log(this.walkStyle);
  }

    greet(otherBeing) {
    console.log(`Sniff sniff, ${otherBeing}`);
  }

  classyGreeting(otherClassyBeing) {
    console.log(`Howdy, there, ${otherClassyBeing.name}`);
  }

  ageUp() {
    this.age++;
  }

  origin() {
    console.log('first')
  }

}



const buttons = new Animal("Buttons", "turtle", "green");
const fluffy = new Animal("Fluffy", "cat", "calico", "Strut, strut", false);
const marshmallow = new Animal(
  "Marshmallow",
  "miniature horse",
  "white",
  "Clip clop, clip clop"
);

class Bird extends Animal {
    fly() {

    }
}

class MythicalCreature extends Animal {
    constructor(name, type, color, isFriendly) {
        super(name, type, color, isFriendly)
        this.powers = ["invisibility", "laser eyes", "super strength"];
    }

    grantWish(wish) {
        console.log(`Your wish is my command, i shall grant your wish to ${wish}`)
    }

    walk() {
        super.walk()
        console.log(`${this.walkStyle} 🫀🦄✨`)
    }
}

const charlie = new MythicalCreature(
    "Charlie",
    'Unicorn',
    'purple',
    '*horse sounds*'
) 
// charlie.walk()
// console.log(buttons.powers)
// console.log(buttons)


class LegendaryCreature extends MythicalCreature {
    test() {
        super.walk()
        console.log("legendary walk")
    }
}

const zapdos = new LegendaryCreature("Zapdos", 'legendary bird', "yellow", "zap zap")

zapdos.age++