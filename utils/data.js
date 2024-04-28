// Usernames available for initial data seeding
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
// Thoughts available for initial data seeding
const thoughtsBodies = [
    'Check out my new program!',
    'I am stuck on this algorithm.',
    'Hello World!',
    'Anybody ever have really vivid dreams?',
    'Inflation is too high.'
];
// Reactions available for initial data seeding
const possibleReactions = [
    'How long have you been programming for?',
    'I found another possible solution to the algorithm.',
    'You can do better than that!',
    'Let me tell you about this dream I had last night...',
    'Amen brother!'
];
// A function that takes an array as input and returns a random item from that array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
// A function that returns a random username as a string, selected from the 'usernames' array defined above
const getRandomUser = () => `${getRandomArrItem(usernames)}`;
// A function that takes an integer as an argument and generates an array of random thoughts
const getRandomThoughts = (int) => {
    let results = [];
    for (let i = 0; i < int; i++) {
        results.push(getRandomArrItem(thoughtsBodies)); // Loop through int, adding a random thought to the reults array after each iteration
    }
    return results; // Return the results array
};
// A function that takes an integer as an argument and generates an array of random reactions
const getThoughtReactions = (int) => {
    let results = [];
    for (let i = 0; i < int; i++) {
        // Loop through int, adding a random reaction and associating it with a random user after each iteration
        results.push({
            reactionBody: getRandomArrItem(possibleReactions),
            username: getRandomUser(),
        });
    }
    return results; // Return the results array
};

module.exports = { getRandomThoughts, getThoughtReactions, getRandomUser }
