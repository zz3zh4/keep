var gameData = {
    taskData: {},
    itemData: {},

    coins: 0,
    days: 365 * 14,
    evil: 0,
    paused: false,
    timeWarpingEnabled: true,

    rebirthOneCount: 0,
    rebirthTwoCount: 0,

    currentJob: null,
    currentSkill: null,
    currentProperty: null,
    currentMisc: null,
}

var tempData = {}

var skillWithLowestMaxXp = null

const autoPromoteElement = document.getElementById("autoPromote")
const autoLearnElement = document.getElementById("autoLearn")

const updateSpeed = 20

const baseLifespan = 365 * 70

const baseGameSpeed = 4

const permanentUnlocks = ["Scheduling", "Shop", "Automation", "Quick task display"]

const jobBaseData = {
    "Beggar": {name: "Beggar", maxXp: 50, income: 5},
    "Farmer": {name: "Farmer", maxXp: 100, income: 9},
    "Fisherman": {name: "Fisherman", maxXp: 200, income: 15},
    "Miner": {name: "Miner", maxXp: 400, income: 40},
    "Blacksmith": {name: "Blacksmith", maxXp: 800, income: 80},
    "Merchant": {name: "Merchant", maxXp: 1600, income: 150},

    "Squire": {name: "Squire", maxXp: 100, income: 5},
    "Footman": {name: "Footman", maxXp: 1000, income: 50},
    "Veteran footman": {name: "Veteran footman", maxXp: 10000, income: 120},
    "Knight": {name: "Knight", maxXp: 100000, income: 300},
    "Veteran knight": {name: "Veteran knight", maxXp: 1000000, income: 1000},
    "Elite knight": {name: "Elite knight", maxXp: 7500000, income: 3000},
    "Holy knight": {name: "Holy knight", maxXp: 40000000, income: 15000},
    "Legendary knight": {name: "Legendary knight", maxXp: 150000000, income: 50000},

    "Student": {name: "Student", maxXp: 100000, income: 100},
    "Apprentice mage": {name: "Apprentice mage", maxXp: 1000000, income: 1000},
    "Mage": {name: "Mage", maxXp: 10000000, income: 7500},
    "Wizard": {name: "Wizard", maxXp: 100000000, income: 50000},
    "Master wizard": {name: "Master wizard", maxXp: 10000000000, income: 250000},
    "Chairman": {name: "Chairman", maxXp: 1000000000000, income: 1000000},
}

const skillBaseData = {
    "Concentration": {name: "Concentration", maxXp: 100, effect: 0.01, description: "Skill xp"},
    "Productivity": {name: "Productivity", maxXp: 100, effect: 0.01, description: "Job xp"},
    "Bargaining": {name: "Bargaining", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Meditation": {name: "Meditation", maxXp: 100, effect: 0.01, description: "Happiness"},

    "Strength": {name: "Strength", maxXp: 100, effect: 0.01, description: "Military pay"},
    "Battle tactics": {name: "Battle tactics", maxXp: 100, effect: 0.01, description: "Military xp"},
    "Muscle memory": {name: "Muscle memory", maxXp: 100, effect: 0.01, description: "Strength xp"},

    "Mana control": {name: "Mana control", maxXp: 100, effect: 0.01, description: "T.A.A. xp"},
    "Immortality": {name: "Immortality", maxXp: 100, effect: 0.01, description: "Longer lifespan"},
    "Time warping": {name: "Time warping", maxXp: 100, effect: 0.01, description: "Gamespeed"},
    "Super immortality": {name: "Super immortality", maxXp: 100, effect: 0.01, description: "Longer lifespan"},

    "Dark influence": {name: "Dark influence", maxXp: 100, effect: 0.01, description: "All xp"},
    "Evil control": {name: "Evil control", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Intimidation": {name: "Intimidation", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Demon training": {name: "Demon training", maxXp: 100, effect: 0.01, description: "All xp"},
    "Blood meditation": {name: "Blood meditation", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Demon's wealth": {name: "Demon's wealth", maxXp: 100, effect: 0.002, description: "Job pay"},
    
}

const itemBaseData = {
    "Homeless": {name: "Homeless", expense: 0, effect: 1},
    "Tent": {name: "Tent", expense: 15, effect: 1.4},
    "Wooden hut": {name: "Wooden hut", expense: 100, effect: 2},
    "Cottage": {name: "Cottage", expense: 750, effect: 3.5},
    "House": {name: "House", expense: 3000, effect: 6},
    "Large house": {name: "Large house", expense: 25000, effect: 12},
    "Small palace": {name: "Small palace", expense: 300000, effect: 25},
    "Grand palace": {name: "Grand palace", expense: 5000000, effect: 60},

    "Book": {name: "Book", expense: 10, effect: 1.5, description: "Skill xp"},
    "Dumbbells": {name: "Dumbbells", expense: 50, effect: 1.5, description: "Strength xp"},
    "Personal squire": {name: "Personal squire", expense: 200, effect: 2, description: "Job xp"},
    "Steel longsword": {name: "Steel longsword", expense: 1000, effect: 2, description: "Military xp"},
    "Butler": {name: "Butler", expense: 7500, effect: 1.5, description: "Happiness"},
    "Sapphire charm": {name: "Sapphire charm", expense: 50000, effect: 3, description: "Magic xp"},
    "Study desk": {name: "Study desk", expense: 1000000, effect: 2, description: "Skill xp"},
    "Library": {name: "Library", expense: 10000000, effect: 1.5, description: "Skill xp"},
}

const jobCategories = {
    "Common work": ["Beggar", "Farmer", "Fisherman", "Miner", "Blacksmith", "Merchant"],
    "Military" : ["Squire", "Footman", "Veteran footman", "Knight", "Veteran knight", "Elite knight", "Holy knight", "Legendary knight"],
    "The Arcane Association" : ["Student", "Apprentice mage", "Mage", "Wizard", "Master wizard", "Chairman"]
}

const skillCategories = {
    "Fundamentals": ["Concentration", "Productivity", "Bargaining", "Meditation"],
    "Combat": ["Strength", "Battle tactics", "Muscle memory"],
    "Magic": ["Mana control", "Immortality", "Time warping", "Super immortality"],
    "Dark magic": ["Dark influence", "Evil control", "Intimidation", "Demon training", "Blood meditation", "Demon's wealth"]
}

const itemCategories = {
    "Properties": ["Homeless", "Tent", "Wooden hut", "Cottage", "House", "Large house", "Small palace", "Grand palace"],
    "Misc": ["Book", "Dumbbells", "Personal squire", "Steel longsword", "Butler", "Sapphire charm", "Study desk", "Library"]
}

const headerRowColors = {
    "Common work": "#55a630",
    "Military": "#e63946",
    "The Arcane Association": "#C71585",
    "Fundamentals": "#4a4e69",
    "Combat": "#ff704d",
    "Magic": "#875F9A",
    "Dark magic": "#73000f",
    "Properties": "#219ebc",
    "Misc": "#b56576",
}

const tooltips = {
    "Beggar": "为了几枚铜币日夜挣扎.感觉你每天都处在死亡的边缘. ",
    "Farmer": "犁地,种庄稼.虽然这工作收入不多,但很正经.",
    "Fisherman": "钓上各种各样的鱼,然后把它们卖掉.一份轻松但收入微薄的工作.",
    "Miner": "深入危险的洞穴,开采有价值的矿石.与所涉及的风险相比,报酬是相当少的.",
    "Blacksmith": "为军队冶炼矿石,精心锻造武器.一份体面的,报酬不错的普通工作.",
    "Merchant": "从一个城镇到另一个城镇,以物易物.这份工作报酬不错,而且不需要太多的体力劳动.",

    "Squire": "在战场上随身携带骑士的盾牌和剑.工资很低,但工作经验很有价值.",
    "Footman": "放下你的生命与敌人的士兵战斗.一份勇敢,体面的工作,但你在宏大的计划中仍然一文不值.",
    "Veteran footman": "比一般步兵更有经验,更有用,用你的力量干掉敌人.薪水还不错.",
    "Knight": "从头到脚都裹着钢铁,轻松地刺穿敌军士兵.一份报酬丰厚,非常体面的工作. ",
    "Veteran knight": "利用你无与伦比的战斗能力,毫不费力地屠杀敌人.军队里的大多数步兵都不可能得到这样一份报酬优厚的工作.",
    "Elite knight": "装备最精良装备的情况,以非凡的熟练程度一举歼灭敌军中队.这样一支在战场上令人畏惧的部队,报酬是非常丰厚的.",
    "Holy knight": "用你的魔法之刃在几秒钟内摧毁整个军队.为数不多的精英骑士获得了这一级别的力量,他们得到了大量的报酬.",
    "Legendary knight": "让全世界都感到恐惧,拥有毁灭整个国家的力量.大约每个世纪,只有一位圣骑士配得上这样一个受人尊敬的头衔.",

    "Student": "学习法力理论,练习基本咒语.有少量的生活费用,这是成为法师的必要阶段.",
    "Apprentice mage": "在法师的指导下,在战斗中对敌人施展基本法术.将提供相当数量的工资以支付生活费用.",
    "Mage": "通过施放中间法术和指导其他学徒来扭转战斗的趋势.这份工作的报酬非常高.",
    "Wizard": "使用高级法术来蹂躏和摧毁整个军团的敌军士兵.只有一小部分法师有资格获得这个职位,并且得到了高得离谱的报酬.",
    "Master wizard": "拥有无与伦比的天赋,可以随心所欲地施展难以置信的法术.据说巫师大师拥有足够的破坏力,足以将一个帝国从地图上抹去.",
    "Chairman": "花费你的时间管理奥术协会以及研究真正不朽的概念.贤者每天收到的薪水少得可笑.",

    "Concentration": "通过练习集中注意力的活动来提高你的学习速度.",
    "Productivity": "学会在工作中减少拖延,每天积累更多的工作经验.",
    "Bargaining": "学习交易技巧和说服技巧来降低任何类型的费用.",
    "Meditation": "让你的头脑充满和平与安宁,从内心发掘更大的幸福. ",

    "Strength": "通过艰苦的训练来调节你的身体和力量.更强壮的人在军队中得到更多的报酬.",
    "Battle tactics": "制定和修改作战策略,提高军事经验.",
    "Muscle memory": "通过习惯和重复来强化你的神经元,提高全身的力量增益.",

    "Mana control": "加强你全身的法力通道,帮助你成为一个更强大的魔法使用者.",
    "Immortality": "通过魔法延长你的寿命。然而，这真的是你所追求的不朽吗?",
    "Time warping": "通过被禁止的技术弯曲空间和时间,导致更快的游戏速度.",
    "Super immortality": "通过利用古老的,被禁止的技术,将你的寿命大大延长到无法理解的程度.",

    "Dark influence": "用邪恶赋予你的强大力量包围你自己,让你轻松地接受和吸收任何工作或技能.",
    "Evil control": "驯服你内心肆虐和成长的邪恶,在重生之间提高邪恶的收益.",
    "Intimidation": "学会散发一种恶魔般的光环,让其他商人极度恐惧,迫使他们给你大打折扣.",
    "Demon training": "仅仅是人的身体就太软弱无力,无法抵挡邪恶.用禁止的方法训练,慢慢变成一个能够快速吸收知识的恶魔.",
    "Blood meditation": "通过对其他生物的亵渎来培育和培养你内心的邪恶,极大地增加邪恶的收益.",
    "Demon's wealth": "通过黑魔法的手段,将你从工作中得到的金钱加倍. ",

    "Homeless": "睡在不舒服,肮脏的街道上,每天晚上几乎冻死.不会比这更糟了.",
    "Tent": "一张由两根软弱的木棒托着的破布.生活条件很糟糕,但至少你有个栖身之所.",
    "Wooden hut": "破烂的原木和肮脏的干草和马粪粘在一起.虽然比帐篷坚固多了,但是臭气也不太好闻.",
    "Cottage": "用木框架和茅草屋顶建造的.以公平的价格提供体面的生活条件.",
    "House": "用石头,砖和坚固的木材建造的建筑,里面有几个房间.虽然很贵,但这是一个舒适的住所.",
    "Large house": "比普通的房子大得多,有更多的房间和多层.这栋建筑很宽敞,但价格不菲.",
    "Small palace": "一种非常丰富和精心建造的结构,用银等精细金属镶边.奢侈的生活方式需要花费极高的费用.",
    "Grand palace": "完全由金和银组成的豪华住宅.以荒唐的价格提供尽可能豪华舒适的生活条件.",

    "Book": "一个写下你所有的想法和发现的东西,让你更快地学习.",
    "Dumbbells": "在剧烈运动中用来比以前更快地增强和积累力量的重型工具. ",
    "Personal squire": "协助您完成日常活动,让您有更多时间在工作中发挥效率.",
    "Steel longsword": "用来在战斗中更快地杀死敌人从而获得更多经验的一把精致的剑.",
    "Butler": "时刻保持家里清洁,每天还准备三顿美味的饭菜,让你心情更愉快,没有压力.",
    "Sapphire charm": "镶嵌着稀有蓝宝石,这个护符激活你体内更多的法力通道,让你更容易学会魔法.",
    "Study desk": "一个专门的区域,提供了许多精致的文具和设备设计,以促进您的研究进展.",
    "Library": "储存了大量的书籍,每一本都包含了大量的信息,从基本的生活技能到复杂的魔法咒语.",
}

const units = ["", "k", "M", "B", "T", "q", "Q", "Sx", "Sp", "Oc"];

const jobTabButton = document.getElementById("jobTabButton")

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
  
function getBindedTaskEffect(taskName) {
    var task = gameData.taskData[taskName]
    return task.getEffect.bind(task)
}

function getBindedItemEffect(itemName) {
    var item = gameData.itemData[itemName]
    return item.getEffect.bind(item)
}

function addMultipliers() {
    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]

        task.xpMultipliers = []
        if (task instanceof Job) task.incomeMultipliers = []

        task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task))
        task.xpMultipliers.push(getHappiness)
        task.xpMultipliers.push(getBindedTaskEffect("Dark influence"))
        task.xpMultipliers.push(getBindedTaskEffect("Demon training"))

        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task))
            task.incomeMultipliers.push(getBindedTaskEffect("Demon's wealth"))
            task.xpMultipliers.push(getBindedTaskEffect("Productivity"))
            task.xpMultipliers.push(getBindedItemEffect("Personal squire"))    
        } else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect("Concentration"))
            task.xpMultipliers.push(getBindedItemEffect("Book"))
            task.xpMultipliers.push(getBindedItemEffect("Study desk"))
            task.xpMultipliers.push(getBindedItemEffect("Library"))
        }

        if (jobCategories["Military"].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect("Strength"))
            task.xpMultipliers.push(getBindedTaskEffect("Battle tactics"))
            task.xpMultipliers.push(getBindedItemEffect("Steel longsword"))
        } else if (task.name == "Strength") {
            task.xpMultipliers.push(getBindedTaskEffect("Muscle memory"))
            task.xpMultipliers.push(getBindedItemEffect("Dumbbells"))
        } else if (skillCategories["Magic"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Sapphire charm"))
        } else if (jobCategories["The Arcane Association"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Mana control"))
        } else if (skillCategories["Dark magic"].includes(task.name)) {
            task.xpMultipliers.push(getEvil)
        }
    }

    for (itemName in gameData.itemData) {
        var item = gameData.itemData[itemName]
        item.expenseMultipliers = []
        item.expenseMultipliers.push(getBindedTaskEffect("Bargaining"))
        item.expenseMultipliers.push(getBindedTaskEffect("Intimidation"))
    }
}

function setCustomEffects() {
    var bargaining = gameData.taskData["Bargaining"]
    bargaining.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, bargaining.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var intimidation = gameData.taskData["Intimidation"]
    intimidation.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, intimidation.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var timeWarping = gameData.taskData["Time warping"]
    timeWarping.getEffect = function() {
        var multiplier = 1 + getBaseLog(13, timeWarping.level + 1) 
        return multiplier
    }

    var immortality = gameData.taskData["Immortality"]
    immortality.getEffect = function() {
        var multiplier = 1 + getBaseLog(33, immortality.level + 1) 
        return multiplier
    }
}

function getHappiness() {
    var meditationEffect = getBindedTaskEffect("Meditation")
    var butlerEffect = getBindedItemEffect("Butler")
    var happiness = meditationEffect() * butlerEffect() * gameData.currentProperty.getEffect()
    return happiness
}

function getEvil() {
    return gameData.evil
}

function applyMultipliers(value, multipliers) {
    var finalMultiplier = 1
    multipliers.forEach(function(multiplierFunction) {
        var multiplier = multiplierFunction()
        finalMultiplier *= multiplier
    })
    var finalValue = Math.round(value * finalMultiplier)
    return finalValue
}

function applySpeed(value) {
    finalValue = value * getGameSpeed() / updateSpeed
    return finalValue
}

function getEvilGain() {
    var evilControl = gameData.taskData["Evil control"]
    var bloodMeditation = gameData.taskData["Blood meditation"]
    var evil = evilControl.getEffect() * bloodMeditation.getEffect()
    return evil
}

function getGameSpeed() {
    var timeWarping = gameData.taskData["Time warping"]
    var timeWarpingSpeed = gameData.timeWarpingEnabled ? timeWarping.getEffect() : 1
    var gameSpeed = baseGameSpeed * +!gameData.paused * +isAlive() * timeWarpingSpeed
    return gameSpeed
}

function applyExpenses() {
    var coins = applySpeed(getExpense())
    gameData.coins -= coins
    if (gameData.coins < 0) {    
        goBankrupt()
    }
}

function getExpense() {
    var expense = 0
    expense += gameData.currentProperty.getExpense()
    for (misc of gameData.currentMisc) {
        expense += misc.getExpense()
    }
    return expense
}

function goBankrupt() {
    gameData.coins = 0
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
}

function setTab(element, selectedTab) {

    var tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"))
    tabs.forEach(function(tab) {
        tab.style.display = "none"
    })
    document.getElementById(selectedTab).style.display = "block"

    var tabButtons = document.getElementsByClassName("tabButton")
    for (tabButton of tabButtons) {
        tabButton.classList.remove("w3-blue-gray")
    }
    element.classList.add("w3-blue-gray")
}

function setPause() {
    gameData.paused = !gameData.paused
}

function setTimeWarping() {
    gameData.timeWarpingEnabled = !gameData.timeWarpingEnabled
}

function setTask(taskName) {
    var task = gameData.taskData[taskName]
    task instanceof Job ? gameData.currentJob = task : gameData.currentSkill = task
}

function setProperty(propertyName) {
    var property = gameData.itemData[propertyName]
    gameData.currentProperty = property
}

function setMisc(miscName) {
    var misc = gameData.itemData[miscName]
    if (gameData.currentMisc.includes(misc)) {
        for (i = 0; i < gameData.currentMisc.length; i++) {
            if (gameData.currentMisc[i] == misc) {
                gameData.currentMisc.splice(i, 1)
            }
        }
    } else {
        gameData.currentMisc.push(misc)
    }
}

function createData(data, baseData) {
    for (key in baseData) {
        var entity = baseData[key]
        createEntity(data, entity)
    }
}

function createEntity(data, entity) {
    if ("income" in entity) {data[entity.name] = new Job(entity)}
    else if ("maxXp" in entity) {data[entity.name] = new Skill(entity)}
    else {data[entity.name] = new Item(entity)}
    data[entity.name].id = "row " + entity.name
}

function createRequiredRow(categoryName) {
    var requiredRow = document.getElementsByClassName("requiredRowTemplate")[0].content.firstElementChild.cloneNode(true)
    requiredRow.classList.add("requiredRow")
    requiredRow.classList.add(removeSpaces(categoryName))
    requiredRow.id = categoryName
    return requiredRow
}

function createHeaderRow(templates, categoryType, categoryName) {
    var headerRow = templates.headerRow.content.firstElementChild.cloneNode(true)
    headerRow.getElementsByClassName("category")[0].textContent = categoryName
    if (categoryType != itemCategories) {
        headerRow.getElementsByClassName("valueType")[0].textContent = categoryType == jobCategories ? "Income/day" : "Effect"
    }

    headerRow.style.backgroundColor = headerRowColors[categoryName]
    headerRow.style.color = "#ffffff"
    headerRow.classList.add(removeSpaces(categoryName))
    headerRow.classList.add("headerRow")
    
    return headerRow
}

function createRow(templates, name, categoryName, categoryType) {
    var row = templates.row.content.firstElementChild.cloneNode(true)
    row.getElementsByClassName("name")[0].textContent = name
    row.getElementsByClassName("tooltipText")[0].textContent = tooltips[name]
    row.id = "row " + name
    if (categoryType != itemCategories) {
        row.getElementsByClassName("progressBar")[0].onclick = function() {setTask(name)}
    } else {
        row.getElementsByClassName("button")[0].onclick = categoryName == "Properties" ? function() {setProperty(name)} : function() {setMisc(name)}
    }

    return row
}

function createAllRows(categoryType, tableId) {
    var templates = {
        headerRow: document.getElementsByClassName(categoryType == itemCategories ? "headerRowItemTemplate" : "headerRowTaskTemplate")[0],
        row: document.getElementsByClassName(categoryType == itemCategories ? "rowItemTemplate" : "rowTaskTemplate")[0],
    }

    var table = document.getElementById(tableId)

    for (categoryName in categoryType) {
        var headerRow = createHeaderRow(templates, categoryType, categoryName)
        table.appendChild(headerRow)
        
        var category = categoryType[categoryName]
        category.forEach(function(name) {
            var row = createRow(templates, name, categoryName, categoryType)
            table.appendChild(row)       
        })

        var requiredRow = createRequiredRow(categoryName)
        table.append(requiredRow)
    }
}

function updateQuickTaskDisplay(taskType) {
    var currentTask = taskType == "job" ? gameData.currentJob : gameData.currentSkill
    var quickTaskDisplayElement = document.getElementById("quickTaskDisplay")
    var progressBar = quickTaskDisplayElement.getElementsByClassName(taskType)[0]
    progressBar.getElementsByClassName("name")[0].textContent = currentTask.name + " lvl " + currentTask.level
    progressBar.getElementsByClassName("progressFill")[0].style.width = currentTask.xp / currentTask.getMaxXp() * 100 + "%"
}

function updateRequiredRows(data, categoryType) {
    var requiredRows = document.getElementsByClassName("requiredRow")
    for (requiredRow of requiredRows) {
        var nextEntity = null
        var category = categoryType[requiredRow.id] 
        if (category == null) {continue}
        for (i = 0; i < category.length; i++) {
            var entityName = category[i]
            if (i >= category.length - 1) break
            var requirements = gameData.requirements[entityName]
            if (requirements && i == 0) {
                if (!requirements.isCompleted()) {
                    nextEntity = data[entityName]
                    break
                }
            }

            var nextIndex = i + 1
            if (nextIndex >= category.length) {break}
            var nextEntityName = category[nextIndex]
            nextEntityRequirements = gameData.requirements[nextEntityName]

            if (!nextEntityRequirements.isCompleted()) {
                nextEntity = data[nextEntityName]
                break
            }       
        }

        if (nextEntity == null) {
            requiredRow.classList.add("hiddenTask")           
        } else {
            requiredRow.classList.remove("hiddenTask")
            var requirementObject = gameData.requirements[nextEntity.name]
            var requirements = requirementObject.requirements

            var coinElement = requiredRow.getElementsByClassName("coins")[0]
            var levelElement = requiredRow.getElementsByClassName("levels")[0]
            var evilElement = requiredRow.getElementsByClassName("evil")[0]

            coinElement.classList.add("hiddenTask")
            levelElement.classList.add("hiddenTask")
            evilElement.classList.add("hiddenTask")

            var finalText = ""
            if (data == gameData.taskData) {
                if (requirementObject instanceof EvilRequirement) {
                    evilElement.classList.remove("hiddenTask")
                    evilElement.textContent = format(requirements[0].requirement) + " evil"
                } else {
                    levelElement.classList.remove("hiddenTask")
                    for (requirement of requirements) {
                        var task = gameData.taskData[requirement.task]
                        if (task.level >= requirement.requirement) continue
                        var text = " " + requirement.task + " level " + format(task.level) + "/" + format(requirement.requirement) + ","
                        finalText += text
                    }
                    finalText = finalText.substring(0, finalText.length - 1)
                    levelElement.textContent = finalText
                }
            } else if (data == gameData.itemData) {
                coinElement.classList.remove("hiddenTask")
                formatCoins(requirements[0].requirement, coinElement)
            }
        }   
    }
}

function updateTaskRows() {
    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        var row = document.getElementById("row " + task.name)
        row.getElementsByClassName("level")[0].textContent = task.level
        row.getElementsByClassName("xpGain")[0].textContent = format(task.getXpGain())
        row.getElementsByClassName("xpLeft")[0].textContent = format(task.getXpLeft())

        var maxLevel = row.getElementsByClassName("maxLevel")[0]
        maxLevel.textContent = task.maxLevel
        gameData.rebirthOneCount > 0 ? maxLevel.classList.remove("hidden") : maxLevel.classList.add("hidden")

        var progressFill = row.getElementsByClassName("progressFill")[0]
        progressFill.style.width = task.xp / task.getMaxXp() * 100 + "%"
        task == gameData.currentJob || task == gameData.currentSkill ? progressFill.classList.add("current") : progressFill.classList.remove("current")

        var valueElement = row.getElementsByClassName("value")[0]
        valueElement.getElementsByClassName("income")[0].style.display = task instanceof Job
        valueElement.getElementsByClassName("effect")[0].style.display = task instanceof Skill

        var skipSkillElement = row.getElementsByClassName("skipSkill")[0]
        skipSkillElement.style.display = task instanceof Skill && autoLearnElement.checked ? "block" : "none"

        if (task instanceof Job) {
            formatCoins(task.getIncome(), valueElement.getElementsByClassName("income")[0])
        } else {
            valueElement.getElementsByClassName("effect")[0].textContent = task.getEffectDescription()
        }
    }
}

function updateItemRows() {
    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        var row = document.getElementById("row " + item.name)
        var button = row.getElementsByClassName("button")[0]
        button.disabled = gameData.coins < item.getExpense()
        var active = row.getElementsByClassName("active")[0]
        var color = itemCategories["Properties"].includes(item.name) ? headerRowColors["Properties"] : headerRowColors["Misc"]
        active.style.backgroundColor = gameData.currentMisc.includes(item) || item == gameData.currentProperty ? color : "white"
        row.getElementsByClassName("effect")[0].textContent = item.getEffectDescription()
        formatCoins(item.getExpense(), row.getElementsByClassName("expense")[0])
    }
}

function updateHeaderRows(categories) {
    for (categoryName in categories) {
        var className = removeSpaces(categoryName)
        var headerRow = document.getElementsByClassName(className)[0]
        var maxLevelElement = headerRow.getElementsByClassName("maxLevel")[0]
        gameData.rebirthOneCount > 0 ? maxLevelElement.classList.remove("hidden") : maxLevelElement.classList.add("hidden")
        var skipSkillElement = headerRow.getElementsByClassName("skipSkill")[0]
        skipSkillElement.style.display = categories == skillCategories && autoLearnElement.checked ? "block" : "none"
    }
}

function updateText() {
    //Sidebar
    document.getElementById("ageDisplay").textContent = daysToYears(gameData.days)
    document.getElementById("dayDisplay").textContent = getDay()
    document.getElementById("lifespanDisplay").textContent = daysToYears(getLifespan())
    document.getElementById("pauseButton").textContent = gameData.paused ? "Play" : "Pause"

    formatCoins(gameData.coins, document.getElementById("coinDisplay"))
    setSignDisplay()
    formatCoins(getNet(), document.getElementById("netDisplay"))
    formatCoins(getIncome(), document.getElementById("incomeDisplay"))
    formatCoins(getExpense(), document.getElementById("expenseDisplay"))

    document.getElementById("happinessDisplay").textContent = getHappiness().toFixed(1)

    document.getElementById("evilDisplay").textContent = gameData.evil.toFixed(1)
    document.getElementById("evilGainDisplay").textContent = getEvilGain().toFixed(1)

    document.getElementById("timeWarpingDisplay").textContent = "x" + gameData.taskData["Time warping"].getEffect().toFixed(2)
    document.getElementById("timeWarpingButton").textContent = gameData.timeWarpingEnabled ? "Disable warp" : "Enable warp"
}

function setSignDisplay() {
    var signDisplay = document.getElementById("signDisplay")
    if (getIncome() > getExpense()) {
        signDisplay.textContent = "+"
        signDisplay.style.color = "green"
    } else if (getExpense() > getIncome()) {
        signDisplay.textContent = "-"
        signDisplay.style.color = "red"
    } else {
        signDisplay.textContent = ""
        signDisplay.style.color = "gray"
    }
}

function getNet() {
    var net = Math.abs(getIncome() - getExpense())
    return net
}

function hideEntities() {
    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        var completed = requirement.isCompleted()
        for (element of requirement.elements) {
            if (completed) {
                element.classList.remove("hidden")
            } else {
                element.classList.add("hidden")
            }
        }
    }
}

function createItemData(baseData) {
    for (var item of baseData) {
        gameData.itemData[item.name] = "happiness" in item ? new Property(task) : new Misc(task)
        gameData.itemData[item.name].id = "item " + item.name
    }
}

function doCurrentTask(task) {
    task.increaseXp()
    if (task instanceof Job) {
        increaseCoins()
    }
}

function getIncome() {
    var income = 0
    income += gameData.currentJob.getIncome()
    return income
}

function increaseCoins() {
    var coins = applySpeed(getIncome())
    gameData.coins += coins
}

function daysToYears(days) {
    var years = Math.floor(days / 365)
    return years
}

function getCategoryFromEntityName(categoryType, entityName) {
    for (categoryName in categoryType) {
        var category = categoryType[categoryName]
        if (category.includes(entityName)) {
            return category
        }
    }
}

function getNextEntity(data, categoryType, entityName) {
    var category = getCategoryFromEntityName(categoryType, entityName)
    var nextIndex = category.indexOf(entityName) + 1
    if (nextIndex > category.length - 1) return null
    var nextEntityName = category[nextIndex]
    var nextEntity = data[nextEntityName]
    return nextEntity
}

function autoPromote() {
    if (!autoPromoteElement.checked) return
    var nextEntity = getNextEntity(gameData.taskData, jobCategories, gameData.currentJob.name)
    if (nextEntity == null) return
    var requirement = gameData.requirements[nextEntity.name]
    if (requirement.isCompleted()) gameData.currentJob = nextEntity
}

function checkSkillSkipped(skill) {
    var row = document.getElementById("row " + skill.name)
    var isSkillSkipped = row.getElementsByClassName("checkbox")[0].checked
    return isSkillSkipped
}

function setSkillWithLowestMaxXp() {
    var xpDict = {}

    for (skillName in gameData.taskData) {
        var skill = gameData.taskData[skillName]
        var requirement = gameData.requirements[skillName]
        if (skill instanceof Skill && requirement.isCompleted() && !checkSkillSkipped(skill)) {
            xpDict[skill.name] = skill.level //skill.getMaxXp() / skill.getXpGain()
        }
    }

    if (xpDict == {}) {
        skillWithLowestMaxXp = gameData.taskData["Concentration"]
        return
    }

    var skillName = getKeyOfLowestValueFromDict(xpDict)
    skillWithLowestMaxXp = gameData.taskData[skillName]
}

function getKeyOfLowestValueFromDict(dict) {
    var values = []
    for (key in dict) {
        var value = dict[key]
        values.push(value)
    }

    values.sort(function(a, b){return a - b})

    for (key in dict) {
        var value = dict[key]
        if (value == values[0]) {
            return key
        }
    }
}

function autoLearn() {
    if (!autoLearnElement.checked || !skillWithLowestMaxXp) return
    gameData.currentSkill = skillWithLowestMaxXp
}

function yearsToDays(years) {
    var days = years * 365
    return days
}
 
function getDay() {
    var day = Math.floor(gameData.days - daysToYears(gameData.days) * 365)
    return day
}

function increaseDays() {
    var increase = applySpeed(1)
    gameData.days += increase
}

function format(number) {

    // what tier? (determines SI symbol)
    var tier = Math.log10(number) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = units[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}

function formatCoins(coins, element) {
    var tiers = ["p", "g", "s"]
    var colors = {
        "p": "#79b9c7",
        "g": "#E5C100",
        "s": "#a8a8a8",
        "c": "#a15c2f"
    }
    var leftOver = coins
    var i = 0
    for (tier of tiers) {
        var x = Math.floor(leftOver / Math.pow(10, (tiers.length - i) * 2))
        var leftOver = Math.floor(leftOver - x * Math.pow(10, (tiers.length - i) * 2))
        var text = format(String(x)) + tier + " "
        element.children[i].textContent = x > 0 ? text : ""
        element.children[i].style.color = colors[tier]
        i += 1
    }
    if (leftOver == 0 && coins > 0) {element.children[3].textContent = ""; return}
    var text = String(Math.floor(leftOver)) + "c"
    element.children[3].textContent = text
    element.children[3].style.color = colors["c"]
}

function getTaskElement(taskName) {
    var task = gameData.taskData[taskName]
    var element = document.getElementById(task.id)
    return element
}

function getItemElement(itemName) {
    var item = gameData.itemData[itemName]
    var element = document.getElementById(item.id)
    return element
}

function getElementsByClass(className) {
    var elements = document.getElementsByClassName(removeSpaces(className))
    return elements
}

function setLightDarkMode() {
    var body = document.getElementById("body")
    body.classList.contains("dark") ? body.classList.remove("dark") : body.classList.add("dark")
}

function removeSpaces(string) {
    var string = string.replace(/ /g, "")
    return string
}

function rebirthOne() {
    gameData.rebirthOneCount += 1

    rebirthReset()
}

function rebirthTwo() {
    gameData.rebirthTwoCount += 1
    gameData.evil += getEvilGain()

    rebirthReset()

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        task.maxLevel = 0
    }    
}

function rebirthReset() {
    setTab(jobTabButton, "jobs")

    gameData.coins = 0
    gameData.days = 365 * 14
    gameData.currentJob = gameData.taskData["Beggar"]
    gameData.currentSkill = gameData.taskData["Concentration"]
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        if (task.level > task.maxLevel) task.maxLevel = task.level
        task.level = 0
        task.xp = 0
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.completed && permanentUnlocks.includes(key)) continue
        requirement.completed = false
    }
}

function getLifespan() {
    var immortality = gameData.taskData["Immortality"]
    var superImmortality = gameData.taskData["Super immortality"]
    var lifespan = baseLifespan * immortality.getEffect() * superImmortality.getEffect()
    return lifespan
}

function isAlive() {
    var condition = gameData.days < getLifespan()
    var deathText = document.getElementById("deathText")
    if (!condition) {
        gameData.days = getLifespan()
        deathText.classList.remove("hidden")
    }
    else {
        deathText.classList.add("hidden")
    }
    return condition
}

function assignMethods() {

    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        if (task.baseData.income) {
            task.baseData = jobBaseData[task.name]
            task = Object.assign(new Job(jobBaseData[task.name]), task)
            
        } else {
            task.baseData = skillBaseData[task.name]
            task = Object.assign(new Skill(skillBaseData[task.name]), task)
        } 
        gameData.taskData[key] = task
    }

    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        item.baseData = itemBaseData[item.name]
        item = Object.assign(new Item(itemBaseData[item.name]), item)
        gameData.itemData[key] = item
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.type == "task") {
            requirement = Object.assign(new TaskRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "coins") {
            requirement = Object.assign(new CoinRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "age") {
            requirement = Object.assign(new AgeRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "evil") {
            requirement = Object.assign(new EvilRequirement(requirement.elements, requirement.requirements), requirement)
        }

        var tempRequirement = tempData["requirements"][key]
        requirement.elements = tempRequirement.elements
        requirement.requirements = tempRequirement.requirements
        gameData.requirements[key] = requirement
    }

    gameData.currentJob = gameData.taskData[gameData.currentJob.name]
    gameData.currentSkill = gameData.taskData[gameData.currentSkill.name]
    gameData.currentProperty = gameData.itemData[gameData.currentProperty.name]
    var newArray = []
    for (misc of gameData.currentMisc) {
        newArray.push(gameData.itemData[misc.name])
    }
    gameData.currentMisc = newArray
}

function replaceSaveDict(dict, saveDict) {
    for (key in dict) {
        if (!(key in saveDict)) {
            saveDict[key] = dict[key]
        } else if (dict == gameData.requirements) {
            if (saveDict[key].type != tempData["requirements"][key].type) {
                saveDict[key] = tempData["requirements"][key]
            }
        }
    }

    for (key in saveDict) {
        if (!(key in dict)) {
            delete saveDict[key]
        }
    }
}

function saveGameData() {
    localStorage.setItem("gameDataSave", JSON.stringify(gameData))
}

function loadGameData() {
    var gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"))

    if (gameDataSave !== null) {
        replaceSaveDict(gameData, gameDataSave)
        replaceSaveDict(gameData.requirements, gameDataSave.requirements)
        replaceSaveDict(gameData.taskData, gameDataSave.taskData)
        replaceSaveDict(gameData.itemData, gameDataSave.itemData)

        gameData = gameDataSave
    }

    assignMethods()
}

function updateUI() {
    updateTaskRows()
    updateItemRows()
    updateRequiredRows(gameData.taskData, jobCategories)
    updateRequiredRows(gameData.taskData, skillCategories)
    updateRequiredRows(gameData.itemData, itemCategories)
    updateHeaderRows(jobCategories)
    updateHeaderRows(skillCategories)
    updateQuickTaskDisplay("job")
    updateQuickTaskDisplay("skill")
    hideEntities()
    updateText()  
}

function update() {
    increaseDays()
    autoPromote()
    autoLearn()
    doCurrentTask(gameData.currentJob)
    doCurrentTask(gameData.currentSkill)
    applyExpenses()
    updateUI()
}

function resetGameData() {
    localStorage.clear()
    location.reload()
}

function importGameData() {
    var importExportBox = document.getElementById("importExportBox")
    var data = JSON.parse(window.atob(importExportBox.value))
    gameData = data
    saveGameData()
    location.reload()
}

function exportGameData() {
    var importExportBox = document.getElementById("importExportBox")
    importExportBox.value = window.btoa(JSON.stringify(gameData))
}

//Init

createAllRows(jobCategories, "jobTable")
createAllRows(skillCategories, "skillTable")
createAllRows(itemCategories, "itemTable") 

createData(gameData.taskData, jobBaseData)
createData(gameData.taskData, skillBaseData)
createData(gameData.itemData, itemBaseData) 

gameData.currentJob = gameData.taskData["Beggar"]
gameData.currentSkill = gameData.taskData["Concentration"]
gameData.currentProperty = gameData.itemData["Homeless"]
gameData.currentMisc = []

gameData.requirements = {
    //Other
    "The Arcane Association": new TaskRequirement(getElementsByClass("The Arcane Association"), [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Dark magic": new EvilRequirement(getElementsByClass("Dark magic"), [{requirement: 1}]),
    "Shop": new CoinRequirement([document.getElementById("shopTabButton")], [{requirement: gameData.itemData["Tent"].getExpense() * 50}]),
    "Rebirth tab": new AgeRequirement([document.getElementById("rebirthTabButton")], [{requirement: 25}]),
    "Rebirth note 1": new AgeRequirement([document.getElementById("rebirthNote1")], [{requirement: 45}]),
    "Rebirth note 2": new AgeRequirement([document.getElementById("rebirthNote2")], [{requirement: 65}]),
    "Rebirth note 3": new AgeRequirement([document.getElementById("rebirthNote3")], [{requirement: 200}]),
    "Evil info": new EvilRequirement([document.getElementById("evilInfo")], [{requirement: 1}]),
    "Time warping info": new TaskRequirement([document.getElementById("timeWarping")], [{task: "Mage", requirement: 10}]),
    "Automation": new AgeRequirement([document.getElementById("automation")], [{requirement: 20}]),
    "Quick task display": new AgeRequirement([document.getElementById("quickTaskDisplay")], [{requirement: 20}]),

    //Common work
    "Beggar": new TaskRequirement([getTaskElement("Beggar")], []),
    "Farmer": new TaskRequirement([getTaskElement("Farmer")], [{task: "Beggar", requirement: 10}]),
    "Fisherman": new TaskRequirement([getTaskElement("Fisherman")], [{task: "Farmer", requirement: 10}]),
    "Miner": new TaskRequirement([getTaskElement("Miner")], [{task: "Strength", requirement: 10}, {task: "Fisherman", requirement: 10}]),
    "Blacksmith": new TaskRequirement([getTaskElement("Blacksmith")], [{task: "Strength", requirement: 30}, {task: "Miner", requirement: 10}]),
    "Merchant": new TaskRequirement([getTaskElement("Merchant")], [{task: "Bargaining", requirement: 50}, {task: "Blacksmith", requirement: 10}]),

    //Military 
    "Squire": new TaskRequirement([getTaskElement("Squire")], [{task: "Strength", requirement: 5}]),
    "Footman": new TaskRequirement([getTaskElement("Footman")], [{task: "Strength", requirement: 20}, {task: "Squire", requirement: 10}]),
    "Veteran footman": new TaskRequirement([getTaskElement("Veteran footman")], [{task: "Battle tactics", requirement: 40}, {task: "Footman", requirement: 10}]),
    "Knight": new TaskRequirement([getTaskElement("Knight")], [{task: "Strength", requirement: 100}, {task: "Veteran footman", requirement: 10}]),
    "Veteran knight": new TaskRequirement([getTaskElement("Veteran knight")], [{task: "Battle tactics", requirement: 150}, {task: "Knight", requirement: 10}]),
    "Elite knight": new TaskRequirement([getTaskElement("Elite knight")], [{task: "Strength", requirement: 300}, {task: "Veteran knight", requirement: 10}]),
    "Holy knight": new TaskRequirement([getTaskElement("Holy knight")], [{task: "Mana control", requirement: 500}, {task: "Elite knight", requirement: 10}]),
    "Legendary knight": new TaskRequirement([getTaskElement("Legendary knight")], [{task: "Mana control", requirement: 1000}, {task: "Battle tactics", requirement: 1000}, {task: "Holy knight", requirement: 10}]),

    //The Arcane Association
    "Student": new TaskRequirement([getTaskElement("Student")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Apprentice mage": new TaskRequirement([getTaskElement("Apprentice mage")], [{task: "Mana control", requirement: 400}, {task: "Student", requirement: 10}]),
    "Mage": new TaskRequirement([getTaskElement("Mage")], [{task: "Mana control", requirement: 700}, {task: "Apprentice mage", requirement: 10}]),
    "Wizard": new TaskRequirement([getTaskElement("Wizard")], [{task: "Mana control", requirement: 1000}, {task: "Mage", requirement: 10}]),
    "Master wizard": new TaskRequirement([getTaskElement("Master wizard")], [{task: "Mana control", requirement: 1500}, {task: "Wizard", requirement: 10}]),
    "Chairman": new TaskRequirement([getTaskElement("Chairman")], [{task: "Mana control", requirement: 2000}, {task: "Master wizard", requirement: 10}]),

    //Fundamentals
    "Concentration": new TaskRequirement([getTaskElement("Concentration")], []),
    "Productivity": new TaskRequirement([getTaskElement("Productivity")], [{task: "Concentration", requirement: 5}]),
    "Bargaining": new TaskRequirement([getTaskElement("Bargaining")], [{task: "Concentration", requirement: 20}]),
    "Meditation": new TaskRequirement([getTaskElement("Meditation")], [{task: "Concentration", requirement: 30}, {task: "Productivity", requirement: 20}]),

    //Combat
    "Strength": new TaskRequirement([getTaskElement("Strength")], []),
    "Battle tactics": new TaskRequirement([getTaskElement("Battle tactics")], [{task: "Concentration", requirement: 20}]),
    "Muscle memory": new TaskRequirement([getTaskElement("Muscle memory")], [{task: "Concentration", requirement: 30}, {task: "Strength", requirement: 30}]),

    //Magic
    "Mana control": new TaskRequirement([getTaskElement("Mana control")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Immortality": new TaskRequirement([getTaskElement("Immortality")], [{task: "Apprentice mage", requirement: 10}]),
    "Time warping": new TaskRequirement([getTaskElement("Time warping")], [{task: "Mage", requirement: 10}]),
    "Super immortality": new TaskRequirement([getTaskElement("Super immortality")], [{task: "Chairman", requirement: 1000}]),

    //Dark magic
    "Dark influence": new EvilRequirement([getTaskElement("Dark influence")], [{requirement: 1}]),
    "Evil control": new EvilRequirement([getTaskElement("Evil control")], [{requirement: 1}]),
    "Intimidation": new EvilRequirement([getTaskElement("Intimidation")], [{requirement: 1}]),
    "Demon training": new EvilRequirement([getTaskElement("Demon training")], [{requirement: 25}]),
    "Blood meditation": new EvilRequirement([getTaskElement("Blood meditation")], [{requirement: 75}]),
    "Demon's wealth": new EvilRequirement([getTaskElement("Demon's wealth")], [{requirement: 500}]),

    //Properties
    "Homeless": new CoinRequirement([getItemElement("Homeless")], [{requirement: 0}]),
    "Tent": new CoinRequirement([getItemElement("Tent")], [{requirement: 0}]),
    "Wooden hut": new CoinRequirement([getItemElement("Wooden hut")], [{requirement: gameData.itemData["Wooden hut"].getExpense() * 100}]),
    "Cottage": new CoinRequirement([getItemElement("Cottage")], [{requirement: gameData.itemData["Cottage"].getExpense() * 100}]),
    "House": new CoinRequirement([getItemElement("House")], [{requirement: gameData.itemData["House"].getExpense() * 100}]),
    "Large house": new CoinRequirement([getItemElement("Large house")], [{requirement: gameData.itemData["Large house"].getExpense() * 100}]),
    "Small palace": new CoinRequirement([getItemElement("Small palace")], [{requirement: gameData.itemData["Small palace"].getExpense() * 100}]),
    "Grand palace": new CoinRequirement([getItemElement("Grand palace")], [{requirement: gameData.itemData["Grand palace"].getExpense() * 100}]),

    //Misc
    "Book": new CoinRequirement([getItemElement("Book")], [{requirement: 0}]),
    "Dumbbells": new CoinRequirement([getItemElement("Dumbbells")], [{requirement: gameData.itemData["Dumbbells"].getExpense() * 100}]),
    "Personal squire": new CoinRequirement([getItemElement("Personal squire")], [{requirement: gameData.itemData["Personal squire"].getExpense() * 100}]),
    "Steel longsword": new CoinRequirement([getItemElement("Steel longsword")], [{requirement: gameData.itemData["Steel longsword"].getExpense() * 100}]),
    "Butler": new CoinRequirement([getItemElement("Butler")], [{requirement: gameData.itemData["Butler"].getExpense() * 100}]),
    "Sapphire charm": new CoinRequirement([getItemElement("Sapphire charm")], [{requirement: gameData.itemData["Sapphire charm"].getExpense() * 100}]),
    "Study desk": new CoinRequirement([getItemElement("Study desk")], [{requirement: gameData.itemData["Study desk"].getExpense() * 100}]),
    "Library": new CoinRequirement([getItemElement("Library")], [{requirement: gameData.itemData["Library"].getExpense() * 100}]), 
}

tempData["requirements"] = {}
for (key in gameData.requirements) {
    var requirement = gameData.requirements[key]
    tempData["requirements"][key] = requirement
}

loadGameData()

setCustomEffects()
addMultipliers()

setTab(jobTabButton, "jobs")

update()
setInterval(update, 1000 / updateSpeed)
setInterval(saveGameData, 3000)
setInterval(setSkillWithLowestMaxXp, 1000)