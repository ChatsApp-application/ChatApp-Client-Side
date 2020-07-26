export interface ChatDetails {
    id?: number;
    from?: string;
    fullDate?: Date;
    message?: string;
    seen?: boolean;
}


// *************** LOGIN PART ***************** //

export interface Login {
    email?: string;
    password?: string;
}

// *************** REGISTER PART ***************** //

export interface SignUp {
    firstName?: string;
    lastName?: string;
    age?: number;
    gender?: string;
    email?: string;
    password?: string;
    country?: string;
}


// *************** USER PART ***************** //


export interface User {
    _id?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    country?: string;
    gender?: string;
    bio?: string;
    online?: string;
    friendRequests?: FriendRequests[];
    notifications?: Notifications[];
    img?: Img;
}

export interface Notifications {
    _id?: string;
    type?: string;
    from?: string;
    to?: string;
    message?: string;
    data?: string;
    fromUser?: FromUser;
}

export interface FromUser {
    _id?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    country?: string;
    gender?: string;
    email?: string;
    bio?: string;
    online?: string;
    img?: Img;
}

export interface FriendRequests {
    _id?: string;
    type?: string;
    from?: string;
    to?: string;
    message?: string;
    date?: string;
    fromUser?: FromUser;
}


// *************** FRIENDS PART ***************** //

export interface Friends {
    _id?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    country?: string;
    gender?: string;
    bio?: string;
    online?: string;
    friends?: [];
    matualFriends?: MutualFriends[];
    img?: Img;
}

export interface MutualFriends {
    _id?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    country?: string;
    gender?: string;
    bio?: string;
    online?: string;
    friends?: [];
    img?: Img;
}

export interface Accept {
    friendRequestId?: string;
    fromId?: string;
}

// *************** FIND PEOPLE PART ***************** //

export interface People {
    _id?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    country?: string;
    gender?: string;
    sent?: boolean;
    mutualFriends?: MutualFriends[];
    img?: Img;
    sendRequest?: boolean;
}

// *************** VISITED PROFILE PART ***************** //

export interface VisitedProfile {
    _id?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    country?: string;
    gender?: string;
    bio?: string;
    online?: boolean;
    img?: Img;
    userFriends?: ProfileFriends[];
    relation?: string;
}

export interface ProfileFriends {
    _id?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    country?: string;
    gender?: string;
    bio?: string;
    online?: string;
    img?: Img;
}

export interface Img {
    url?: string;
    publicId?: string;
}


// *************** MY CHATS LIST PART ***************** //

export interface MyChats {
    userChats?: UserChats[];
    userId?: string;
}

export interface UserChats {
    _id?: string;
    chatHistory?: ChatHistory[];
    lastMessageDate?: string;
    firstUser?: User;
    secondUser?: User;
}

export interface ChatHistory {
    _id?: string;
    date?: string;
    from?: string;
    message?: string;
    seen?: boolean;
}

export interface User {
    _id?: string;
    age?: number;
    bio?: string;
    country?: string;
    email?: string;
    firstName?: string;
    gender?: string;
    img?: Img;
    joinedAt?: string;
    lastName?: string;
}
