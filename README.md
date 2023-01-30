# DAO Bounty Board

Project Page:
https://www.notion.so/bankless/Bounty-Board-318dc164cc5640cca17e0fb5f484fd90

### Specifications:

- [Specs page](https://docs.google.com/document/d/1VJXin9Uoqt54JjfQEtyM11XESb2l4C1SSAzgc0kvxIs/edit?usp=sharing)
- [Figma](https://www.figma.com/file/venmq7OWr8iRsjR9ecttvc/Untitled?node-id=1%3A7)
- [Whimsical](https://whimsical.com/bounty-board-design-bankless-2cPEEZinYKJ2zE2Zvq7iAZ)
- [Heroku](https://bounty-board.herokuapp.com/)
- [Possible Queries](https://www.notion.so/Bounty-Board-Queries-33d03a4330454e67b8194aa86274ec34)
- [Data Fields](https://docs.google.com/document/d/10jgHxEpkPlArGlsQH1g22utFrAFh2lK-fbXjbq8KkuU/edit)
- [Personas](https://www.notion.so/Bounty-Board-Personas-8e8f2789775a445c82d13c2a9c545185)
- [Bot flowchart](https://media.discordapp.net/attachments/852736763205910538/857786834682511370/image0.jpg?width=978&height=683)

For full details on running the project locally, please see the 'getting started' section below.
# Project Overview

## Problem

Currently, Bankless DAO bounties are not in a centralized location causing confusion and makes it challenging for members, new and old, to contribute. Also Level 0's do not have intuitive ways to get involved and earn $BANK other than buying in the secondary markets.

## Solution

For the DAO to grow, we need a way to attract, retain and coordinate talent. The bounty board, accessible to members and non-members will connect the DAO to a continually expanding talent pool.

In addition, we need a way to codify meaningful units of work. Given the diversity of jobs to be done in a DAO, the bounty board allows bounty _creators_ to define and specify the scope of tasks along with expected deliverables.

Finally, we need a way to formalize the flow of capital, beyond an informal, organic tipping culture that exists to formally recognize contributors for their knowledge, skills and abilities.

The bounty board will be a key mechanism for coordinating talent, tasks and capital.

## Minimal Viable Product 1.0

### Bounty Card Definition

For the MVP, we are focusing on the bare requirements for a Bounty Card to be created by a user via DEGEN and/or Frontend UI, with the following key fields:

- **Title**: Bounty Titles should be like headlines
- **Description**: Provides space to flesh out the scope, deliverables and timeline for the bounty.
- **Criteria**: When is a task considered "done" or "complete"?
- **Reward**: Bounty creator indicates `amount` (i.e., 10000) and `currency` (i.e., $BANK) to be paid for completing the work.
- **HashId**: Auto-generated ID for each bounty.
- **CreatedBy / RequestedBy**: Bot automatically enters bounty creator's `discordHandle`.
- **ClaimedBy**: Bot automatially notes `discordHandle` claiming the bounty.
- **SubmittedBy**: Bot automatically notes `discordHandle` submitting the bounty.

#### User Experience Discord: Creating a Bounty with DEGEN

The follow description is of Serendipity in the Bankless Bot Garage, but is intended to mirror how DEGEN works in production.

1. **Create**: Bounty creator creates new bounty with `/bounty create`, inputing `title` and `reward`. DEGEN will dm you to input a description, requirements for completion and a due date (`yyyy-mm-dd`). DEGEN takes your input and returns a card with three options: 👍 publish, 📝 edit or ❌ delete

1. **Create Multiple Bounties**: Bounty creator creates new bounty with `/bounty create`, inputing `title` and `reward`. Then, hit tab to see an optional `copies` feature to create multiple bounties at once.

1. **Edit**: Select 📝 to edit. DEGEN provides a link to the frontend to edit any field. DEGEN then re-shows a newly edited card (and automatically publishes to #🧀-bounty-board channel)
1. **Publish/Open**: Bounty creator clicks thumbs up emoji 👍 or `/bounty publish` in Discord, bounty published to #🧀-bounty-board channel and website (url provided); status is now _Open_ on website.
1. **Claim/In Progress**: Within #🧀-bounty-board Bounty _claimer_ click black flag 🏴 or `/bounty claim`, entering the `BountyId` to 'start', card changes color in Discord, Bounty creator receives message that bounty has been claimed; Bounty card on website now has _Claimed By_; card status is now "In Progress".
1. **Submit/In Review**: Bounty claimer hits red mail box emoji 📮 in Discord, receives auto-generated message from DEGEN notifying the bounty is ready for review. They should reach out to the person who submitted the bounty. Alternatively, user can submit directly through a new bot command `/bounty submit`, entering `HashId`; card status is now "In Review".
1. **Complete/Completed**: Bounty claimer can signal completion ✅ on the post in the #🧀-bounty-board channel or directly through a new bot command `/bounty complete true`; card status is now "Completed".

#### Degen Commands

1. **NOTE**: DEGEN is available for use on _any_ channel within the Bankless DAO discord (08/31/2021)
2. Enter `/` and see a list of commands pop up.

The following commands (and input fields) are available for DEGEN:

/bounty claim (bounty-id)
/bounty complete (bounty-id)
/bounty create (title)(reward)
/bounty publish (bounty-id)
/bounty list (list-type)
/bounty delete (bounty-id)
/bounty submit (bounty-id)
/help bounty

Refer to the [Bounty Board Commands and Workflow](https://bankless.notion.site/The-Bounty-Board-Commands-and-Workflow-7f15bbc3f2c744afab1cb5f90daac4a2) Notion Page for in-depth details.

#### User Experience Frontend: Claiming a Bounty

**Note**: Currently, the frontend mirrors the interaction with DEGEN in discord and displays changes in card status. Frontend interactions are suited for those wishing to _claim_ bounties.

1. **Claim**: Click on any card that says `Open`. To claim, click the `Claim it` button. You will be re-directed to #🧀-bounty-board channel. Within #🧀-bounty-board Bounty click black flag 🏴 emoji. DEGEN present a link _back_ to the frontend and a prompt to reach out to the Bounty Creator.

2. **Frontend Status: In Progress**: A link back to the frontend shows card status as "In Progress" and "Claimed By" claimer's discord handle.

3. **Discord/Bot: Submit**: Bounty claimer hits red mail box emoji 📮 in Discord to submit, receives auto-generated message from DEGEN indicating "bounty in review" and a link back to the frontend where status is now "In Review".

4. **Discord/Bot: Complete**: Bounty claimer can signal completion ✅ on the post in the #🧀-bounty-board channel. Bounty creator receives message to tip bounty completer.

5. **Frontend Status: Completed**: Back at the frontend, the bounty card status is now "Completed".

1. **Discord/Bot: Draft**: Bounty creator creates new bounty with `/bounty create new`; status is now "Draft" and _not_ shown in Discord. Bounty creator must publish the bounty before it is available on the frontend.
2. **Frontend Status: Open**: Bounty creator clicks thumbs up emoji 👍 or `/bounty create publish` in Discord, bounty published to #🧀-bounty-board channel and website (url provided); status is now _Open_ on the frontend.
3. **Discord/Bot: Claim**: Now that a bounty card is _Open_, we can click "Claim It".
4. **Frontend Status: In Progress**: Within #🧀-bounty-board Bounty click black flag 🏴 or `/bounty claim` to 'claim'. A link back to the frontend shows card status as "In Progress" and "Claimed By" claimer's discord handle.
5. **Discord/Bot: Submit**: Bounty claimer hits red mail box emoji 📮 in Discord, receives auto-generated message from Bot indicating "bounty in review".
6. **Frontend Status: In Review**: Card status on the frontend is "In Review".
7. **Discord/Bot: Complete**: Bounty claimer can signal completion ✅ on the post in the #🧀-bounty-board channel. Bounty creator receives message to tip bounty completer.
8. **Frontend Status: Completed**: Work is done.


# Getting Started

Clone this repo locally.

## Create an application on your Discord serer
Go to the Discord Developer Portal (https://discord.com/developers). 

Click "New Application". Give your application a name (e.g. Bounty Board Web).

Go to the OAuth2 -> General section. Copy the Client ID and Client Secret. Add a Redirect and enter "http://localhost:3000/api/auth/callback/discord". If your server is accessible by something other than localhost:3000, adjust this Redirect accordingly. In AUTHORIZATION METHOD, choose "In-app authorization". In SCOPES check "applications.commands". Save your changes.

## Create an administrative role in your Discord server
Create a role in your Discord server (e.g. BB-core), copy its ID, and save it for later. Give yourself that role. 

## Create your .env.local file

Copy .env.qa to .env.local

NEXTAUTH_URL, NEXT_PUBLIC_API_URL and NEXT_PUBLIC_DAO_BOUNTY_BOARD_URL should be set to the "http://localhost:3000". If your server is accessible by something other than localhost:3000, adjust these variables accordingly.

DISCORD_CLIENT_ID should be set to the Client ID you copied from your Discord application.
DISCORD_CLIENT_SECRET should be set to the Client Secret you copied from your Discord application.

## With Docker

In .env.local update the MONGODB_URI with the following:
```
MONGODB_URI=mongodb://mongo:27017/bountyboard
```

To start the instance, you can run the following command
```
$ docker-compose up
```

Docker containerizes all the commands given below and helps you get started with the project without any hassle

## Without Docker

In order to run a local instance of the application you will need to configure a few things.
### Install Packages
You can either run the application from this top-level monorepo, or change into the `packages/react-app` directory. You will need the yarn package manager installed then run

```bash
$ yarn
$ yarn dev 
```
Which will install packages and run the application on port 3000. The `package.json` file in the respective repo gives a full list of commands.

### Setup MongoDB

Connection to MongoDB is handled through the Mongoose DRM. You can either connect to a hosted instance of MongoDB, or run a local development copy.

If running locally, your `.env.local` should contain something like:
```
MONGODB_URI=mongodb://localhost:27017/bountyboard
```
If connecting to a remote mongo server, your connection string will be in the format:
```
MONGODB_URI=mongodb://username:password@host:port/bountyboard
```
Please refer to [the Mongoose docs](https://mongoosejs.com/docs/connections.html) for more information.

For help setting up MongoDB locally, see their [installation instructions](https://docs.mongodb.com/manual/administration/install-community/).

### Setting Up Data in MongoDB
The app expects a MongoDB db `bountyboard` with the collections `bounties` and `customers`, as specified in the json files within `mongo/bounties` and `mongo/customers`.

You will need to add your Discord server information (aka your "customer") to the mongo/customers/seed_customers.json file. Add an object as follows:
```
{
    "_id": {
      "$oid": "616f00ae05026959ede9a3aa"
    },
    "customerId": "<Your Discord server ID>",
    "customerKey": "<Your Discord server name in lower case>",
    "customerName": "<Your Discord server name>",
    "bountyChannel": "<ID of the default channel where bounties will appear>",
    "externalRoleMap": {
      "adminExternalRoles": ["<ID of the administrative role you saved earlier>"]
    }
}
```

### Using Docker
Ensure you have docker and docker-compose installed (and running) on your desktop.

All the revelant files are in the `mongo/` folder of the monorepo, to run the container:

```sh
cd mongo
docker-compose up
```

This should start the database on port 27017, and automatically seed with test data. The application will restart with fresh seed data everytime you run the docker compose command, so don't worry about messing it up.

The seed data handles:

* Loading bounty data with correct object ids
* Loading customer data with correct object ids
* Attaching the correct text index to the bounty data

**Troubleshooting**

*I want to make changes to the data*

Just edit the `seed_customers.json` or `bboard_[version].json` file, alternatively edit the `seed.sh` script and change the JSON file to load from.

*mongo_seed exited with code 127*

Indicates the seed script cannot be found, usually a problem with windows. Ensure [line breaks are set as 'LF'](https://dev.to/wagslane/how-to-get-consistent-line-breaks-in-vs-code-lf-vs-crlf-2c3p#:~:text=At%20the%20bottom%20right%20of,has%20the%20correct%20line%20breaks.)

*data is not updating*

force Rebuild the container:

```sh
docker-compose up --build
```

### Manually (Not recommended)

Use this approach if you do not want to use docker, or are having troubles installing it. Be mindful that this approach will be more error prone, you may instead want to request test access to the DB.

If you're firing up a fresh instance of Mongo, you will need to seed the database from the command line or discord, as the board does not currently have an 'add bounty` functionality.

If you're adding from command line, you can use the mongoimport utility to import one of the JSON files in the `mongo/bounties` folder. 

Note: As of MongoDB 4.4 mongoimport is now a part of the MongoDB Database Tools package and must be downloaded seperately. For installation see the [MongoDB Database Tools](https://docs.mongodb.com/database-tools/installation/installation/)

```bash
$ mongoimport\
    --db bountyboard\
    --collection bounties\
    --file path/to/mongo/bounties/file.json\
    --jsonArray # only needed if loading an array
```
If you've made it this far, the application should run and should be showing a bounty on the main screen. You can directly query the API backend through the app at `localhost:3000/api/bounties`
