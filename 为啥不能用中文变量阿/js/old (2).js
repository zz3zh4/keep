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
    current杂项: null,
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
    "乞丐": {name: "乞丐", maxXp: 50, income: 5},
    "农夫": {name: "农夫", maxXp: 100, income: 9},
    "渔夫": {name: "渔夫", maxXp: 200, income: 15},
    "矿工": {name: "矿工", maxXp: 400, income: 40},
    "铁匠": {name: "铁匠", maxXp: 800, income: 80},
    "商人": {name: "商人", maxXp: 1600, income: 150},

    "侍从": {name: "侍从", maxXp: 100, income: 5},
    "步兵": {name: "步兵", maxXp: 1000, income: 50},
    "老兵": {name: "老兵", maxXp: 10000, income: 120},
    "骑士": {name: "骑士", maxXp: 100000, income: 300},
    "资深骑士": {name: "资深骑士", maxXp: 1000000, income: 1000},
    "精英骑士": {name: "精英骑士", maxXp: 7500000, income: 3000},
    "神圣骑士": {name: "神圣骑士", maxXp: 40000000, income: 15000},
    "传奇骑士": {name: "传奇骑士", maxXp: 150000000, income: 50000},

    "学生": {name: "学生", maxXp: 100000, income: 100},
    "法师学徒": {name: "法师学徒", maxXp: 1000000, income: 1000},
    "法师公会": {name: "法师公会", maxXp: 10000000, income: 7500},
    "巫师": {name: "巫师", maxXp: 100000000, income: 50000},
    "大巫师": {name: "大巫师", maxXp: 10000000000, income: 250000},
    "贤者": {name: "贤者", maxXp: 1000000000000, income: 1000000},
}

const skillBaseData = {
    "专心": {name: "专心", maxXp: 100, effect: 0.01, description: "技能经验"},
    "生产力": {name: "生产力", maxXp: 100, effect: 0.01, description: "职业经验"},
    "讨价还价": {name: "讨价还价", maxXp: 100, effect: -0.01, description: "支出"},
    "冥想": {name: "冥想", maxXp: 100, effect: 0.01, description: "幸福"},

    "力量": {name: "力量", maxXp: 100, effect: 0.01, description: "军事支出"},
    "战斗策略": {name: "战斗策略", maxXp: 100, effect: 0.01, description: "军事经验"},
    "肌肉记忆": {name: "肌肉记忆", maxXp: 100, effect: 0.01, description: "力量经验"},

    "法力控制": {name: "法力控制", maxXp: 100, effect: 0.01, description: "T.A.A.经验"},
    "不朽": {name: "不朽", maxXp: 100, effect: 0.01, description: "更长寿命"},
    "时间扭曲": {name: "时间扭曲", maxXp: 100, effect: 0.01, description: "游戏速度"},
    "超级不朽": {name: "超级不朽", maxXp: 100, effect: 0.01, description: "更长寿命"},

    "黑暗影响": {name: "黑暗影响", maxXp: 100, effect: 0.01, description: "所有经验"},
    "邪恶控制": {name: "邪恶控制", maxXp: 100, effect: 0.01, description: "邪恶获取"},
    "恐吓": {name: "恐吓", maxXp: 100, effect: -0.01, description: "支出"},
    "恶魔训练": {name: "恶魔训练", maxXp: 100, effect: 0.01, description: "所有经验"},
    "血腥冥想": {name: "血腥冥想", maxXp: 100, effect: 0.01, description: "邪恶获取"},
    "恶魔财富": {name: "恶魔财富", maxXp: 100, effect: 0.002, description: "职业支出"},
    
}

const itemBaseData = {
    "无家可归": {name: "无家可归", expense: 0, effect: 1},
    "帐篷": {name: "帐篷", expense: 15, effect: 1.4},
    "木屋": {name: "木屋", expense: 100, effect: 2},
    "村舍": {name: "村舍", expense: 750, effect: 3.5},
    "房屋": {name: "房屋", expense: 3000, effect: 6},
    "大房子": {name: "大房子", expense: 25000, effect: 12},
    "小型宫殿": {name: "小型宫殿", expense: 300000, effect: 25},
    "大型宫殿": {name: "大型宫殿", expense: 5000000, effect: 60},

    "书": {name: "书", expense: 10, effect: 1.5, description: "技能经验"},
    "哑铃": {name: "哑铃", expense: 50, effect: 1.5, description: "力量经验"},
    "个人侍从": {name: "个人侍从", expense: 200, effect: 2, description: "职业经验"},
    "钢长剑": {name: "钢长剑", expense: 1000, effect: 2, description: "军事经验"},
    "仆役长": {name: "仆役长", expense: 7500, effect: 1.5, description: "幸福"},
    "蓝宝石护符": {name: "蓝宝石护符", expense: 50000, effect: 3, description: "魔法经验"},
    "书桌": {name: "书桌", expense: 1000000, effect: 2, description: "技能经验"},
    "图书馆": {name: "图书馆", expense: 10000000, effect: 1.5, description: "技能经验"},
}

const jobCategories = {
    "普通工作": ["乞丐", "农夫", "渔夫", "矿工", "铁匠", "商人"],
    "军队" : ["侍从", "步兵", "老兵", "骑士", "资深骑士", "精英骑士", "神圣骑士", "传奇骑士"],
    "奥术协会" : ["学生", "法师学徒", "法师公会", "巫师", "大巫师", "贤者"]
}

const skillCategories = {
    "基本": ["专心", "生产力", "讨价还价", "冥想"],
    "战斗中": ["力量", "战斗策略", "肌肉记忆"],
    "魔法": ["法力控制", "不朽", "时间扭曲", "超级不朽"],
    "黑暗魔法": ["黑暗影响", "邪恶控制", "恐吓", "恶魔训练", "血腥冥想", "恶魔财富"]
}

const itemCategories = {
    "住处": ["无家可归", "帐篷", "木屋", "村舍", "房屋", "大房子", "小型宫殿", "大型宫殿"],
    "杂项": ["书", "哑铃", "个人侍从", "钢长剑", "仆役长", "蓝宝石护符", "书桌", "图书馆"]
}

const headerRowColors = {
    "普通工作": "#55a630",
    "军队": "#e63946",
    "奥术协会": "#C71585",
    "基本": "#4a4e69",
    "战斗中": "#ff704d",
    "魔法": "#875F9A",
    "黑暗魔法": "#73000f",
    "住处": "#219ebc",
    "杂项": "#b56576",
}

const tooltips = {
    "乞丐": "为了几枚铜币日夜挣扎.感觉你每天都处在死亡的边缘. ",
    "农夫": "犁地,种庄稼.虽然这工作收入不多,但很正经.",
    "渔夫": "钓上各种各样的鱼,然后把它们卖掉.一份轻松但收入微薄的工作.",
    "矿工": "深入危险的洞穴,开采有价值的矿石.与所涉及的风险相比,报酬是相当少的.",
    "铁匠": "为军队冶炼矿石,精心锻造武器.一份体面的,报酬不错的普通工作.",
    "商人": "从一个城镇到另一个城镇,以物易物.这份工作报酬不错,而且不需要太多的体力劳动.",

    "侍从": "在战场上随身携带骑士的盾牌和剑.工资很低,但工作经验很有价值.",
    "步兵": "放下你的生命与敌人的士兵战斗.一份勇敢,体面的工作,但你在宏大的计划中仍然一文不值.",
    "老兵": "比一般步兵更有经验,更有用,用你的力量干掉敌人.薪水还不错.",
    "骑士": "从头到脚都裹着钢铁,轻松地刺穿敌军士兵.一份报酬丰厚,非常体面的工作. ",
    "资深骑士": "利用你无与伦比的战斗能力,毫不费力地屠杀敌人.军队里的大多数步兵都不可能得到这样一份报酬优厚的工作.",
    "精英骑士": "装备最精良装备的情况,以非凡的熟练程度一举歼灭敌军中队.这样一支在战场上令人畏惧的部队,报酬是非常丰厚的.",
    "神圣骑士": "用你的魔法之刃在几秒钟内摧毁整个军队.为数不多的精英骑士获得了这一级别的力量,他们得到了大量的硬币.",
    "传奇骑士": "让全世界都感到恐惧,一眨眼的功夫就把整个国家都毁灭了.大约每个世纪,只有一位神圣骑士配得上这样一个受人尊敬的头衔.",

    "学生": "学习法力理论,练习基本咒语.有少量的生活费用,这是成为法师的必要阶段.",
    "法师学徒": "在法师的指导下,在战斗中对敌人施展基本法术.将提供相当数量的工资以支付生活费用. ",
    "法师公会": "通过施放中间法术和指导其他学徒来扭转战斗的趋势.这份工作的报酬非常高.",
    "巫师": "使用高级法术来蹂躏和摧毁整个军团的敌军士兵.只有一小部分法师有资格获得这个职位,并且得到了高得离谱的报酬.",
    "大巫师": "拥有无与伦比的天赋,可以随心所欲地施展难以置信的法术.据说巫师大师拥有足够的破坏力,足以将一个帝国从地图上抹去.",
    "贤者": "花费你的时间管理奥术协会以及研究真正不朽的概念.贤者每天收到的薪水少得可笑.",

    "专心": "通过练习集中注意力的活动来提高你的学习速度.",
    "生产力": "学会在工作中减少拖延,每天积累更多的工作经验.",
    "讨价还价": "学习交易技巧和说服技巧来降低任何类型的费用.",
    "冥想": "让你的头脑充满和平与安宁,从内心发掘更大的幸福. ",

    "力量": "通过艰苦的训练来调节你的身体和力量.更强壮的人在军队中得到更多的报酬.",
    "战斗策略": "制定和修改作战策略,提高军事经验.",
    "肌肉记忆": "通过习惯和重复来强化你的神经元,提高全身的力量增益.",

    "法力控制": "加强你全身的法力通道,帮助你成为一个更强大的魔法使用者.",
    "不朽": "通过魔法延长你的寿命。然而，这真的是你所追求的不朽吗?",
    "时间扭曲": "通过被禁止的技术弯曲空间和时间,导致更快的游戏速度.",
    "超级不朽": "通过利用古老的,被禁止的技术,将你的寿命大大延长到无法理解的程度.",

    "黑暗影响": "用邪恶赋予你的强大力量包围你自己,让你轻松地接受和吸收任何工作或技能.",
    "邪恶控制": "驯服你内心肆虐和成长的邪恶,在重生之间提高邪恶的收益.",
    "恐吓": "学会散发一种恶魔般的光环,让其他商人极度恐惧,迫使他们给你大打折扣.",
    "恶魔训练": "仅仅是人的身体就太软弱无力,无法抵挡邪恶.用禁止的方法训练,慢慢变成一个能够快速吸收知识的恶魔.",
    "血腥冥想": "通过对其他生物的亵渎来培育和培养你内心的邪恶,极大地增加邪恶的收益.",
    "恶魔财富": "通过黑魔法的手段,将你从工作中得到的硬币加倍. ",

    "无家可归": "睡在不舒服,肮脏的街道上,每天晚上几乎冻死.不会比这更糟了.",
    "帐篷": "一张由两根软弱的木棒托着的破布.生活条件很糟糕,但至少你有个栖身之所.",
    "木屋": "破烂的原木和肮脏的干草和马粪粘在一起.虽然比帐篷坚固多了,但是臭气也不太好闻.",
    "村舍": "用木框架和茅草屋顶建造的.以公平的价格提供体面的生活条件.",
    "房屋": "用石头,砖和坚固的木材建造的建筑,里面有几个房间.虽然很贵,但这是一个舒适的住所.",
    "大房子": "比普通的房子大得多,有更多的房间和多层.这栋建筑很宽敞,但价格不菲.",
    "小型宫殿": "一种非常丰富和精心建造的结构,用银等精细金属镶边.奢侈的生活方式需要花费极高的费用.",
    "大型宫殿": "完全由金和银组成的豪华住宅.以荒唐的价格提供尽可能豪华舒适的生活条件. ",

    "书": "一个写下你所有的想法和发现的东西,让你更快地学习.",
    "哑铃": "在剧烈运动中用来比以前更快地增强和积累力量的重型工具. ",
    "个人侍从": "协助您完成日常活动,让您有更多时间在工作中发挥效率.",
    "钢长剑": "用来在战斗中更快地杀死敌人从而获得更多经验的一把精致的剑.",
    "仆役长": "时刻保持家里清洁,每天还准备三顿美味的饭菜,让你心情更愉快,没有压力.",
    "蓝宝石护符": "镶嵌着稀有蓝宝石,这个护符激活你体内更多的法力通道,让你更容易学会魔法.",
    "书桌": "一个专门的区域,提供了许多精致的文具和设备设计,以促进您的研究进展.",
    "图书馆": "储存了大量的书籍,每一本都包含了大量的信息,从基本的生活技能到复杂的魔法咒语. ",
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
        task.xpMultipliers.push(getBindedTaskEffect("黑暗影响"))
        task.xpMultipliers.push(getBindedTaskEffect("恶魔训练"))

        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task))
            task.incomeMultipliers.push(getBindedTaskEffect("恶魔财富"))
            task.xpMultipliers.push(getBindedTaskEffect("生产力"))
            task.xpMultipliers.push(getBindedItemEffect("个人侍从"))    
        } else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect("专心"))
            task.xpMultipliers.push(getBindedItemEffect("书"))
            task.xpMultipliers.push(getBindedItemEffect("书桌"))
            task.xpMultipliers.push(getBindedItemEffect("图书馆"))
        }

        if (jobCategories["军队"].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect("力量"))
            task.xpMultipliers.push(getBindedTaskEffect("战斗策略"))
            task.xpMultipliers.push(getBindedItemEffect("钢长剑"))
        } else if (task.name == "力量") {
            task.xpMultipliers.push(getBindedTaskEffect("肌肉记忆"))
            task.xpMultipliers.push(getBindedItemEffect("哑铃"))
        } else if (skillCategories["魔法"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("蓝宝石护符"))
        } else if (jobCategories["奥术协会"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("法力控制"))
        } else if (skillCategories["黑暗魔法"].includes(task.name)) {
            task.xpMultipliers.push(getEvil)
        }
    }

    for (itemName in gameData.itemData) {
        var item = gameData.itemData[itemName]
        item.expenseMultipliers = []
        item.expenseMultipliers.push(getBindedTaskEffect("讨价还价"))
        item.expenseMultipliers.push(getBindedTaskEffect("恐吓"))
    }
}

function setCustomEffects() {
    var bargaining = gameData.taskData["讨价还价"]
    bargaining.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, bargaining.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var intimidation = gameData.taskData["恐吓"]
    intimidation.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, intimidation.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var timeWarping = gameData.taskData["时间扭曲"]
    timeWarping.getEffect = function() {
        var multiplier = 1 + getBaseLog(13, timeWarping.level + 1) 
        return multiplier
    }

    var immortality = gameData.taskData["不朽"]
    immortality.getEffect = function() {
        var multiplier = 1 + getBaseLog(33, immortality.level + 1) 
        return multiplier
    }
}

function getHappiness() {
    var meditationEffect = getBindedTaskEffect("冥想")
    var butlerEffect = getBindedItemEffect("仆役长")
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
    var evilControl = gameData.taskData["邪恶控制"]
    var blood冥想 = gameData.taskData["血腥冥想"]
    var evil = evilControl.getEffect() * blood冥想.getEffect()
    return evil
}

function getGameSpeed() {
    var timeWarping = gameData.taskData["时间扭曲"]
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
    for (misc of gameData.current杂项) {
        expense += misc.getExpense()
    }
    return expense
}

function goBankrupt() {
    gameData.coins = 0
    gameData.currentProperty = gameData.itemData["无家可归"]
    gameData.current杂项 = []
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

function set杂项(miscName) {
    var misc = gameData.itemData[miscName]
    if (gameData.current杂项.includes(misc)) {
        for (i = 0; i < gameData.current杂项.length; i++) {
            if (gameData.current杂项[i] == misc) {
                gameData.current杂项.splice(i, 1)
            }
        }
    } else {
        gameData.current杂项.push(misc)
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
        headerRow.getElementsByClassName("valueType")[0].textContent = categoryType == jobCategories ? "收入/天" : "效果"
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
        row.getElementsByClassName("button")[0].onclick = categoryName == "住处" ? function() {setProperty(name)} : function() {set杂项(name)}
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
    progressBar.getElementsByClassName("name")[0].textContent = currentTask.name + " 等级 " + currentTask.level
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
                    evilElement.textContent = format(requirements[0].requirement) + " 邪恶"
                } else {
                    levelElement.classList.remove("hiddenTask")
                    for (requirement of requirements) {
                        var task = gameData.taskData[requirement.task]
                        if (task.level >= requirement.requirement) continue
                        var text = " " + requirement.task + " 等级 " + format(task.level) + "/" + format(requirement.requirement) + ","
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
        var color = itemCategories["住处"].includes(item.name) ? headerRowColors["住处"] : headerRowColors["杂项"]
        active.style.backgroundColor = gameData.current杂项.includes(item) || item == gameData.currentProperty ? color : "white"
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
    document.getElementById("pauseButton").textContent = gameData.paused ? "开始" : "暂停"

    formatCoins(gameData.coins, document.getElementById("coinDisplay"))
    setSignDisplay()
    formatCoins(getNet(), document.getElementById("netDisplay"))
    formatCoins(getIncome(), document.getElementById("incomeDisplay"))
    formatCoins(getExpense(), document.getElementById("expenseDisplay"))

    document.getElementById("happinessDisplay").textContent = getHappiness().toFixed(1)

    document.getElementById("evilDisplay").textContent = gameData.evil.toFixed(1)
    document.getElementById("evilGainDisplay").textContent = getEvilGain().toFixed(1)

    document.getElementById("timeWarpingDisplay").textContent = "x" + gameData.taskData["时间扭曲"].getEffect().toFixed(2)
    document.getElementById("timeWarpingButton").textContent = gameData.timeWarpingEnabled ? "禁用扭曲" : "启用扭曲"
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
        gameData.itemData[item.name] = "happiness" in item ? new Property(task) : new 杂项(task)
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
        skillWithLowestMaxXp = gameData.taskData["专心"]
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
    var tiers = ["铂", "金", "银"]
    var colors = {
        "铂": "#79b9c7",
        "金": "#E5C100",
        "银": "#a8a8a8",
        "铜": "#a15c2f"
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
    var text = String(Math.floor(leftOver)) + "铜"
    element.children[3].textContent = text
    element.children[3].style.color = colors["铜"]
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
    gameData.currentJob = gameData.taskData["乞丐"]
    gameData.currentSkill = gameData.taskData["专心"]
    gameData.currentProperty = gameData.itemData["无家可归"]
    gameData.current杂项 = []

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
    var immortality = gameData.taskData["不朽"]
    var super不朽 = gameData.taskData["超级不朽"]
    var lifespan = baseLifespan * immortality.getEffect() * super不朽.getEffect()
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
    for (misc of gameData.current杂项) {
        newArray.push(gameData.itemData[misc.name])
    }
    gameData.current杂项 = newArray
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
    var data = JSON.parse(importExportBox.value)
    gameData = data
    saveGameData()
    location.reload()
}

function exportGameData() {
    var importExportBox = document.getElementById("importExportBox")
    importExportBox.value = JSON.stringify(gameData)
}

//Init

createAllRows(jobCategories, "jobTable")
createAllRows(skillCategories, "skillTable")
createAllRows(itemCategories, "itemTable") 

createData(gameData.taskData, jobBaseData)
createData(gameData.taskData, skillBaseData)
createData(gameData.itemData, itemBaseData) 

gameData.currentJob = gameData.taskData["乞丐"]
gameData.currentSkill = gameData.taskData["专心"]
gameData.currentProperty = gameData.itemData["无家可归"]
gameData.current杂项 = []

gameData.requirements = {
    //Other
    "奥术协会": new TaskRequirement(getElementsByClass("奥术协会"), [{task: "专心", requirement: 200}, {task: "冥想", requirement: 200}]),
    "黑暗魔法": new EvilRequirement(getElementsByClass("黑暗魔法"), [{requirement: 1}]),
    "Shop": new CoinRequirement([document.getElementById("shopTabButton")], [{requirement: gameData.itemData["帐篷"].getExpense() * 50}]),
    "Rebirth tab": new AgeRequirement([document.getElementById("rebirthTabButton")], [{requirement: 25}]),
    "Rebirth note 1": new AgeRequirement([document.getElementById("rebirthNote1")], [{requirement: 45}]),
    "Rebirth note 2": new AgeRequirement([document.getElementById("rebirthNote2")], [{requirement: 65}]),
    "Rebirth note 3": new AgeRequirement([document.getElementById("rebirthNote3")], [{requirement: 200}]),
    "Evil info": new EvilRequirement([document.getElementById("evilInfo")], [{requirement: 1}]),
    "时间扭曲 info": new TaskRequirement([document.getElementById("timeWarping")], [{task: "法师公会", requirement: 10}]),
    "Automation": new AgeRequirement([document.getElementById("automation")], [{requirement: 20}]),
    "Quick task display": new AgeRequirement([document.getElementById("quickTaskDisplay")], [{requirement: 20}]),

    //普通工作
    "乞丐": new TaskRequirement([getTaskElement("乞丐")], []),
    "农夫": new TaskRequirement([getTaskElement("农夫")], [{task: "乞丐", requirement: 10}]),
    "渔夫": new TaskRequirement([getTaskElement("渔夫")], [{task: "农夫", requirement: 10}]),
    "矿工": new TaskRequirement([getTaskElement("矿工")], [{task: "力量", requirement: 10}, {task: "渔夫", requirement: 10}]),
    "铁匠": new TaskRequirement([getTaskElement("铁匠")], [{task: "力量", requirement: 30}, {task: "矿工", requirement: 10}]),
    "商人": new TaskRequirement([getTaskElement("商人")], [{task: "讨价还价", requirement: 50}, {task: "铁匠", requirement: 10}]),

    //军队 
    "侍从": new TaskRequirement([getTaskElement("侍从")], [{task: "力量", requirement: 5}]),
    "步兵": new TaskRequirement([getTaskElement("步兵")], [{task: "力量", requirement: 20}, {task: "侍从", requirement: 10}]),
    "老兵": new TaskRequirement([getTaskElement("老兵")], [{task: "战斗策略", requirement: 40}, {task: "步兵", requirement: 10}]),
    "骑士": new TaskRequirement([getTaskElement("骑士")], [{task: "力量", requirement: 100}, {task: "老兵", requirement: 10}]),
    "资深骑士": new TaskRequirement([getTaskElement("资深骑士")], [{task: "战斗策略", requirement: 150}, {task: "骑士", requirement: 10}]),
    "精英骑士": new TaskRequirement([getTaskElement("精英骑士")], [{task: "力量", requirement: 300}, {task: "资深骑士", requirement: 10}]),
    "神圣骑士": new TaskRequirement([getTaskElement("神圣骑士")], [{task: "法力控制", requirement: 500}, {task: "精英骑士", requirement: 10}]),
    "传奇骑士": new TaskRequirement([getTaskElement("传奇骑士")], [{task: "法力控制", requirement: 1000}, {task: "战斗策略", requirement: 1000}, {task: "神圣骑士", requirement: 10}]),

    //奥术协会
    "学生": new TaskRequirement([getTaskElement("学生")], [{task: "专心", requirement: 200}, {task: "冥想", requirement: 200}]),
    "法师学徒": new TaskRequirement([getTaskElement("法师学徒")], [{task: "法力控制", requirement: 400}, {task: "学生", requirement: 10}]),
    "法师公会": new TaskRequirement([getTaskElement("法师公会")], [{task: "法力控制", requirement: 700}, {task: "法师学徒", requirement: 10}]),
    "巫师": new TaskRequirement([getTaskElement("巫师")], [{task: "法力控制", requirement: 1000}, {task: "法师公会", requirement: 10}]),
    "大巫师": new TaskRequirement([getTaskElement("大巫师")], [{task: "法力控制", requirement: 1500}, {task: "巫师", requirement: 10}]),
    "贤者": new TaskRequirement([getTaskElement("贤者")], [{task: "法力控制", requirement: 2000}, {task: "大巫师", requirement: 10}]),

    //基本
    "专心": new TaskRequirement([getTaskElement("专心")], []),
    "生产力": new TaskRequirement([getTaskElement("生产力")], [{task: "专心", requirement: 5}]),
    "讨价还价": new TaskRequirement([getTaskElement("讨价还价")], [{task: "专心", requirement: 20}]),
    "冥想": new TaskRequirement([getTaskElement("冥想")], [{task: "专心", requirement: 30}, {task: "生产力", requirement: 20}]),

    //战斗中
    "力量": new TaskRequirement([getTaskElement("力量")], []),
    "战斗策略": new TaskRequirement([getTaskElement("战斗策略")], [{task: "专心", requirement: 20}]),
    "肌肉记忆": new TaskRequirement([getTaskElement("肌肉记忆")], [{task: "专心", requirement: 30}, {task: "力量", requirement: 30}]),

    //魔法
    "法力控制": new TaskRequirement([getTaskElement("法力控制")], [{task: "专心", requirement: 200}, {task: "冥想", requirement: 200}]),
    "不朽": new TaskRequirement([getTaskElement("不朽")], [{task: "法师学徒", requirement: 10}]),
    "时间扭曲": new TaskRequirement([getTaskElement("时间扭曲")], [{task: "法师公会", requirement: 10}]),
    "超级不朽": new TaskRequirement([getTaskElement("超级不朽")], [{task: "贤者", requirement: 1000}]),

    //黑暗魔法
    "黑暗影响": new EvilRequirement([getTaskElement("黑暗影响")], [{requirement: 1}]),
    "邪恶控制": new EvilRequirement([getTaskElement("邪恶控制")], [{requirement: 1}]),
    "恐吓": new EvilRequirement([getTaskElement("恐吓")], [{requirement: 1}]),
    "恶魔训练": new EvilRequirement([getTaskElement("恶魔训练")], [{requirement: 25}]),
    "血腥冥想": new EvilRequirement([getTaskElement("血腥冥想")], [{requirement: 75}]),
    "恶魔财富": new EvilRequirement([getTaskElement("恶魔财富")], [{requirement: 500}]),

    //住处
    "无家可归": new CoinRequirement([getItemElement("无家可归")], [{requirement: 0}]),
    "帐篷": new CoinRequirement([getItemElement("帐篷")], [{requirement: 0}]),
    "木屋": new CoinRequirement([getItemElement("木屋")], [{requirement: gameData.itemData["木屋"].getExpense() * 100}]),
    "村舍": new CoinRequirement([getItemElement("村舍")], [{requirement: gameData.itemData["村舍"].getExpense() * 100}]),
    "房屋": new CoinRequirement([getItemElement("房屋")], [{requirement: gameData.itemData["房屋"].getExpense() * 100}]),
    "大房子": new CoinRequirement([getItemElement("大房子")], [{requirement: gameData.itemData["大房子"].getExpense() * 100}]),
    "小型宫殿": new CoinRequirement([getItemElement("小型宫殿")], [{requirement: gameData.itemData["小型宫殿"].getExpense() * 100}]),
    "大型宫殿": new CoinRequirement([getItemElement("大型宫殿")], [{requirement: gameData.itemData["大型宫殿"].getExpense() * 100}]),

    //杂项
    "书": new CoinRequirement([getItemElement("书")], [{requirement: 0}]),
    "哑铃": new CoinRequirement([getItemElement("哑铃")], [{requirement: gameData.itemData["哑铃"].getExpense() * 100}]),
    "个人侍从": new CoinRequirement([getItemElement("个人侍从")], [{requirement: gameData.itemData["个人侍从"].getExpense() * 100}]),
    "钢长剑": new CoinRequirement([getItemElement("钢长剑")], [{requirement: gameData.itemData["钢长剑"].getExpense() * 100}]),
    "仆役长": new CoinRequirement([getItemElement("仆役长")], [{requirement: gameData.itemData["仆役长"].getExpense() * 100}]),
    "蓝宝石护符": new CoinRequirement([getItemElement("蓝宝石护符")], [{requirement: gameData.itemData["蓝宝石护符"].getExpense() * 100}]),
    "书桌": new CoinRequirement([getItemElement("书桌")], [{requirement: gameData.itemData["书桌"].getExpense() * 100}]),
    "图书馆": new CoinRequirement([getItemElement("图书馆")], [{requirement: gameData.itemData["图书馆"].getExpense() * 100}]), 
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