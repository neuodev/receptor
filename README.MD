# Receptor

Real-time messaging app. Available as a website and as MacOS, Linux, and Windows application.

<p align="center"> 
   <img src="https://user-images.githubusercontent.com/72753578/184505323-7f76a321-28cc-480a-ac9a-ec72a3fd91de.gif" alt="Logo" title="Receptor"/>
</p>

![group_chat](./preview/group_chat.png)
![friends](./preview/friends.png)

<details>
<summary>See more?</summary>

![receptor-chat](./preview/chat.png)
![receptor-chat](./preview/closed_group.png)
![receptor-chat](./preview/empty.png)
![receptor-chat](./preview/sign_in.png)

</details>

## [Database Schema (drawsql.app)](https://drawsql.app/teams/no-sim/diagrams/rustchat)

![Schema](./schema.png)

## Events

```ts
// Websocket events
export enum Event {
  Connect = "connect",
  Disconnect = "disconnect",
  AddFriend = "addFriend",
  AcceptFriend = "acceptFriend",
  RemoveFriend = "removeFriend",
  Notification = "notification",
  Login = "login",
  Logout = "logout",
  GetUser = "getUser",
  JoinRoom = "joinRoom",
  LeaveRoom = "leaveRoom",
  RoomMessage = "sendRoomMsg",
  UpdateUser = "updateUser",
}
```

## API

<details>
   <summary>
      Create User - POST /api/v1/user/register
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
      Login - GET /api/v1/user/login
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
    "createdAt": "2022-08-14T15:52:48.319Z",
    "updatedAt": "2022-08-14T16:33:53.159Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjYwNDk2NDUzLCJleHAiOjE2NjExMDEyNTN9.7THobk-iSSspgKrJQ1Z6e3rlWACIItz62TfJ2D0mTIg",
  "roomsId": [1],
  "friends": [
    {
      "roomId": 1,
      "User": {
        "id": 1,
        "username": "keytolearn",
        "isActive": true,
        "createdAt": "2022-08-14T15:52:48.319Z",
        "updatedAt": "2022-08-14T16:16:11.036Z"
      }
    }
  ]
}
```

</details>
