const usernames = [
    'absolute_unit',
    'Admin',
    'ARandomUser',
    'catsrcool',
    'CisTheBestLanguage',
    'DigitalGuru',
    'dogsarebetter',
    'helpmeprogram',
    'iliftdaily',
    'InstaMarketer',
    'lotsofusers',
    'Lrn2Code',
    'newuser7',
    'NumberOneCoder',
    'SocialMediaPro',
    'SecretSauce',
    'Test',
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
        results.push({
            thoughtText: getRandomArrItem(thoughtsBodies),
        });
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

module.exports = { getRandomThoughts, getThoughtReactions, usernames }
