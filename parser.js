const qs = require('querystring');
const fetch = require('node-fetch');

const log = event => console.log('Event', JSON.stringify(event, null, 2));

var rawCommand, command, response;

const getCommand = text => /^<@[A-X0-9]*>(.+)/.exec(text)[1].trim();

/*const aList = ['list', 'display', 'show', 'fetch'];
const aAdd = ['add', 'create', 'include'];
const aRemove = ['remove', 'delete', 'terminate'];
const aMembers = ['member', 'members', 'user', 'users', 'person'] ;*/

const parseListTeams = () => {
    
    //console.log('2 - command is ', command);

    //Assure that this is the right command
    const words = command.split(' ');
    const action = words[0];
    const resource = words[1];

    if (action !== "list" || resource !== 'members')
        throw new Error ('Bad implementation for command parseListTeams');

    response = {
        command: {
            commandLine: command,
            action: action,
            resource: resource,
            api: 'list-members',
            params: [],
            response: {
                success: "$output",
                error: "error to perform your command. Use list commands to see what I can do for ya.",
            }
        }
    };
};

module.exports.handler = (event, context, callback) => {
    log(event);

    //console.log('0 - event.slack.event.text is ', event.slack.event.text);

    //Get the slack command issued
    rawCommand = event.slack.event.text;
    command = getCommand(rawCommand).trim();

    //console.log('1 - rawCommand is ', rawCommand);
    //console.log('1 - command is ', command);

    //Check if it is a 2 word command, by looking for a white space after trim()
    if (command.indexOf(' ') > 0){

        //Split the command and isolate the two first words (action and resource)
        const words = command.split(' ');
        const action = words[0].toLowerCase();
        const resource = words[1].toLowerCase();

        //console.log('words is ', words);
        //console.log('action is ', action);
        //console.log('resource is ', resource);

        //Check the action/resource and invoke the specific function
        //For new commands, please add another item to the case below resolving to your command
        //Please dont use synonyms. In order to make things simpler, parser only translate the exact command

        if (action === 'list' && resource === 'members') {
            //console.log('calling the promise');
            Promise.resolve()
                .then(parseListTeams)
                .then(event = Object.assign(event, response))
                .then((event) => callback(null, response))  //Success
                .catch((err) =>  callback(sendResponse(null, err))); //Error
        } else
        { 
            //Command not found
            callback (new Error ('I dont understand this command. Use list commands to see what I can do for ya.'));
        }
    } else {
        //console.log('1 word command found. But not supported.');
        //Later, we can develop other simple commands with one word
        callback (new Error('command ' + command + ' is not supported'));
        
    }
};
