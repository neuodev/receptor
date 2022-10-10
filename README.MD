# Receptor

<p align="center"> 
   <img src="https://user-images.githubusercontent.com/72753578/184505323-7f76a321-28cc-480a-ac9a-ec72a3fd91de.gif" alt="Logo" title="Receptor"/>
</p>

## Events

```ts
// Websocket events
enum Event {
  Connect = "connect",
  Disconnect = "disconnect",
  AddFriend = "friend/add",
  AcceptFriend = "friend/accept",
  Notification = "notification",
  Login = "user/login",
  GetUser = "user/get",
  JoinRoom = "room/join",
  LeaveRoom = "room/leave",
  RoomMessage = "room/msg",
}
```

## [Database Schema (drawsql.app)](https://drawsql.app/teams/no-sim/diagrams/rustchat)

![Schema](./schema.png)

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
