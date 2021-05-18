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

### A1:
* Redundant `/new` suffix in `POST /users/new` handler as POST method already assumes creating resource.
* Redundant `/update`, `/rename` & `update-timezone` suffixes in `POST /users/:id/update`, `POST /users/:id/rename` & `POST /users/:id/update-timezone`, yet it's better to combine all those routes into single one.
* Instead using "POST" method for `/update` and `/rename`, it's better to use "PUT" method (as by HTTP specs, POST is about creating resource whilst PUT is used to update resource available on the server).
* Duplicated action in original URI `DELETE /users/delete?id=:id`, so having intent already specified in method we may use more concise version `DELETE /users/:id`

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

### A2 (C lang):
* *sumA*:
	* Pros:
        - is more typesafe
        - is more generic as it operates only `SIZE` constant defined at top level of module, therefore this constant could be set to other value without need to change `sumA` function.
	* Cons:
        - has worse performance, than `subB` (loops are in order that subsequent adds jump in memory by `SIZE*sizeof(int)` bytes each, this is bad for cache.
        - doesn't support any other screen ratio than 1:1
* *subB*:
	* Pros:
        - has better performance (~10x on coliru (gcc) with O3) due that it does manual loop unrolling.
	* Cons:
        - hardcoded offset of 4 at each loop iteration seems fragile, function do not check if `*a` size is multiple of 4.

I'd prefer `sumA` for most of the cases because it has better readability, is a more struct (it knows the exact dimensions and support other than 1024 if we change constant SIZE).

In case we need the most performat solution, I'd improve and stick to `sumB` (e.g., add asserts that `SIZE % 4 == 0` or rewrite the "for" loop to scan from `a[0][0]` to `a[SIZE][SIZE]`).

more info: <https://stackoverflow.com/questions/45259490/pereferring-function-with-array-or-pointer>

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

### A3 (Ruby lang):
* MD5 is not secure for password hashing (its broken and too fast)
* We use static value for hash salt, we need go generate a new random salt per each password 
* In general, implementing own password generation and storage is bad idea. Best is use existing (verified and secure) solutions like Rails' builtin `has_secure_password` option. 

more info: <https://stackoverflow.com/questions/45265003/password-security-problems>

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

### A4 (JS lang):
* In overall, the function is easy to read and understand, it returns a sum of all deposits for given user.
* However, the function relies on correct input. Function need set of checks prior processing input, that there are required fields in input and it they has correct types, so that invalid input will not led to crash/incorrect output.
* The scope of visibility for `var i = 0` is all function because `var` modificator is used, it may lead to potential errors or unwanted side effects if we'd have large function with the same var used across it. To restrict scope only to selected for loop we may use "let" keyword instead, e.g.: `let i = 0`.
* `Array.prototype.reduce` can be used to iterate through the array and sum elements:
```js
  console.log(
  [1, 2, 3, 4].reduce((a, b) => a + b, 0)) // output: 10
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

### A5 (JS lang):
* `db.game_accounts.findOne()` may return `null`/`undefined` if specified field/value not found, thus we need to check for it fromAccount and toAccount before further processing.
* Update operations are not isolated into atomic operation (transaction), so that if someone write to either `fromAccount.credits` or `toAccount.credits` between our operations, or some of the updates will fail - we end up with incosistent state of data.
As per MongoDB docs, we may use `session.withTransaction` to start a transaction, execute the callback, and commit (or abort on error)

more info:
* <https://stackoverflow.com/questions/45279831/finding-database-related-issue>
* <https://docs.mongodb.com/manual/core/transactions/>

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

### A6 (JS lang):
* It's not easy to judge without context, but I'd propose to have separate functions per each kind of balance increase, so we could avoid `isCredit` check (which could be a potential point of failure) and provide single responsibility per each function.
* Another note again is just an assumption due lack of context, but I'd suggest if we increase balance to some account, shouldn't be deducted from another. To demonstrate the idea I implemented following code:
```js
function Account(debitBalance, creditBalance) {
  this.debitBalance = debitBalance;
  this.creditBalance = creditBalance;
}

Account.prototype.increaseBalance = function(amount, isCredit) {
  if (!isCredit) {
    this.creditBalance -= amount
    this.debitBalance += amount;
  } else {
    this.debitBalance -= amount
    this.creditBalance += amount;
  }
};

acc = new Account(100, 200)
console.log(acc)  // Account { debitBalance: 100, creditBalance: 200 }

acc.increaseBalance(1, true)
console.log(acc) // Account { debitBalance: 99, creditBalance: 201 }

acc.increaseBalance(2, false)
console.log(acc) // Account { debitBalance: 101, creditBalance: 199 }
```

## Q7: List four typical solutions to optimize database query performance
Database queries are getting slow when the database size increases. What are some of the typical solutions to improve performance?

## Q8: Coding task 1
Go to the following JSFiddle: http://applifier.github.io/developer-quiz/q8.html. See the code comments for the assignment. Remember to *click save* and return the url for your fiddle.

## Q9: Coding task 2
Go to the following JSFiddle: http://applifier.github.io/developer-quiz/q9.html. See the code comments for the assignment. Remember to *click save* and return the url for your fiddle.
