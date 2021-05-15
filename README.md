# Unity Finland - Developer Quiz

- Please return your answers to Greenhouse.
- Answer with bullet points:
  - Single sentence per bullet point
  - Max 4 per question
- Return in a file named yourname_quiz

## Q1: What controversies do you see in the following API example?
User object API doc

```
GET /users
POST /users/new
POST /users/:id/update
POST /users/:id/rename
POST /users/:id/update-timezone
DELETE /users/delete?id=:id
```
Here are some examples of the behavior:

```
POST /users/new HTTP/1.1
{
  "name": "Cthulhu"
}

HTTP/1.1 200
"Error: Username already exists"
```

## Q2: Which one would you prefer and why?
Both of the functions return the same result for a two dimensional integer array (1024x1024). Which one would you prefer? List pros and/or cons of both functions.

```c
#define SIZE 1024

int sumA(int a[SIZE][SIZE])
{
  int sum = 0;
  for(int y = 0; y < SIZE; y++)
    for(int x = 0; x < SIZE; x++)
      sum += a[x][y];

  return sum;
}

int sumB(int *a)
{
  int sum[4] = {0, 0, 0, 0};

  for( int i = 0; i < SIZE*SIZE; i += 4 )
  {
      sum[0] += a[i+0];
      sum[1] += a[i+1];
      sum[2] += a[i+2];
      sum[3] += a[i+3];
  }

  return sum[0] + sum[1] + sum[2] + sum[3];
}
```
## Q3: What problems related to password security can you see in the following example?
A web service stores user information in a database and uses passwords for authentication. Here's how the user password storing and authentication is implemented in ruby (the actual data storage and retrieval is outside the scope of the example):

```ruby
require 'digest'

class User

  # Use salted passwords
  PASSWORD_SALT="trustno1"

  # Stored password hash will be accessible through user.hashed_password
  attr_accessor :hashed_password

  # Authenticates user against given password and returns true
  # the password matches the stored one
  def verify_password(password)
    if hashed_password.nil? || password.nil?
      false
    else
      User.hash_password(password) == hashed_password
    end
  end

  # Changes user's password
  def change_password(new_password)
    self.hashed_password = User.hash_password(new_password.to_s)
  end

  # Hashes the input with salt
  def self.hash_password(password)
    Digest::MD5.hexdigest(password + PASSWORD_SALT)
  end
end
```

## Q4: What would you give as a feedback for a pull request including this code?
```js
function getDepositHistorySum(user) {
  const deposits = user.transactions.history.deposits;
  let sum = 0;
  for (var i = 0; i < deposits.length; i += 1) {
    sum += deposits[i].amount;
  }
  return sum;
}
```

## Q5: Find database related issues
Developer is writing code to transfer credits from one user to another, he has picked MongoDB as database. What database related issues do you find in the `transferCredits` function? List two of the most critical issues.

```js
function transferCredits(from, to, amt) {
  var fromAccount = db.game_accounts.findOne({"name": from},{"credits": 1});
  var toAccount = db.game_accounts.findOne({"name": to},{"credits": 1});
  if (fromAccount.credits < amt) {
    throw new BalanceError("not enough balance to transfer credits");
  }
  db.game_accounts.update({name: from}, {$set: {credits: fromAccount.credits - amt}});
  db.game_accounts.update({name: to}, {$set: {credits: toAccount.credits + amt}});
}

db.game_accounts.insert({name: "John", credits: 1000});
db.game_accounts.insert({name: "Jane", credits: 1000});

// John transfers credits to Jane
transferCredits("John", "Jane", 100);
```

## Q6: What would you give as a feedback for a pull request including this code?
```js
Account.prototype.increaseBalance = function(amount, isCredit) {
  if (!isCredit) {
    this.debitBalance += amount;
  } else {
    this.creditBalance += amount;
  }
};
```

## Q7: List four typical solutions to optimize database query performance
Database queries are getting slow when the database size increases. What are some of the typical solutions to improve performance?

## Q8: Coding task 1
Go to the following JSFiddle: http://applifier.github.io/developer-quiz/q8.html. See the code comments for the assignment. Remember to *click save* and return the url for your fiddle.

## Q9: Coding task 2
Go to the following JSFiddle: http://applifier.github.io/developer-quiz/q9.html. See the code comments for the assignment. Remember to *click save* and return the url for your fiddle.
