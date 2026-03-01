class Hero {
  constructor(id, name, baseStats, type) {
    this.id = id;
    this.name = name;
    this.type = type; // 'warrior', 'archer', 'mage'
    this.level = 1;
    this.exp = 0;
    this.expToNextLevel = 100; // опыт до следующего уровня
    this.isUnlocked = true;

    // Базовые характеристики (растут с уровнем)
      this.baseStats = {
          hp: 100,
          attack: 5,
          defense: 1,
          speed: 10
      };

    // Текущие характеристики (с учётом экипировки)
    this.currentStats = { ...this.baseStats };

    // Инвентарь (9 слотов)
    this.inventory = new Array(9).fill(null);

    // Экипировка (оружие, броня, аксессуар)
    this.equipment = { weapon: null, armor: null, accessory: null };

    // Навыки и очки навыков (каждые 3 уровня)
    this.skills = [];
    this.skillPoints = 0;
  }

  addExp(amount) {
    this.exp += amount;
    while (this.exp >= this.expToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.exp -= this.expToNextLevel;
    this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5); // Растёт требование

    // Улучшаем характеристики
    this.baseStats.hp += 10;
    this.baseStats.attack += 2;
    this.baseStats.defense += 1;

    // Каждые 3 уровня — очко навыка
    if (this.level % 3 === 0) {
      this.skillPoints++;
    }

    this.updateCurrentStats(); // Пересчёт с учётом шмота
  }

  updateCurrentStats(){
      this.currentStats = { ...baseStats }
;
    }

   addToInventory(item) {
       const emptySlot = this.inventory.findIndex(slot => slot === null);
       if (emptySlot !== -1) {
           this.inventory[emptySlot] = item;
           return true;
       }
       return false; // Инвентарь полон
   }

  
}

window.Hero = Hero;
