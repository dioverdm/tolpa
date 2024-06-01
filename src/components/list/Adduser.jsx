import { db, useFirebase } from "../../firebase/Firebase";
import { useState } from "react";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useUserStore } from "../../zustand/userStore";


const AddUser = (props) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();
  const [notFound, setNotFound] = useState(null)
  const firebase = useFirebase();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        console.log("no found")
         setNotFound(<div className="text-xs">
         no user found
       </div>)
      }

    } catch (err) {
      console.log(err);

    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {

      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const timestamp = Date.now();

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: timestamp,
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: timestamp,
        }),
      });

      props.setOpenBox((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4 bg-black/60 rounded-md flex flex-col gap-4 backdrop-blur-lg">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input type="text" placeholder="Nombre de usuario" name="username" className="w-44 bg-gray-100 text-black p-1.5 rounded-md focus:border-none" />
        <button className="text-[#5082FC] font-semibold">Buscar</button>
      </form>
      {user ? (
        <div className="flex gap-8">
          <div className="flex gap-2">
            <img src={user.avatar || "./avatar.png"} alt="" className="w-12 h-12 rounded-md object-cover " />
            <span className="mt-2 font-semibold text-lg">{user.username}</span>
          </div>
          <button className="p-1.5 mt-1.5 w-20 h-8 rounded-md bg-[#5082FC] text-white text-xs font-semibold" onClick={handleAdd}>Agregar</button>
        </div>
      )
      :
      (notFound)
      }
    </div>
  );
};

export default AddUser;
