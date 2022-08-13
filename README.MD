# Receptor 

<p align="center"> 
   <img src="https://user-images.githubusercontent.com/72753578/184505174-f7e48f25-6810-40d2-b7cb-8ae5ee151eb2.png" alt="Logo" title="Receptor"/>
</p>

## Todo

1. Accept freind request validation
2. Friends table should have a unique compination of `userId` and `frinedId`
3. Create chat rooms for friends

   - `JoinRoom` evnet
   - `RoomId` should be the id of the `frindiship` record
   - On joining the room latest messages should be sent back to all users with the current status of the users in the room

4. Update user status on socket disconnection to be `isActive=false`
5. Reduce request size for login
   Should only include important data like the **username + id** only
6. Update the notification events to be more robust
7. Update the `Frinds` table
8. Add groups tables
9. Add `blockUser` event
10. Add endpoint to create groups
    - Create group with users
    - Add group
    - Delete group by owner
    - Leave group
    - Update group name
