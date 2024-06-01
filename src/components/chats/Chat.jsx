import React, { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import { useUserStore } from "../../zustand/userStore";
import { useChatStore } from "../../zustand/chatStore";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import upload from "../../firebase/upload";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { IoSend } from 'react-icons/io5';
import { useDispatch } from "react-redux";
import { setChatDisplay } from '../../Redux/slices/displaySlice';
import { setDetailsPage } from '../../Redux/slices/detailsSlice';
import EmojiPicker from "emoji-picker-react";
import useWindowResize from "../../custom hooks/WindowResize";

const Chat = () => {
  const [chat, setChat] = useState({});
  const [text, setText] = useState("");
  const [details, setDetails] = useState(true);
  const [display, setDisplay] = useState(true);
  const [open, setOpen] = useState(false)
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user } = useChatStore();
  const endRef = useRef(null);
  const dispatch = useDispatch();
  const { width } = useWindowResize()

  const handleClick = () => {
    setDisplay(prev => !prev);
    dispatch(setChatDisplay(!display));
  };

  const handleDetail = () => {
    setDetails(prev => !prev);
    dispatch(setDetailsPage(details));
  };

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);


  useEffect(() => {
    if (!chatId) {
      console.error("chatId is null or undefined");
      return;
    }

    const unSub = onSnapshot(doc(db, "chats", chatId), res => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      const messageData = {
        senderId: currentUser.id,
        text,
        createdAt: new Date(),
        ...(imgUrl && { img: imgUrl }),
      };

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(messageData),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async id => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImg({
        file: null,
        url: "",
      });

      setText("");
    }
  };

  return (
    <div className=" md:w-[660px] md:border-r md:border-l md:border-gray-500 md:pt-1">
      <div className="top flex p-2 justify-between">
        <div className="flex justify-between text-center gap-2.5 md:gap-4">
          <div className="flex gap-1.5 md:gap-8">
            <div className="text-xl mt-2" onClick={handleClick}>
              <AiOutlineArrowLeft />
            </div>
            <img src={user?.avatar || "./avatar.png"} alt=""
              className="object-cover rounded-full w-10 h-10" />
          </div>
          <h2 className="text-lg font-light mt-1" onClick={handleDetail}>
            {user?.username}
          </h2>
        </div>
        <div className="flex gap-3 mt-1.5 pr-1 md:gap-8" onClick={handleDetail}>
          <div>
            <img src="./phone.png" alt="" className="object-cover rounded-full w-5 h-5" />
          </div>
          <div>
            <img src="./video.png" alt="" className="object-cover rounded-full w-5 h-5" />
          </div>
          <div>
            <img src="./info.png" alt="" className="object-cover rounded-full w-5 h-5" />
          </div>
        </div>
      </div>
      <hr className="opacity-15" />


      <div className={`${width > 1400 ? 'h-[560px] flex flex-col overflow-y-scroll' :
       (width < 400 ? 'flex flex-col overflow-y-scroll h-[520px]' : 'flex flex-col overflow-y-scroll h-[425px]')}`}>
        {chat?.messages && chat.messages.map(message => (
          <div
            className={message.senderId === currentUser?.id ? "message own bg-[#5082FC] my-1.5 mx-1 p-1.5 rounded-md w-48 sm:w-72 sm:px-2"
              : "message m-1.5 p-1.5 rounded-md  w-48 bg-black/25 sm:w-72 sm:px-2"}
            key={message?.createdAt}
          >
            <div className="text-wrap overflow-hidden">
              {message.img && <img src={message.img} alt="" className="w-28 h-28" />}
              <p className="text-lg text-wrap overflow-hidden">{message.text}</p>
              <span className="text-xs font-extralight opacity-70">{format(message.createdAt?.toDate())}</span>
            </div>
            {/* <div ref={endRef}></div> */}
          </div>
        ))}

        {img.url && (
          <div className="message own">
            <div className="">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
      </div>
      <div>
        <hr className="opacity-15" />
      </div>




      <div className="bottom  flex justify-between px-1 mt-2 sm:px-2 relative md:hidden">
        <div className="flex gap-2 bg-black/25 p-2 rounded-md">
          <img className="w-5 h-5 sm:mr-3" src="./emoji.png" alt=""
            onClick={() => setOpen((prev) => !prev)} />
          <div className="absolute bottom-10 right-0">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
          <input
            type="text"
            className="bg-transparent w-44 sm:w-80 "
            placeholder="Escribe un mensaje"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <label htmlFor="file">
            <img src="./img.png" alt="" className="w-6 h-6 sm:mr-3" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./mic.png" alt="" className="w-5 h-5 sm:mr-3" />
          <img src="./camera.png" alt="" className=" hidden sm:inline-block sm:w-6 sm:h-6" />
        </div>
        <button
          className="flex justify-center text-center p-3 rounded-full bg-[#5082FC]"
          onClick={handleSend}
        >
          <IoSend />
        </button>
      </div>

      <div className="bottom hidden  md:flex md:justify-between md:mt-4 md:px-8 relative">

        <label htmlFor="file">
          <img src="./img.png" alt="" className="w-7 h-7 mt-1" />
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleImg}
        />
        <img src="./mic.png" alt="" className="w-6 h-6 mt-2 " />
        <img src="./camera.png" alt="" className="w-6 h-6 mt-2 " />
        <div className="flex flex-row-reverse gap-2 rounded-md">
          <img className="w-6 h-6 ml-3 mt-2 " src="./emoji.png" alt=""
            onClick={() => setOpen(prev => !prev)} />
          <div className="absolute bottom-10 ">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
          <input
            type="text"
            className=" w-80 bg-black/25 p-2 rounded-md lg:w-[360px]"
            placeholder="Escribe un mensaje"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

        </div>
        <button
          className="flex justify-center text-center p-3 rounded-full bg-[#5082FC]"
          onClick={handleSend}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default Chat;
