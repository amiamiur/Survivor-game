class Item {
    constructor(id, name, type, rarity, basePrice, icon = '📦') {
        this.id = id;
        this.name = name;
        this.type = type; // 'weapon', 'armor', 'consumable', 'material'
        this.rarity = rarity; // 'common', 'rare', 'epic', 'legendary'
        this.basePrice = basePrice;
        this.icon = icon;
        this.description = '';
    }

    getPrice() {
        return this.basePrice; // В будущем можно добавить скидки/наценки
    }
}

class Weapon extends Item {
    constructor(id, name, rarity, basePrice, stats, bonusStats = {}, icon = '⚔️') {
        super(id, name, 'weapon', rarity, basePrice, icon);
        this.damage = stats.damage || 0;
        this.range = stats.range || 1; // 1 - ближний бой, 2+ - дальний
        this.attackSpeed = stats.attackSpeed || 1.0;
        
        // +++ НОВОЕ: бонусные характеристики
        this.bonusStats = {
            strength: bonusStats.strength || 0,
            agility: bonusStats.agility || 0,
            intelligence: bonusStats.intelligence || 0,
            critChance: bonusStats.critChance || 0,
            critDamage: bonusStats.critDamage || 0
        };
        
        // Формируем расширенное описание
        let descParts = [`⚔️ Урон: ${this.damage}`, `🏹 Дальность: ${this.range}`, `⚡ Скорость: ${this.attackSpeed}`];
        
        // Добавляем бонусные статы в описание, если они есть
        if (this.bonusStats.strength > 0) descParts.push(`💪 Сила: +${this.bonusStats.strength}`);
        if (this.bonusStats.agility > 0) descParts.push(`🏃 Ловкость: +${this.bonusStats.agility}`);
        if (this.bonusStats.intelligence > 0) descParts.push(`🧠 Интеллект: +${this.bonusStats.intelligence}`);
        if (this.bonusStats.critChance > 0) descParts.push(`🎯 Крит: +${this.bonusStats.critChance}%`);
        if (this.bonusStats.critDamage > 0) descParts.push(`💥 Крит. урон: +${this.bonusStats.critDamage}%`);
        
        this.description = descParts.join(' | ');
    }
}

class Armor extends Item {
    constructor(id, name, rarity, basePrice, stats, bonusStats = {}, icon = '🛡️') {
        super(id, name, 'armor', rarity, basePrice, icon);
        this.defense = stats.defense || 0;
        this.bonusHp = stats.bonusHp || 0;
        
        // +++ НОВОЕ: бонусные характеристики
        this.bonusStats = {
            strength: bonusStats.strength || 0,
            agility: bonusStats.agility || 0,
            intelligence: bonusStats.intelligence || 0,
            resistance: bonusStats.resistance || 0,
            healthRegen: bonusStats.healthRegen || 0
        };
        
        // Формируем расширенное описание
        let descParts = [`🛡️ Защита: ${this.defense}`, `❤️ HP: +${this.bonusHp}`];
        
        // Добавляем бонусные статы в описание, если они есть
        if (this.bonusStats.strength > 0) descParts.push(`💪 Сила: +${this.bonusStats.strength}`);
        if (this.bonusStats.agility > 0) descParts.push(`🏃 Ловкость: +${this.bonusStats.agility}`);
        if (this.bonusStats.intelligence > 0) descParts.push(`🧠 Интеллект: +${this.bonusStats.intelligence}`);
        if (this.bonusStats.resistance > 0) descParts.push(`✨ Сопротивление: +${this.bonusStats.resistance}`);
        if (this.bonusStats.healthRegen > 0) descParts.push(`🔄 Регенерация: +${this.bonusStats.healthRegen}/ход`);
        
        this.description = descParts.join(' | ');
    }
}

class Consumable extends Item {
    constructor(id, name, rarity, basePrice, effect, value, icon = '🧪') {
        super(id, name, 'consumable', rarity, basePrice, icon);
        this.effect = effect; // 'heal', 'buff', 'resource'
        this.value = value;
        this.usableInBattle = true;
        
        // Улучшаем описание расходников
        const effectNames = {
            'heal': '❤️ Восстанавливает',
            'buff': '✨ Усиливает',
            'resource': '📦 Дает ресурсов'
        };
        this.description = `${effectNames[effect] || effect} ${value}`;
    }
}

class Material extends Item {
    constructor(id, name, rarity, basePrice, icon = '🔨') {
        super(id, name, 'material', rarity, basePrice, icon);
        
        // Разные иконки для разных материалов
        const materialIcons = {
            'wood': '🌲',
            'iron': '⛓️',
            'cloth': '🌯',
            'leather': '🧶',
            'herb': '🌿'
        };
        this.icon = materialIcons[name.split('_')[1]] || icon;
        this.description = '🧰 Используется для крафта';
    }
}

window.Item = Item;
window.Weapon = Weapon;
window.Armor = Armor;
window.Consumable = Consumable;
window.Material = Material;