/*
* Implement a function that returns the summary of the current user's latest conversations,
* sorted by the latest message's timestamp (most recent conversation first).
*
* Make sure to have good unit tests in addition to the provided integration test!
*
* You have the following REST API available (base URL provided as a constant):
*
* Get current user's conversations: GET /conversations
* Get messages in a conversation: GET /conversations/:conversation_id/messages
* Get user by ID: GET /users/:user_id
*
* The result should be an array of objects of the following shape/type:
* {
*   id : string;
*   latest_message: {
*     body : string;
*     from_user : {
*       id: string;
*       avatar_url: string;
*     };
*     created_at : ISOString;
*   };
* }
*
*/
const API_BASE_URL = "https://rechomework.prd.mz.internal.unity3d.com/api";

async function getRecentConversationSummaries () {
  const conversations = await getJSON(`${API_BASE_URL}/conversations`)

  // request for messages in conversation, then pick most recent message from each conversation (chat)
  const recentConversMessages = await Promise.all(conversations.map(
          conv => getJSON(`${API_BASE_URL}/conversations/${conv.id}/messages`)
          .then(chatMsgJson => chatMsgJson.reduce(
              (a, b) => (new Date(a.created_at) > new Date(b.created_at) ? a : b)))));

  // sort all the recent messages by Date
  const sortedRecentConversMessages = recentConversMessages.sort(
      (a, b) => (new Date(b.created_at) - new Date(a.created_at)));

  let userData = {}
  await Promise.all(sortedRecentConversMessages.map(
  	async msg => {
  	    if (!userData.hasOwnProperty(msg.from_user_id)) {
  	        userData[msg.from_user_id] = await getJSON(`${API_BASE_URL}/users/${msg.from_user_id}`);
  	    }
  	}));
    console.log("userData:", userData)
}

function getJSON(url) {
    return fetch(url)
        .then(res => res.json())
        .catch(err => { throw err });
}

// Configure Mocha, telling both it and chai to use BDD-style tests.
mocha.setup("bdd");
chai.should();

describe('getRecentConversationSummaries()', () => {
	it('should return the current user\'s latest conversations sorted by latest message\'s timestamp', async () => {
    const result = await getRecentConversationSummaries();
    result.should.deep.equal([
      {
        id: "1",
        latest_message: {
          id: "1",
          body: "Moi!",
          from_user: {
            id: "1",
            avatar_url: "http://placekitten.com/g/300/300",
          },
          created_at: "2016-08-25T10:15:00.670Z",
        },
      },
      {
        id: "2",
        latest_message: {
          id: "2",
          body: "Hello!",
          from_user: {
            id: "3",
            avatar_url: "http://placekitten.com/g/302/302",
          },
          created_at: "2016-08-24T10:15:00.670Z",
        },
      },
      {
        id: "3",
        latest_message: {
          id: "3",
          body: "Hi!",
          from_user: {
            id: "1",
            avatar_url: "http://placekitten.com/g/300/300",
          },
          created_at: "2016-08-23T10:15:00.670Z",
        },
      },
      {
        id: "4",
        latest_message: {
          id: "4",
          body: "Morning!",
          from_user: {
            id: "5",
            avatar_url: "http://placekitten.com/g/304/304",
          },
          created_at: "2016-08-22T10:15:00.670Z",
        },
      },
      {
        id: "5",
        latest_message: {
          id: "5",
          body: "Pleep!",
          from_user: {
            id: "6",
            avatar_url: "http://placekitten.com/g/305/305",
          },
          created_at: "2016-08-21T10:15:00.670Z",
        },
      },
    ]);
  });

  // TODO: Add more tests
});

// Run all our test suites.  Only necessary in the browser.
mocha.run();
