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
  // request for current user's conversations
  const conversations = await getConversations()

  // request for messages in conversation, then pick most recent message from each conversation (chat)
  const recentConversationsMessages = await getConversationsRecentMessages(conversations)

  // sort all the recent messages by Date
  const sortedRecentConversationsMessages = sortRecentMessages(recentConversationsMessages)

  // fetch users data
  const userData = {}
  await fetchUsers(sortedRecentConversationsMessages, userData)

  // return an array of objects with the specified shape/type
  return sortedRecentConversationsMessages.map(message => getSummaryOutputObject(message, userData));
}

function getConversations () {
	return getJSON(`${API_BASE_URL}/conversations`)
}

function getConversationsRecentMessages(conversations) {
	return Promise.all(conversations.map(
          conv => getJSON(`${API_BASE_URL}/conversations/${conv.id}/messages`)
          .then(chatMsgJson => chatMsgJson.reduce(
              (a, b) => (new Date(a.created_at) > new Date(b.created_at) ? a : b)))));
}

function sortRecentMessages (recentConversMessages) {
	return recentConversMessages.sort(
      (a, b) => (new Date(b.created_at) - new Date(a.created_at)));
}

function fetchUsers(sortedRecentConversMessages, userData) {
  return Promise.all(sortedRecentConversMessages.map(
  	async msg => {
  	    if (!userData.hasOwnProperty(msg.from_user_id)) {
  	        userData[msg.from_user_id] = await getJSON(`${API_BASE_URL}/users/${msg.from_user_id}`);
  	    }}));
}

function getSummaryOutputObject(message, userData) {
	return {
	  id: message.id,
      latest_message: {
	    id: message.id,
        body: message.body,
      from_user: {
        id: userData[message.from_user_id].id,
        avatar_url: userData[message.from_user_id].avatar_url,
      },
      created_at: message.created_at,
    }
  }
}

function getJSON(url) {
    return fetch(url)
        .then(res => res.json())
        .catch(err => { throw err });
}

// Configure Mocha, telling both it and chai to use BDD-style tests.
mocha.setup("bdd");
chai.should();

const testConversations = [{
  id: "1",
  unread_message_count: 1,
  with_user_id: "2"
}, {
  id: "2",
  unread_message_count: 0,
  with_user_id: "3"
}, {
  id: "3",
  unread_message_count: 0,
  with_user_id: "4"
}, {
  id: "4",
  unread_message_count: 0,
  with_user_id: "5"
}, {
  id: "5",
  unread_message_count: 0,
  with_user_id: "6"
}]

const testRecentConversationsMessages = [{
  body: "Moi!",
  conversation_id: "1",
  created_at: "2016-08-25T10:15:00.670Z",
  from_user_id: "1",
  id: "1"
}, {
  body: "Hello!",
  conversation_id: "2",
  created_at: "2016-08-24T10:15:00.670Z",
  from_user_id: "3",
  id: "2"
}, {
  body: "Hi!",
  conversation_id: "3",
  created_at: "2016-08-23T10:15:00.670Z",
  from_user_id: "1",
  id: "3"
}, {
  body: "Morning!",
  conversation_id: "4",
  created_at: "2016-08-22T10:15:00.670Z",
  from_user_id: "5",
  id: "4"
}, {
  body: "Pleep!",
  conversation_id: "5",
  created_at: "2016-08-21T10:15:00.670Z",
  from_user_id: "6",
  id: "5"
}]

const testSortedRecentConversationsMessages = [{
  body: "Moi!",
  conversation_id: "1",
  created_at: "2016-08-25T10:15:00.670Z",
  from_user_id: "1",
  id: "1"
}, {
  body: "Hello!",
  conversation_id: "2",
  created_at: "2016-08-24T10:15:00.670Z",
  from_user_id: "3",
  id: "2"
}, {
  body: "Hi!",
  conversation_id: "3",
  created_at: "2016-08-23T10:15:00.670Z",
  from_user_id: "1",
  id: "3"
}, {
  body: "Morning!",
  conversation_id: "4",
  created_at: "2016-08-22T10:15:00.670Z",
  from_user_id: "5",
  id: "4"
}, {
  body: "Pleep!",
  conversation_id: "5",
  created_at: "2016-08-21T10:15:00.670Z",
  from_user_id: "6",
  id: "5"
}]

const testUserData = {
  1: {
    avatar_url: "http://placekitten.com/g/300/300",
    id: "1",
    username: "John"
  },
  3: {
    avatar_url: "http://placekitten.com/g/302/302",
    id: "3",
    username: "Jeremy"
  },
  5: {
    avatar_url: "http://placekitten.com/g/304/304",
    id: "5",
    username: "Charles"
  },
  6: {
    avatar_url: "http://placekitten.com/g/305/305",
    id: "6",
    username: "George"
  }
}

const testRecentConversationSummariesOutput = [
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
]

describe('getRecentConversationSummaries()', () => {
  it('should return the current user\'s latest conversations sorted by latest message\'s timestamp', async () => {
    const result = await getRecentConversationSummaries();
    result.should.deep.equal(testRecentConversationSummariesOutput);
  });

describe('getConversations()', () => {
  it('should return conversations of current user', async() => {
    const result = await getConversations();
    result.should.deep.equal(testConversations);
  });
});

describe('getConversationsRecentMessages()', () => {
  it('should return recent messages of conversations', async() => {
    const result = await getConversationsRecentMessages(testConversations);
    result.should.deep.equal(testRecentConversationsMessages);
  });
});

describe('sortRecentMessages()', () => {
  it('should return conversations messages sorted by the latest message timstamp (most recent conversation first).', async() => {
    const result = sortRecentMessages(testRecentConversationsMessages);
    result.should.deep.equal(testSortedRecentConversationsMessages);
  });
});

describe('fetchUsers()', () => {
  it('should return users data', async() => {
    const userDataResult = {}
    await fetchUsers(testSortedRecentConversationsMessages, userDataResult);
    userDataResult.should.deep.equal(testUserData);
  });
});

describe('getSummaryOutputObject()', () => {
  it('should return user Summary object with the specified shape', async() => {
    const result = getSummaryOutputObject(testSortedRecentConversationsMessages[0], testUserData);
    result.should.deep.equal(testRecentConversationSummariesOutput[0]);
  });
});

});

// Run all our test suites.  Only necessary in the browser.
mocha.run();
