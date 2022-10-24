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

For full API documentation try import this [postman collection](./receptor-api.postman_collection.json)

<details>
   <summary>
      Register - POST /api/v1/user/register
   </summary>

### Reqeust

```ts
type Body = {
  username: string;
  email: string;
  password: string;
};
```

### Response

```ts
type Response = {
  userId: number;
};
```

</details>

<details>
   <summary>
      Login - POST /api/v1/user/login
   </summary>

### Reqeust

```ts
type Body = {
  email: string;
  password: string;
};
```

### Response

```ts
type Response = {
  user: User;
  token: string;
};
```

</details>

<details>
  <summary>
    Get users - GET /api/v1/user
  </summary>

### Reqeust

| Query Param. | Description                      | Type   | Default      |
| ------------ | -------------------------------- | ------ | ------------ |
| q            | Search by `email` and `username` | string | Empty string |
| page         | Number of the current page       | number | 1            |
| limit        | Number of items per response     | number | 10           |

### Response

```ts
type Reponse = {
  users: Array<User>;
  count: number;
};
```

</details>

<details>
  <summary>
    Get friends - GET /api/v1/user/friends
  </summary>

### Reqeust

Access only by authorized users

```ts
type Headers = {
  authorization: string; // Bearer auth token
};
```

### Response

```ts
type Reponse = Array<User & { roomId: number }>;
```

</details>

<details>
  <summary>
    Get room messages - GET /api/v1/room/:roomId
  </summary>

### Reqeust

Access only by authorized users

```ts
type Headers = {
  authorization: string; // Bearer auth token
};
```

### Response

```ts
type Reponse = Array<Message & { user: User }>;
```

</details>

<details>
  <summary>
    Get user groups - GET /api/v1/group
  </summary>

### Reqeust

Access only by authorized users

```ts
type Headers = {
  authorization: string; // Bearer auth token
};
```

### Response

```ts
type Reponse = Array<{
  id: number;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Data;
  participants: Array<User>;
}>;
```

</details>
<details>
  <summary>
    Create new group- POST /api/v1/group
  </summary>

### Reqeust

```ts
type Body = {
  groupName: string;
  userIds: number[];
};
```

### Response

```ts
type Reponse = {
  roomId: number;
};
```

</details>

<details>
  <summary>
    Delete group - DELETE /api/v1/group/:groupId - Owner only
  </summary>

### Reqeust

Access only by authorized users

```ts
type Headers = {
  authorization: string; // Bearer auth token
};
```

### Response

```ts
type Reponse = {
  roomId: number;
};
```

</details>
<details>
  <summary>
    Leave group - DELETE /api/v1/group/:groupId/leave 
  </summary>

### Reqeust

Access only by authorized users

```ts
type Headers = {
  authorization: string; // Bearer auth token
};
```

### Response

```ts
type Reponse = {
  roomId: number;
};
```

</details>
