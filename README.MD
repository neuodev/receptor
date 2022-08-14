# Receptor

<p align="center"> 
   <img src="https://user-images.githubusercontent.com/72753578/184505323-7f76a321-28cc-480a-ac9a-ec72a3fd91de.gif" alt="Logo" title="Receptor"/>
</p>

## Todo

1. Accept freind request validation
2. Friends table should have a unique compination of `userId` and `frinedId`

3. Update user status on socket disconnection to be `isActive=false`
4. Reduce request size for login
   Should only include important data like the **username + id** only
5. Update the notification events to be more robust
6. Update the `Frinds` table
7. Add groups tables
8. Add `blockUser` event
9. Add endpoint to create groups
   - Create group with users
   - Add group
   - Delete group by owner
   - Leave group
   - Update group name
10. **Stander message format**
11. **Save messages into DB**

## Events

```ts
// Websocket events
enum Event {
  CONNECT = "connect",
  DISCONNECT = "diconnect",
  JOIN = "join",
  ADD_FRIEND = "addFriend",
  ACCEPT_FRIEND = "acceptFriend",
  NOTIFICATION = "notification",
  LOGIN = "login",
  JOIN_ROOM = "joinRoom",
  ROOM_MESSAGE = "roomMessage",
  LEAVE_ROOM = "leaveRoom",
}
```

## Database Schema

![Schema](./schema.png)

## API

<details>
   <summary>
      Create User - POST /api/v1/user
   </summary>

### Reqeust

```json
{
  "username": "Karianne",
  "password": "123456"
}
```

### Response

```json
{
  "userId": 4
}
```

</details>

<details>
   <summary>
      Login - GET /api/v1/login
   </summary>

### Reqeust

```json
{
  "username": "Karianne",
  "password": "123456"
}
```

### Response

```json
{
  "user": {
    "id": 2,
    "username": "Bret",
    "isActive": false,
    "createdAt": "2022-08-14T12:07:41.339Z",
    "updatedAt": "2022-08-14T12:07:41.339Z"
  },
  "friends": [],
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjYwNDc5Mjk5LCJleHAiOjE2NjEwODQwOTl9.BCLBrV1dFNkRRvUBf5fweIrkuSu2yi2rAxCB6z3DnHI"
}
```

</details>
