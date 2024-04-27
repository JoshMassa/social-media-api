const usernames = [
    'absolute_unit',
    'Admin',
    'AppearingEngineering',
    'ARandomUser',
    'catsrcool',
    'CisTheBestLanguage',
    'CodeCraftTech',
    'CodeCraftersHQ',
    'CodeMasterTech',
    'CodingNinjaTech',
    'CodingShark',
    'ComputerCoding',
    'ComputerProgramming',
    'DasEngineering',
    'DevProCoder',
    'DevTools',
    'DigitalGuru',
    'dogsarebetter',
    'EngiDevGeek',
    'FreexSoftware',
    'FullStackGenius',
    'helpmeprogram',
    'iliftdaily',
    'InstaMarketer',
    'lotsofusers',
    'Lrn2Code',
    'newuser7',
    'NumberOneCoder',
    'PairProgrammer',
    'PairSoftware',
    'ProgCodeTechie',
    'ProgrammingAmy',
    'Rcoding',
    'SecretSauce',
    'SocialMediaPro',
    'SoftEngTechie',
    'SoftwareHardware',
    'TechProdigyCo',
    'TechSavvyDev',
    'Test',
    'VolunteerEngineer',
    'WebDevWizard',
    'WebEnginNerd',
    'ZebraLord9000'
];

const thoughtsBodies = [
    'Check out my new program!',
    'I am stuck on this algorithm.',
    'Hello World!',
    'Anybody ever have really vivid dreams?',
    'Inflation is too high.'
];

const possibleReactions = [
    'How long have you been programming for?',
    'I found another possible solution to the algorithm.',
    'You can do better than that!',
    'Let me tell you about this dream I had last night...',
    'Amen brother!'
];

const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomUser = () => `${getRandomArrItem(usernames)}`;

const getRandomThoughts = (int) => {
    let results = [];
    for (let i = 0; i < int; i++) {
        results.push(getRandomArrItem(thoughtsBodies));
    }
    return results;
};

const getThoughtReactions = (int) => {
    let results = [];
    for (let i = 0; i < int; i++) {
        results.push({
            reactionBody: getRandomArrItem(possibleReactions),
            username: getRandomUser(),
        });
    }
    return results;
};

module.exports = { getRandomThoughts, getThoughtReactions, getRandomUser }
