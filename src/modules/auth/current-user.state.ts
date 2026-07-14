//グローバルステートで管理
import { atom } from "jotai"
import { User } from "../users/user.entity";

export const currentUserAtom = atom<User>();

//const [currentUser, setCurrentUser] = userAtom(currentUserAtom);
//引数の1つだけ使うときはuseAtomValue/useSetAtomを使用