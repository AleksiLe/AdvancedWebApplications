//move to different folder
import { Match, IMatch } from "../database/models/Matches";
import { User, IUser } from "../database/models/Users";

//Creates matches for new users from all the old users
const createMatchTable = async (createdUserID: String) => {
  try {
    const allUsers: IUser[] = await User.find();
    const allOtherUsersIDs: String[] = allUsers.map((user) => user._id);
    allOtherUsersIDs.splice(allOtherUsersIDs.indexOf(createdUserID), 1);
    for (let i = 0; i < allOtherUsersIDs.length; i++) {
      const newMatch: IMatch = await Match.create({
        userIDnew: createdUserID,
        userIDold: allOtherUsersIDs[i],
        userNewLiked: null,
        userOldLiked: null,
      });
      await newMatch.save();
    }
  } catch (error: any) {
    console.log(error);
  }
};

//Updates the match document when a user likes or dislikes another user
const updateMatchDocument = async (
  FromUserID: string,
  ToUserID: string,
  Liked: boolean
) => {
  try {
    await Match.findOne({
      userIDnew: FromUserID,
      userIDold: ToUserID,
    }).then(async (match) => {
      if (match) {
        console.log("match found");
        match.userNewLiked = Liked;
        await checkMatch(match);
      }
    });
    await Match.findOne({
      userIDnew: ToUserID,
      userIDold: FromUserID,
    }).then(async (match) => {
      if (match) {
        console.log("match found");
        match.userOldLiked = Liked;
        await checkMatch(match);
      }
    });
  } catch (error: any) {
    console.log(error);
  }
};

//checks if the match is a match or not
//it does not delete the match if there is null in one of the
//fields because in this project we needs users to swipe and
//if it deletes matches from other user dislike there wont be
//much to swipe perhaps
const checkMatch = async (match: IMatch) => {
  try {
    console.log("CheckMatch modified: " + match);
    if (match.userNewLiked === true && match.userOldLiked === true) {
      addNewMatchToUsers(match.userIDnew, match.userIDold);
      match.save();
    } else if (
      (match.userNewLiked === false && match.userOldLiked === false) ||
      (match.userNewLiked === true && match.userOldLiked === false) ||
      (match.userNewLiked === false && match.userOldLiked === true)
    ) {
      match.save();
      //No notification needed
    } else {
      console.log("saving like/dislike matc");
      //if one of the fields is null
      match.save();
    }
  } catch (error: any) {
    console.log(error);
  }
};

const addNewMatchToUsers = async (userID1: string, userID2: string) => {
  try {
    const user1: IUser | null = await User.findById(userID1);
    const user2: IUser | null = await User.findById(userID2);
    if (user1 && user2) {
      user1.matches.push(userID2);
      user2.matches.push(userID1);
      user1.save();
      user2.save();
    }
  } catch (error: any) {
    console.log(error);
  }
};

const getPotentialMatches = async (userID: String) => {
  try {
    let userArray: IUser[] = [];
    const matchNew: IMatch[] | null = await Match.find({
      userIDnew: userID,
      userNewLiked: null,
    });
    if (matchNew) {
      for (let i = 0; i < matchNew.length; i++) {
        const user: IUser | null = (await User.findById(
          matchNew[i].userIDold,
          "-password -email"
        )) as IUser | null;
        if (user) {
          userArray.push(user);
        }
      }
    }
    const matchOld: IMatch[] | null = await Match.find({
      userIDold: userID,
      userOldLiked: null,
    });
    if (matchOld) {
      for (let i = 0; i < matchOld.length; i++) {
        const user: IUser | null = (await User.findById(
          matchOld[i].userIDnew,
          "-password -email"
        )) as IUser | null;
        if (user) {
          userArray.push(user);
        }
      }
    }
    if (userArray.length > 0) {
      return userArray;
    } else {
      console.log(
        "userid: " + userID + " Experienced error: EmptyPotential userArray"
      );
      return null;
    }
  } catch (error) {
    console.log("userid: " + userID + " Experienced error: " + error);
    return null;
  }
};

export { createMatchTable, updateMatchDocument, getPotentialMatches };
